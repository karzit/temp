// 챕터 파일에서 대본을 읽을 수 있는 문서 하나로 뽑는다.
//   node tools/dump_script.js > 대본.md
//
// beats 안의 wait 는 함수라 그대로는 읽을 수 없어서, 가짜 IDE/FS 를 물려 놓고
// 한 번씩 불러보며 무엇을 기다리는지 알아낸다(몇 번째 문장까지인지는 이분 탐색).
const fs = require("fs");
const path = require("path");
const DIR = path.join(__dirname, "..", "content");

// ── 대본이 기대는 바깥 것들을 흉내 낸다 ────────────────
let probe = { steps: null, files: [], breakpoints: [], tabs: false, lastRun: false };
global.IDE = {
  panes: [{ tabs: [], active: null }],
  lastRun: null,
  stepAt: function (p) { probe.steps = p; return probe.stepValue || 0; },
  hasBreakpoint: function (p, line) { probe.breakpoints.push(p + ":" + line); return false; },
};
global.FS = {
  isFile: function (p) { probe.files.push(p); return probe.fileValue === true; },
  exists: function (p) { probe.files.push(p); return probe.fileValue === true; },
  node: () => null,
  list: () => [],
  read: () => "",
};
global.runCheck = () => ({ then: () => ({ catch: () => null }) });
global.Self = { mount: () => {}, say: () => {}, note: () => {}, hush: () => {} };
// 고장 대사는 무작위라 대본에 넣지 않는다. 대본은 정해진 것만 담는다.
global.Glitch = { weave: (list) => list, roll: () => null };

for (const f of ["ch00", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10", "ch11", "ch12", "ch13", "ch14", "ch15", "ch16", "ch17", "ch18", "ch19", "ch20", "ch21", "ch22", "ch23", "ch24", "ch25", "ch26", "ch27", "ch28"]) {
  eval(fs.readFileSync(path.join(DIR, f + ".js"), "utf8"));
}
const CHAPTERS = [CH00, CH01, CH02, CH03, CH04, CH05, CH06, CH07, CH08, CH09, CH10, CH11, CH12, CH13, CH14, CH15, CH16, CH17, CH18, CH19, CH20, CH21, CH22, CH23, CH24, CH25, CH26, CH27, CH28];

// ── wait 가 무엇을 기다리는지 알아낸다 ──────────────────
function describeWait(waitFn, beat, docs) {
  if (!waitFn) return null;
  const reset = () => { probe = { steps: null, files: [], breakpoints: [], tabs: false, lastRun: false }; };

  // 1) 완료 보고
  reset();
  try { if (waitFn({ reported: true, ended: true })) return "완료 보고를 누르면"; } catch (e) {}

  // 2) 아무것도 안 한 상태에서 이미 참이면 그냥 넘어가는 beat
  reset();
  let idle = false;
  try { idle = !!waitFn({ reported: false, ended: false }); } catch (e) {}

  // 3) 한 문장씩 실행 — 몇 번째까지인지 이분 탐색
  reset();
  probe.stepValue = 999;
  let big = false;
  try { big = !!waitFn({}); } catch (e) {}
  if (probe.steps && big) {
    const target = probe.steps;
    let lo = 1, hi = 999;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      reset(); probe.stepValue = mid;
      let ok = false;
      try { ok = !!waitFn({}); } catch (e) {}
      if (ok) hi = mid; else lo = mid + 1;
    }
    return `${target} 를 ${lo}번째 문장까지 실행하면`;
  }

  // 4) 익힘 다 맞히기
  reset();
  const drill = (beat.addFiles || []).map((f) => f.path).find((p) => p.includes("/익힘/"));
  if (drill) {
    IDE.lastRun = { ok: true, path: drill, output: "전부 맞았습니다" };
    let ok = false;
    try { ok = !!waitFn({}); } catch (e) {}
    IDE.lastRun = null;
    if (ok) return `${drill} 를 다 맞히면`;
  }

  // 5) 파일 만들기
  reset(); probe.fileValue = true;
  let made = false;
  try { made = !!waitFn({}); } catch (e) {}
  probe.fileValue = false;
  if (made && probe.files.length) return `${probe.files[0]} 를 만들면`;

  // 6) 중단점
  reset();
  try { waitFn({}); } catch (e) {}
  if (probe.breakpoints.length) return `${probe.breakpoints[0].replace(":", " 의 ")}번 줄에 중단점을 찍으면`;

  // 7) 의뢰서(또는 다른 문서) 열기 — 이 챕터에 나온 문서를 하나씩 열어 본다
  for (const doc of docs) {
    IDE.panes = [{ tabs: [], active: null }, { tabs: [doc], active: doc }];
    let ok = false;
    try { ok = !!waitFn({}); } catch (e) {}
    IDE.panes = [{ tabs: [], active: null }];
    if (ok) return `${doc} 를 열면`;
  }

  if (idle) return null;
  // 알아보지 못한 조건은 함수를 그대로 보여준다. 짐작해서 틀리게 적는 것보다 낫다.
  const src = String(waitFn).replace(/\s+/g, " ").replace(/^function \(\w*\) \{ ?/, "").replace(/ ?\}$/, "").trim();
  if (/^return false/.test(src)) return "(여기서 멈춤 — 업무 종료를 눌러야 하루가 끝남)";
  return "조건: `" + src + "`";
}

