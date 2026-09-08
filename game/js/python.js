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

// ── 그림 ──────────────────────────────────────────────
// matplotlib은 글자를 그릴 때 자기가 가진 폰트만 쓴다. 한글 폰트를 하나 넣어주지 않으면
// 축 이름과 제목이 전부 네모로 나온다. 그림을 쓰는 코드일 때만 받아서 등록한다.
const KR_FONT_URL = "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/nanumgothic/NanumGothic-Regular.ttf";
const KR_FONT_PATH = "/nanum.ttf";

const SETUP_PLOTS = [
  "import os, matplotlib",
  'matplotlib.use("AGG")',  // 화면이 없는 곳이므로 파일로만 그린다
  "import matplotlib.pyplot as _plt",
  "from matplotlib import font_manager as _fm",
  'if os.path.exists("' + KR_FONT_PATH + '"):',
  '    _fm.fontManager.addfont("' + KR_FONT_PATH + '")',
  '    _plt.rcParams["font.family"] = _fm.FontProperties(fname="' + KR_FONT_PATH + '").get_name()',
  '_plt.rcParams["axes.unicode_minus"] = False',
  '_plt.rcParams["figure.figsize"] = (5.2, 3.0)',
  '_plt.rcParams["figure.dpi"] = 110',
  '_plt.rcParams["savefig.bbox"] = "tight"',
  // 작업 단말이 어두운 화면이라 그림도 같은 색으로 맞춘다. 흰 종이가 끼면 눈이 아프다.
  '_plt.rcParams["figure.facecolor"] = "#15181e"',
  '_plt.rcParams["axes.facecolor"] = "#15181e"',
  '_plt.rcParams["savefig.facecolor"] = "#15181e"',
  '_plt.rcParams["text.color"] = "#e6e8ec"',
  '_plt.rcParams["axes.labelcolor"] = "#e6e8ec"',
  '_plt.rcParams["axes.edgecolor"] = "#2b313b"',
  '_plt.rcParams["xtick.color"] = "#99a0ad"',
  '_plt.rcParams["ytick.color"] = "#99a0ad"',
  '_plt.rcParams["grid.color"] = "#2b313b"',
  '_plt.rcParams["axes.prop_cycle"] = _plt.cycler(color=["#6ea8fe", "#5fd48a", "#ef6f6f", "#d9a441", "#a78bfa"])',
  // 노트북에서 하던 대로 plt.show() 를 써도 되게 두되, "화면이 없다"는 경고는 내보내지 않는다.
  // 그림은 문장이 끝난 뒤에 이쪽에서 알아서 거둬간다.
  "_plt.show = lambda *a, **k: None",
].join("\n");

// 지금 열려 있는 그림들을 png로 거둬온다. 학습자 이름들과 섞이지 않게 따로 둔 자리에서 돌린다.
// 여기서 그림을 닫지 않는 것이 중요하다 — 한 문장씩 실행하면 그리기가 여러 문장에 나뉘어 있어서,
// 문장마다 닫아버리면 다음 문장이 빈 그림 위에 제목만 얹는 꼴이 된다.
const HARVEST_PLOTS = [
  "import sys, json",
  "_imgs = []",
  'if "matplotlib.pyplot" in sys.modules:',
  "    import io as _io, base64 as _b64",
  "    import matplotlib.pyplot as _p",
  "    for _n in _p.get_fignums():",
  "        _b = _io.BytesIO()",
  '        _p.figure(_n).savefig(_b, format="png")',
  "        _imgs.append(_b64.b64encode(_b.getvalue()).decode())",
  "json.dumps(_imgs)",
].join("\n");

let plotsReady = null;

function usesPlots(code) {
  return /matplotlib|pyplot|plt\./.test(code);
}

