// 브라우저 콘솔에 붙여 넣어 쓰는 검사다. 장마다 desk 를 세워 보고
// 씬이 실제로 그려지는지, 가리킴 선택자가 화면에 있는지, wait 이 터지지 않는지 본다.
//
// 게임 화면에서:  fetch('tools/check_beats.js').then(r=>r.text()).then(eval)
(async function () {
  var out = [];
  for (var ci = 0; ci < CHAPTERS.length; ci++) {
    var ch = CHAPTERS[ci];
    var conf = ch.desk;
    if (!conf) continue;

    // 그 장이 깔아 두는 파일을 올려 둔다. 선택자와 wait 이 이걸 본다.
    (conf.files || []).forEach(function (f) {
      if (!FS.exists(f.path)) FS.write(f.path, f.content, { readOnly: f.readOnly, kind: f.kind });
    });
    (conf.beats || []).forEach(function (b) {
      (b.addFiles || []).forEach(function (f) {
        if (!FS.exists(f.path)) FS.write(f.path, f.content, { readOnly: f.readOnly, kind: f.kind });
      });
    });
    IDE.draw();

    var problems = [];
    (conf.beats || []).forEach(function (b, bi) {
      if (!b.lines || !b.lines.length) problems.push("씬 " + (bi + 1) + ": 대사가 없음");
      (b.lines || []).forEach(function (l, li) {
        var t = typeof l === "string" ? l : l.text;
        if (t === undefined || t === null) problems.push("씬 " + (bi + 1) + " " + (li + 1) + "번 줄: text 없음");
      });
      // 가리킴이 css 선택자면 화면에 실제로 있어야 한다
      // 눌러야 생기는 것들. 그 씬이 나올 때는 화면에 있다.
      var TRANSIENT = [".newform"];
      var spots = [b.spot].concat((b.lines || []).map(function (l) { return l && l.spot; }));
      spots.forEach(function (s) {
        if (!s || typeof s !== "string") return;
        if (TRANSIENT.some(function (t) { return s.indexOf(t) >= 0; })) return;
        try {
          if (!document.querySelector(s)) problems.push("씬 " + (bi + 1) + ": 가리킬 것이 없음 " + s);
        } catch (e) {
          problems.push("씬 " + (bi + 1) + ": 선택자가 잘못됨 " + s);
        }
      });
      // wait 은 그냥 불러 봐서 터지지만 않으면 된다
      if (typeof b.wait === "function") {
        try {
          b.wait({ reported: false, ended: false });
        } catch (e) {
          problems.push("씬 " + (bi + 1) + ": wait 에서 터짐 — " + e.message);
        }
      }
      if (typeof b.reject === "function") {
        try {
          b.reject();
        } catch (e) {
          problems.push("씬 " + (bi + 1) + ": reject 에서 터짐 — " + e.message);
        }
      }
    });

    out.push({
      장: ch.id + " " + ch.title,
      씬: (conf.beats || []).length,
      대사: (conf.beats || []).reduce(function (n, b) { return n + (b.lines || []).length; }, 0),
      일기: (ch.diary || []).length,
      문제: problems,
    });
  }
  window.__beats = out;
  console.log("검사한 장 " + out.length);
  var bad = out.filter(function (r) { return r.문제.length; });
  console.log("문제 있는 장 " + bad.length);
  bad.forEach(function (r) {
    console.log(r.장);
    r.문제.forEach(function (p) { console.log("   " + p); });
  });
  return out;
})();