function spotText(s) {
  if (!s) return "";
  if (typeof s === "string") return ` 〔가리킴: ${s}〕`;
  return ` 〔가리킴: "${s.text}" (${s.in})〕`;
}

const out = [];
out.push("# 바로벤토 — 전체 대본\n");
out.push("`content/*.js` 에서 자동으로 뽑은 것입니다. 고칠 곳은 이 문서가 아니라 챕터 파일입니다.");
out.push("다시 뽑으려면 `game` 폴더에서 `node tools/dump_script.js > 대본.md` 를 실행하세요.\n");

for (const [chIndex, ch] of CHAPTERS.entries()) {
  out.push(`\n---\n\n# ${ch.title}\n`);
  out.push(`파일: \`content/${ch.id}.js\` · 씬: ${ch.scenes.join(" → ")}\n`);
  const conf = ch.desk;
  if ((conf.files && conf.files.length) || chIndex > 0) {
    out.push("**시작할 때 깔려 있는 파일**\n");
    for (const f of conf.files || []) out.push(`- \`${f.path}\``);
    // 첫 장을 뺀 나머지는 전날 만든 것 위에서 시작한다(scenes.js 가 저장해 둔 것을 되살린다).
    if (chIndex > 0) out.push("- (전날까지 만든 파일도 그대로 남아 있습니다)");
    out.push("");
  }
  // 이 챕터에 나오는 문서(의뢰서·참고 문서) 경로를 미리 모아 둔다.
  const docs = [];
  for (const f of conf.files || []) if (f.path.endsWith(".md")) docs.push(f.path);
  for (const b of conf.beats) for (const f of b.addFiles || []) if (f.path.endsWith(".md")) docs.push(f.path);

  conf.beats.forEach((b, i) => {
    out.push(`\n### ${i + 1}\n`);
    for (const f of b.addFiles || []) {
      if (f.kind === "image" || /\.(png|jpe?g|gif|webp|svg)$/i.test(f.path)) {
        out.push(`🖼 **참고 이미지 도착 — \`${f.path}\`** (오른쪽 화면에 그림으로 표시)\n`);
        continue;
      }
      const kind = f.kind === "brief" ? "의뢰서" : f.path.includes("/익힘/") ? "익힘" : f.path.includes("/연습/") ? "연습" : f.path.includes("/참고/") ? "참고" : "파일";
      // content 대신 src(실제 파일)로 준 자료는 디스크에서 읽어 온다.
      const body = f.src ? fs.readFileSync(path.join(__dirname, "..", f.src), "utf8") : f.content;
      const lang = f.path.endsWith(".py") ? "python" : f.path.endsWith(".csv") ? "" : "markdown";
      out.push(`📄 **${kind} 도착 — \`${f.path}\`**\n`);
      out.push("```" + lang);
      out.push(body.trimEnd());
      out.push("```\n");
    }
    for (const f of b.show || []) out.push(`👁 \`${f.path}\` 를 ${f.pane === 1 ? "오른쪽" : "왼쪽"} 화면에 띄움\n`);
    for (const l of b.lines || []) {
      const line = typeof l === "string" ? { text: l } : l;
      const who = line.who ? `**${line.who}**: ` : "";
      out.push(`- ${who}${line.text}${spotText(line.spot !== undefined ? line.spot : b.spot)}`);
    }
    if (b.menu) out.push(`\n〔업무 메뉴: ${b.menu.map((m) => ({ brief: "의뢰 확인", report: "완료 보고", end: b.endLabel || "업무 종료" }[m] || m)).join(" · ")}〕`);
    if (b.report) out.push("〔완료 보고를 누르면 제출한 파일을 실제로 돌려 채점〕");
    const w = describeWait(b.wait, b, docs);
    if (w) out.push(`\n▶ ${w} 다음으로`);
    if (b.nudge) {
      if (Array.isArray(b.nudge)) {
        const parts = b.nudge.map((n) => {
          const e = typeof n === "string" ? { text: n } : n;
          return `"${e.text}"${spotText(e.spot)}`;
        });
        out.push(`\n💤 한참 조용하면: {${parts.join(", ")}}`);
      } else {
        out.push(`\n💤 한참 조용하면: "${b.nudge}"`);
      }
    }
  });
  if (ch.diary) {
    out.push("\n### 일기\n");
    out.push("> " + ch.diary.map((l) => (l === "" ? "" : l)).join("\n> "));
  }
}
console.log(out.join("\n"));