// 그림 도구는 필요한 순간에 한 번만 준비한다. 폰트를 못 받아도 그림 자체는 나온다.
function preparePlots(pyodide, onStatus) {
  if (!plotsReady) {
    plotsReady = (async () => {
      onStatus("그림 도구를 준비하는 중…");
      await pyodide.loadPackage(["matplotlib"]);
      loadedPackages.add("matplotlib");
      try {
        const res = await fetch(KR_FONT_URL);
        if (res.ok) pyodide.FS.writeFile(KR_FONT_PATH, new Uint8Array(await res.arrayBuffer()));
      } catch (err) {
        // 폰트를 못 받으면 한글만 네모로 나온다. 그것 때문에 실행을 막지는 않는다.
      }
      await pyodide.runPythonAsync(SETUP_PLOTS);
      onStatus("");
    })().catch(function () {
      plotsReady = null; // 다음 실행에서 다시 시도한다
    });
  }
  return plotsReady;
}

// 그려둔 그림을 모두 닫는다. 새 실행을 시작할 때와 채점이 끝났을 때만 부른다.
async function closePlots(pyodide) {
  if (!plotsReady) return;
  try {
    await pyodide.runPythonAsync('import matplotlib.pyplot as _p; _p.close("all")');
  } catch (err) {}
}

async function collectPlots(pyodide) {
  if (!plotsReady) return [];
  const ns = pyodide.globals.get("dict")();
  try {
    const json = await pyodide.runPythonAsync(HARVEST_PLOTS, { globals: ns });
    return JSON.parse(json || "[]");
  } catch (err) {
    return [];
  } finally {
    ns.destroy();
  }
}

// ── 파일 다리 ─────────────────────────────────────────
// 탐색기에 보이는 파일은 브라우저 메모리(js/fs.js)에만 있어서, 파이썬에서는 열 수 없다.
// 실행하기 직전에 같은 경로로 옮겨 심어 pd.read_csv("work/자료/○○.csv") 가 그대로 되게 한다.
const PY_HOME = "/home/pyodide/";

function syncFilesToPython(pyodide) {
  if (typeof FS === "undefined" || !FS.allFiles) return;
  const enc = new TextEncoder();
  FS.allFiles("").forEach(function (f) {
    const full = PY_HOME + f.path;
    try {
      pyodide.FS.mkdirTree(full.slice(0, full.lastIndexOf("/")));
      pyodide.FS.writeFile(full, enc.encode(f.content == null ? "" : String(f.content)));
    } catch (err) {
      // 옮기지 못한 파일 하나 때문에 실행을 막지는 않는다.
    }
  });
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
  if (usesPlots(userCode)) await preparePlots(pyodide, onStatus);
  syncFilesToPython(pyodide);
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
    // 채점하느라 그린 그림은 결과 창에 내보내지 않는다. 다음 실행에 섞이지 않게 여기서 치운다.
    if (usesPlots(userCode)) await closePlots(pyodide);
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
  await closePlots(pyodide); // 새로 실행할 때는 지난번 그림을 지우고 시작한다
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
  // 그림을 쓰는 코드면 폰트까지 먼저 준비해 둔다. 그리고 나서 설정하면 이미 그려진
  // 글자에는 반영되지 않으므로, 반드시 학습자 코드보다 앞에 와야 한다.
  if (usesPlots(code)) await preparePlots(pyodide, onStatus);
  syncFilesToPython(pyodide);
  await loadImports(pyodide, code, onStatus);

  const padded = "\n".repeat(Math.max(0, startLine - 1)) + code;
  let out = "";
  pyodide.setStdout({ batched: (s) => (out += s + "\n") });
  pyodide.setStderr({ batched: (s) => (out += s + "\n") });
  try {
    await pyodide.runPythonAsync(padded, { globals: ns });
    return { ok: true, output: out, plots: await collectPlots(pyodide) };
  } catch (err) {
    return { ok: false, output: out, error: shortenTraceback(err), plots: await collectPlots(pyodide) };
  } finally {
    pyodide.setStdout({});
    pyodide.setStderr({});
  }
}
