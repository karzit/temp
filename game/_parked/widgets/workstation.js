// 작업 단말 — 이 게임의 기본 조작이 전부 여기 들어 있다.
// 의뢰 확인 / 폴더·파일 관리 / 코드 작성과 실행 / 완료 보고.
//
// 상태는 위젯 밖(WS)에 둔다. 튜토리얼은 여러 비트에 걸쳐 진행되는데,
// 비트가 바뀌면 DOM은 다시 그려지지만 만들어둔 파일은 남아 있어야 하기 때문이다.
var WS = {
  tab: "request",
  cwd: ["work"],
  tree: { work: { type: "dir", children: {} } },
  requestOpened: false,
  openFile: null, // 편집 중인 파일의 경로 배열
  ran: false,
  completed: false,
  request: {
    from: "바로벤토 교육팀",
    title: "[신입 교육] 작업 단말 사용법 익히기",
    lines: [
      "1. 이 의뢰서를 끝까지 읽습니다.",
      "2. work 폴더 안에 first_task 폴더를 만들고, 그 안에 hello.py 파일을 만듭니다.",
      "3. hello.py 를 열어 print(\"안녕하세요\") 를 적고 실행합니다.",
      "4. 이 의뢰서로 돌아와 완료 보고를 누릅니다.",
    ],
  },
};

function wsNode(path) {
  var node = { children: WS.tree };
  for (var i = 0; i < path.length; i++) {
    if (!node.children || !node.children[path[i]]) return null;
    node = node.children[path[i]];
  }
  return node;
}

function wsHasFile(path) {
  var n = wsNode(path);
  return !!n && n.type === "file";
}

