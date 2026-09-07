// 브라우저 안에서 진짜 파이썬을 돌린다(Pyodide).
// 페이지에 들어오는 순간부터 미리 받아두므로, 실제로 실행할 때는 기다릴 일이 거의 없다.
const PYODIDE_VERSION = "0.26.4";
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise = null;
const loadedPackages = new Set();

let pythonReady = false;
let pythonLoadStart = 0;
const readyWaiters = [];

function isPythonReady() {
  return pythonReady;
}

function onPythonReady(cb) {
  if (pythonReady) cb();
  else readyWaiters.push(cb);
}

function preloadPython() {
  // 실패해도 게임은 계속 돌아간다. 실제로 실행할 때 다시 시도한다.
  ensurePython(function () {}).catch(function () {});
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.onload = resolve;
    el.onerror = () => reject(new Error("Pyodide를 내려받지 못했습니다. 인터넷 연결을 확인하세요."));
    document.head.appendChild(el);
  });
}

function ensurePython(onStatus = () => {}) {
  if (!pyodidePromise) {
    pythonLoadStart = Date.now();
    pyodidePromise = (async () => {
      onStatus("파이썬을 브라우저에 설치하는 중… 처음 한 번만 기다리면 됩니다 (10~20초)");
      await loadScript(CDN + "pyodide.js");
      const pyodide = await globalThis.loadPyodide({ indexURL: CDN });
      onStatus("");
      pythonReady = true;
      readyWaiters.splice(0).forEach(function (cb) {
        cb();
      });
      return pyodide;
    })().catch((err) => {
      pyodidePromise = null; // 실패하면 다시 시도할 수 있게 되돌린다.
      throw err;
    });
  }
  return pyodidePromise;
}

async function ensurePackages(pyodide, packages, onStatus) {
  const missing = packages.filter((p) => !loadedPackages.has(p));
  if (missing.length === 0) return;
  onStatus(`${missing.join(", ")} 가져오는 중…`);
  await pyodide.loadPackage(missing);
  missing.forEach((p) => loadedPackages.add(p));
  onStatus("");
}

// 코드 안의 import를 보고 필요한 것(numpy 등)을 알아서 가져온다.
async function loadImports(pyodide, code, onStatus) {
  try {
    onStatus("필요한 도구를 가져오는 중…");
    await pyodide.loadPackagesFromImports(code);
  } catch (err) {
    // 없는 라이브러리를 부른 경우. 실행할 때 파이썬이 직접 알려주게 둔다.
  }
  onStatus("");
}

/**
 * 학습자 코드를 돌리고, 이어서 채점 코드를 돌린다.
 * 채점 코드는 assert로 조건을 확인한다 — 통과하면 아무 일도 일어나지 않고,
 * 틀리면 AssertionError의 메시지가 그대로 피드백이 된다.
 */
async function runCheck(userCode, checkCode, { packages = [], onStatus = () => {} } = {}) {
  const pyodide = await ensurePython(onStatus);
  await ensurePackages(pyodide, packages, onStatus);
  await loadImports(pyodide, userCode, onStatus);

  let out = "";
  pyodide.setStdout({ batched: (s) => (out += s + "\n") });
  pyodide.setStderr({ batched: (s) => (out += s + "\n") });

  const ns = pyodide.globals.get("dict")();
  // 채점 코드가 학습자가 쓴 원문을 볼 수 있게 해둔다("for문 없이 풀기" 같은 조건에 쓴다).
  ns.set("__source__", userCode);
  try {
    await pyodide.runPythonAsync(userCode, { globals: ns });
  } catch (err) {
    return { ok: false, output: out, error: shortenTraceback(err), stage: "run" };
  } finally {
    pyodide.setStdout({});
    pyodide.setStderr({});
  }

  if (!checkCode) {
    ns.destroy();
    return { ok: true, output: out };
  }

  try {
    await pyodide.runPythonAsync(checkCode, { globals: ns });
    return { ok: true, output: out };
  } catch (err) {
    return { ok: false, output: out, error: shortenTraceback(err), stage: "check" };
  } finally {
    ns.destroy();
  }
}

// Pyodide의 트레이스백은 내부 프레임까지 길게 나온다. 학습자에게 의미 있는 부분만 남긴다.
function shortenTraceback(err) {
  const text = String(err.message || err);
  const lines = text.trimEnd().split("\n");
  const last = lines[lines.length - 1] || "";
  const assertion = last.startsWith("AssertionError: ") ? last.slice("AssertionError: ".length) : null;
  if (assertion) return assertion;

  // 학습자 코드에서 난 예외는 'File "<exec>"' 프레임부터가 본인 코드다.
  const start = lines.findIndex((l) => l.includes('File "<exec>"'));
  const body = start >= 0 ? lines.slice(start) : [last];
  return body.join("\n");
}

// ── 한 문장씩 실행하기 ────────────────────────────────
// 문장 경계는 파이썬 자신에게 물어본다. 여러 줄에 걸친 문장도 한 덩어리로 잡힌다.
// 돌려주는 것은 [[시작줄, 끝줄], ...] 이고 줄 번호는 1부터 센다.
async function planSteps(src) {
  const pyodide = await ensurePython();
  const ns = pyodide.globals.get("dict")();
  ns.set("_src", src);
  let out = null;
  try {
    out = await pyodide.runPythonAsync(
      ["import ast, json", "json.dumps([[n.lineno, n.end_lineno] for n in ast.parse(_src).body])"].join("\n"),
      { globals: ns }
    );
  } catch (err) {
    out = null; // 문법이 깨져 있으면 나눌 수 없다. 통째로 돌리며 파이썬이 알려주게 둔다.
  }
  ns.destroy();
  return out ? JSON.parse(out) : null;
}

// 한 파일을 여러 번에 나눠 실행하는 동안 변수를 이어서 갖고 있을 자리.
async function newSession(onStatus = () => {}) {
  const pyodide = await ensurePython(onStatus);
  return pyodide.globals.get("dict")();
}

function endSession(ns) {
  try {
    ns.destroy();
  } catch (err) {}
}

// startLine만큼 빈 줄을 앞에 붙여, 에러에 찍히는 줄 번호가 원본 파일과 맞게 한다.
async function runInSession(ns, code, startLine = 1, onStatus = () => {}) {
  const pyodide = await ensurePython(onStatus);
  await loadImports(pyodide, code, onStatus);

  const padded = "\n".repeat(Math.max(0, startLine - 1)) + code;
  let out = "";
  pyodide.setStdout({ batched: (s) => (out += s + "\n") });
  pyodide.setStderr({ batched: (s) => (out += s + "\n") });
  try {
    await pyodide.runPythonAsync(padded, { globals: ns });
    return { ok: true, output: out };
  } catch (err) {
    return { ok: false, output: out, error: shortenTraceback(err) };
  } finally {
    pyodide.setStdout({});
    pyodide.setStderr({});
  }
}