registerWidget("workstation", function (host, config, api) {
  var task = config.task;

  var tabs = document.createElement("div");
  tabs.className = "ws-tabs";
  var body = document.createElement("div");
  body.className = "ws-body";
  var guide = document.createElement("div");
  guide.className = "ws-guide";
  guide.textContent = config.guide || "";

  host.className = "widget workstation";
  host.append(tabs, body, guide);

  function check() {
    if (task === "request" && WS.requestOpened) api.solved("의뢰서를 확인했습니다.");
    if (task === "files" && wsHasFile(["work", "first_task", "hello.py"])) api.solved("파일을 만들었습니다.");
    if (task === "code" && WS.ran) api.solved("코드를 실행했습니다.");
    if (task === "complete" && WS.completed) api.solved("의뢰를 완료했습니다.");
  }

  function draw() {
    tabs.innerHTML = "";
    [["request", "의뢰함"], ["files", "파일"]].forEach(function (t) {
      var b = document.createElement("button");
      b.className = "ws-tab" + (WS.tab === t[0] ? " on" : "");
      b.textContent = t[1];
      if (t[0] === "request" && !WS.requestOpened) {
        var dot = document.createElement("i");
        dot.className = "ws-dot";
        b.appendChild(dot);
      }
      b.onclick = function () {
        WS.tab = t[0];
        draw();
      };
      tabs.appendChild(b);
    });

    body.innerHTML = "";
    if (WS.tab === "request") drawRequest();
    else if (WS.openFile) drawEditor();
    else drawFiles();
    check();
  }

  // ── 의뢰함 ────────────────────────────────────────────
  function drawRequest() {
    var card = document.createElement("div");
    card.className = "ws-card";

    var from = document.createElement("div");
    from.className = "ws-from";
    from.textContent = WS.request.from;
    var title = document.createElement("div");
    title.className = "ws-title";
    title.textContent = WS.request.title;
    card.append(from, title);

    if (!WS.requestOpened) {
      var open = document.createElement("button");
      open.className = "primary";
      open.textContent = "의뢰서 열기";
      open.onclick = function () {
        WS.requestOpened = true;
        draw();
      };
      card.appendChild(open);
      body.appendChild(card);
      return;
    }

    WS.request.lines.forEach(function (l) {
      var p = document.createElement("p");
      p.className = "ws-line";
      p.textContent = l;
      card.appendChild(p);
    });

    var report = document.createElement("button");
    report.className = "primary";
    report.textContent = WS.completed ? "완료 보고됨" : "완료 보고";
    report.disabled = WS.completed;
    var verdict = document.createElement("div");
    verdict.className = WS.completed ? "verdict ok" : "verdict";
    verdict.textContent = WS.completed ? "완료 보고가 접수되었습니다." : "";

    report.onclick = function () {
      if (!wsHasFile(["work", "first_task", "hello.py"])) {
        verdict.className = "verdict bad";
        verdict.textContent = "work/first_task/hello.py 가 아직 없습니다. 파일 탭에서 만들어 주세요.";
        return;
      }
      if (!WS.ran) {
        verdict.className = "verdict bad";
        verdict.textContent = "hello.py 를 아직 실행하지 않았습니다. 파일을 열어 실행해 주세요.";
        return;
      }
      WS.completed = true;
      verdict.className = "verdict ok";
      verdict.textContent = "완료 보고가 접수되었습니다.";
      draw();
    };

    card.append(report, verdict);
    body.appendChild(card);
  }

  // ── 파일 ──────────────────────────────────────────────
  function drawFiles() {
    var bar = document.createElement("div");
    bar.className = "ws-path";
    WS.cwd.forEach(function (seg, i) {
      var b = document.createElement("button");
      b.textContent = seg;
      b.onclick = function () {
        WS.cwd = WS.cwd.slice(0, i + 1);
        draw();
      };
      bar.appendChild(b);
      if (i < WS.cwd.length - 1) bar.appendChild(document.createTextNode(" / "));
    });
    body.appendChild(bar);

    var here = wsNode(WS.cwd);
    var list = document.createElement("div");
    list.className = "ws-list";
    var names = Object.keys(here.children || {});
    if (names.length === 0) {
      var empty = document.createElement("div");
      empty.className = "ws-empty";
      empty.textContent = "비어 있습니다.";
      list.appendChild(empty);
    }
    names.forEach(function (name) {
      var item = here.children[name];
      var row = document.createElement("button");
      row.className = "ws-item";
      row.innerHTML = "<span class='ws-ico'>" + (item.type === "dir" ? "📁" : "📄") + "</span>";
      var label = document.createElement("span");
      label.textContent = name;
      row.appendChild(label);
      row.onclick = function () {
        if (item.type === "dir") WS.cwd = WS.cwd.concat([name]);
        else WS.openFile = WS.cwd.concat([name]);
        draw();
      };
      list.appendChild(row);
    });
    body.appendChild(list);

    var row = document.createElement("div");
    row.className = "btn-row";
    row.append(makeButton("새 폴더", "dir"), makeButton("새 파일", "file"));
    body.appendChild(row);
  }

  function makeButton(label, kind) {
    var b = document.createElement("button");
    b.className = "ghost";
    b.textContent = label;
    b.onclick = function () {
      var form = document.createElement("div");
      form.className = "ws-newform";
      var input = document.createElement("input");
      input.type = "text";
      input.placeholder = kind === "dir" ? "폴더 이름" : "파일 이름 (예: hello.py)";
      var ok = document.createElement("button");
      ok.className = "primary";
      ok.textContent = "만들기";
      var msg = document.createElement("div");
      msg.className = "verdict";

      ok.onclick = function () {
        var name = input.value.trim();
        if (!name) {
          msg.className = "verdict bad";
          msg.textContent = "이름을 입력해 주세요.";
          return;
        }
        var here = wsNode(WS.cwd);
        if (here.children[name]) {
          msg.className = "verdict bad";
          msg.textContent = "같은 이름이 이미 있습니다.";
          return;
        }
        here.children[name] =
          kind === "dir" ? { type: "dir", children: {} } : { type: "file", content: "" };
        draw();
      };
      input.onkeydown = function (e) {
        if (e.key === "Enter") ok.click();
      };

      form.append(input, ok, msg);
      b.parentNode.parentNode.appendChild(form);
      input.focus();
      b.disabled = true;
    };
    return b;
  }

  // ── 에디터 ────────────────────────────────────────────
  function drawEditor() {
    var file = wsNode(WS.openFile);
    var path = WS.openFile.join("/");

    var bar = document.createElement("div");
    bar.className = "ws-path";
    var back = document.createElement("button");
    back.textContent = "‹ 파일 목록";
    back.onclick = function () {
      WS.openFile = null;
      draw();
    };
    var name = document.createElement("span");
    name.textContent = "  " + path;
    bar.append(back, name);

    var ta = document.createElement("textarea");
    ta.className = "editor";
    ta.spellcheck = false;
    ta.value = file.content;
    ta.oninput = function () {
      file.content = ta.value;
    };

    var row = document.createElement("div");
    row.className = "btn-row";
    var run = document.createElement("button");
    run.className = "primary";
    run.textContent = "실행";
    var out = document.createElement("div");
    out.className = "code-out";
    out.textContent = "아직 실행하지 않았습니다.";

    run.onclick = function () {
      run.disabled = true;
      out.className = "code-out";
      out.textContent = "";
      runCheck(file.content, null, {
        onStatus: function (s) {
          guide.textContent = s || config.guide || "";
        },
      })
        .then(function (r) {
          out.className = "code-out " + (r.ok ? "ok" : "bad");
          var printed = (r.output || "").trim();
          out.textContent = (r.ok ? printed : printed + "\n" + r.error).trim() || "(출력이 없습니다)";
          // 에러 없이 끝났어도 화면에 아무것도 안 나오면 "실행해봤다"고 보기 어렵다.
          if (r.ok && printed) {
            WS.ran = true;
            check();
          }
        })
        .catch(function (err) {
          out.className = "code-out bad";
          out.textContent = String(err.message || err);
        })
        .then(function () {
          run.disabled = false;
          guide.textContent = config.guide || "";
        });
    };

    row.appendChild(run);
    body.append(bar, ta, row, out);
  }

  draw();
});
