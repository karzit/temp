// 화면(씬)들. 소개 → 휴대폰·문 → 방 → 모니터.
// 각 씬은 stage를 통째로 쓰고, 끝나면 done()을 부른다.
var Scenes = {};

// ── 소개 ────────────────────────────────────────────────
Scenes.intro = function (stage, chapter, done) {
  stage.className = "stage scene-intro";
  var box = document.createElement("div");
  box.className = "intro-box";

  (chapter.intro || []).forEach(function (line) {
    var p = document.createElement("p");
    p.className = "intro-line" + (line === "" ? " gap" : "");
    p.innerHTML = rich(line);
    box.appendChild(p);
  });

  var start = document.createElement("button");
  start.className = "big-btn";
  start.textContent = "시작하기";
  start.onclick = done;
  box.appendChild(start);

  stage.appendChild(box);
};

// ── 휴대폰 → 시선 위로 → 문 ─────────────────────────────
Scenes.phone = function (stage, chapter, done) {
  stage.className = "stage scene-phone";
  var conf = chapter.phone;

  var camera = document.createElement("div");
  camera.className = "camera";

  // 위 칸이 문, 아래 칸이 휴대폰. 카메라가 위로 올라가면 문이 보인다.
  var doorView = document.createElement("div");
  doorView.className = "view door-view";
  var door = document.createElement("button");
  door.className = "door";
  door.innerHTML = "<i class='knob'></i>";
  door.onclick = function () {
    stage.classList.add("entering");
    setTimeout(done, 700);
  };
  var doorHint = document.createElement("div");
  doorHint.className = "door-hint";
  doorHint.textContent = "Dartconarin거리 1956-0718";
  doorView.append(door, doorHint);

  var phoneView = document.createElement("div");
  phoneView.className = "view phone-view";
  var phone = document.createElement("div");
  phone.className = "phone-full";
  phoneView.appendChild(phone);

  camera.append(doorView, phoneView);
  stage.appendChild(camera);

  var state = { screen: "home", mail: null, read: {} };

  function header(title, back) {
    var bar = document.createElement("div");
    bar.className = "pbar";
    var t = document.createElement("span");
    t.textContent = title;
    var b = document.createElement("button");
    b.className = "pback";
    b.textContent = "‹";
    b.onclick = back;
    bar.append(t, b); // 되돌아가기 버튼은 우측 상단
    return bar;
  }

  function lookUp() {
    camera.classList.add("look-up");
    stage.classList.add("door-ready");
  }

  function drawHome() {
    phone.innerHTML = "";
    var top = document.createElement("div");
    top.className = "pstatus";
    top.textContent = "421950. 10. 01.";
    var grid = document.createElement("div");
    grid.className = "app-grid";
    (conf.apps || []).forEach(function (app) {
      var b = document.createElement("button");
      b.className = "app" + (app.shake ? " shake" : "");
      b.innerHTML =
        "<span class='icon'>" + app.icon + (app.badge ? "<i class='badge'>" + app.badge + "</i>" : "") + "</span>";
      var n = document.createElement("span");
      n.className = "app-name";
      n.textContent = app.name;
      b.appendChild(n);
      b.onclick = function () {
        if (app.opens === "mail") drawInbox();
        else quip(app.quip || "지금은 그럴 때가 아닌 것 같다.");
      };
      grid.appendChild(b);
    });
    var q = document.createElement("div");
    q.className = "pquip";
    phone.append(top, grid, q);
  }

  function quip(text) {
    var q = phone.querySelector(".pquip");
    if (q) q.textContent = text;
  }

  function drawInbox() {
    phone.innerHTML = "";
    phone.appendChild(
      header("받은 편지함", function () {
        // 메일에서 빠져나오면 고개를 든다.
        drawHome();
        lookUp();
      })
    );
    var list = document.createElement("div");
    list.className = "mail-list";
    (conf.mails || []).forEach(function (m, i) {
      var row = document.createElement("button");
      row.className = "mail-row" + (m.unread && !state.read[i] ? " unread" : "");
      var f = document.createElement("div");
      f.className = "from";
      f.textContent = m.from;
      var s = document.createElement("div");
      s.className = "subj";
      s.textContent = m.subject;
      row.append(f, s);
      row.onclick = function () {
        state.read[i] = true;
        drawMail(i);
      };
      list.appendChild(row);
    });
    phone.appendChild(list);
  }

  function drawMail(i) {
    var m = conf.mails[i];
    phone.innerHTML = "";
    phone.appendChild(header(m.from, drawInbox));
    var body = document.createElement("div");
    body.className = "mail-body";
    var h = document.createElement("div");
    h.className = "mail-subject";
    h.textContent = m.subject;
    body.appendChild(h);
    (m.body || "").split("\n").forEach(function (line) {
      var p = document.createElement("p");
      p.textContent = line;
      body.appendChild(p);
    });
    if (m.quip) {
      var q = document.createElement("div");
      q.className = "pquip";
      q.textContent = m.quip;
      body.appendChild(q);
    }
    phone.appendChild(body);
  }

  drawHome();
};

// ── 불 꺼진 방 ──────────────────────────────────────────
Scenes.room = function (stage, chapter, done) {
  stage.className = "stage scene-room";
  var room = document.createElement("div");
  room.className = "room";

  var desk = document.createElement("div");
  desk.className = "desk";
  var monitor = document.createElement("button");
  monitor.className = "monitor-far";
  monitor.innerHTML = "<span class='glow'></span>";
  var stand = document.createElement("i");
  stand.className = "stand";
  desk.append(monitor, stand);

  var hint = document.createElement("div");
  hint.className = "room-hint";
  hint.textContent = "누가 켜두고 퇴근했는지, 모니터만 켜져 있다.";

  monitor.onclick = function () {
    stage.classList.add("zooming");
    hint.textContent = "";
    setTimeout(done, 900);
  };

  room.append(desk, hint);
  stage.appendChild(room);
};

// ── 모니터 앞 (에디터 + Aistb) ──────────────────────────
//
// 하루치 진행은 beats 배열이 정한다. 한 beat은
//   lines : Aistb가 할 말 (플레이어가 눌러야 넘어간다)
//   spot  : 말하는 동안 가리킬 곳 (선택자 또는 { text, in })
//   wait  : 참이 될 때까지 기다린다. 없으면 말이 끝나는 대로 다음 beat
//   menu  : 이 beat에서 열어줄 업무 메뉴 ("report" | "end")
//   reject: 잘못한 것이 있으면 그 이유를 돌려준다(문자열). 없으면 null
Scenes.desk = function (stage, chapter, done) {
  stage.className = "stage scene-desk";
  var conf = chapter.desk;

  var monitor = document.createElement("div");
  monitor.className = "monitor";
  var screen = document.createElement("div");
  screen.className = "screen";
  monitor.appendChild(screen);
  stage.appendChild(monitor);

  // 작업 폴더 준비
  FS.reset();
  FS.mkdir("work");
  (conf.files || []).forEach(function (f) {
    FS.write(f.path, f.content, { readOnly: f.readOnly, kind: f.kind });
  });

  IDE.panes = [{ tabs: [], active: null }];
  IDE.focus = 0;
  IDE.selectedDir = null;
  IDE.newform = null;
  IDE.expanded = { work: true };
  IDE.lastRun = null;
  IDE.mount(screen);
  Aistb.mount(screen);

  var i = 0;
  var finished = false;
  var lastReject = null;
  // wait()가 볼 수 있는 상태. 메뉴에서 무엇을 눌렀는지가 여기 담긴다.
  var ctx = { reported: false, ended: false };
  var currentBrief = (conf.files || []).filter(function (f) {
    return f.kind === "brief";
  }).map(function (f) {
    return f.path;
  })[0] || null;

  function beat() {
    return conf.beats[i];
  }

  function play() {
    var b = beat();
    if (!b) return;
    lastReject = null;

    // 이 beat에서 도착하는 파일이 있으면 먼저 깔아둔다.
    if (b.addFiles) {
      b.addFiles.forEach(function (f) {
        // 이미 있는 파일은 건드리지 않는다. 같은 beat을 다시 듣더라도
        // 플레이어가 써둔 코드가 처음 상태로 되돌아가면 안 된다.
        if (!FS.exists(f.path)) {
          FS.write(f.path, f.content, { readOnly: f.readOnly, kind: f.kind });
        }
        if (f.kind === "brief") currentBrief = f.path;
        if (f.open !== undefined && f.open !== false) {
          openIn(f.path, f.open === true ? 0 : f.open);
        }
      });
      IDE.draw();
    }
    // 이미 있는 파일을 다시 띄운다(참고 문서를 오른쪽에 펼쳐놓고 설명할 때).
    if (b.show) {
      b.show.forEach(function (f) {
        openIn(f.path, f.pane || 0);
      });
      IDE.draw();
    }
    actions();

    var lines = b.lines.map(function (l) {
      var line = typeof l === "string" ? { text: l } : { text: l.text, who: l.who, tone: l.tone };
      // 줄마다 따로 가리킬 곳이 없으면 beat의 것을 쓴다.
      line.spot = l.spot !== undefined ? l.spot : b.spot || null;
      return line;
    });

    Aistb.speak(lines, function () {
      actions();
      if (!b.wait) {
        next();
        return;
      }
      evaluate(); // 이미 조건을 채워둔 경우도 있다
    });
  }

  function next() {
    if (i >= conf.beats.length - 1) {
      actions();
      return;
    }
    i += 1;
    saveNow();
    play();
  }

  function evaluate() {
    var b = beat();
    if (!b || !b.wait || Aistb.isSpeaking()) return;
    if (b.wait(ctx)) {
      Aistb.point(null);
      if (b.menu && b.menu.indexOf("report") >= 0) ctx.reported = false; // 다음 의뢰를 위해 되돌린다
      next();
      return;
    }
    if (b.reject) {
      var why = b.reject();
      if (why && why !== lastReject) {
        lastReject = why;
        Aistb.speak([{ text: why, tone: "bad" }]);
        return;
      }
      if (!why) lastReject = null;
    }
    actions();
  }

  function actions() {
    var b = beat() || {};
    var menu = b.menu || [];
    var list = [];

    list.push({
      label: "의뢰 확인",
      highlight: menu.indexOf("brief") >= 0,
      run: openBrief,
    });

    if (menu.indexOf("report") >= 0) {
      list.push({
        label: "완료 보고",
        highlight: true,
        enabled: !ctx.reported && !ctx.checking,
        run: function () {
          var check = b.report || conf.report;
          var verdict = check ? check() : null;

          // 코드를 실제로 돌려 확인하는 경우에는 답이 늦게 온다.
          if (verdict && typeof verdict.then === "function") {
            ctx.checking = true;
            actions();
            Aistb.say("제출하신 것을 확인하고 있습니다…");
            verdict.then(function (problem) {
              ctx.checking = false;
              finishReport(problem);
            });
            return;
          }
          finishReport(verdict);
        },
      });
    }

    list.push({ label: "지금 할 일 다시 듣기", run: play });
    list.push({ label: "환경설정", run: openSettings });

    if (menu.indexOf("end") >= 0) {
      list.push({
        label: "업무 종료",
        highlight: true,
        run: function () {
          if (finished) return;
          finished = true;
          ctx.ended = true;
          Aistb.stopIdle();
          stage.classList.add("power-off");
          setTimeout(done, 900);
        },
      });
    }

    Aistb.setActions(list);
  }

  function finishReport(problem) {
    if (problem) {
      Aistb.speak([{ text: problem, tone: "bad" }]);
      actions();
      return;
    }
    ctx.reported = true;
    evaluate();
  }

  // 오른쪽(1번)에 띄울 때도 손은 왼쪽 코드 창에 남긴다.
  function openIn(path, paneIndex) {
    if (paneIndex === 1 && !IDE.isSplit()) IDE.toggleSplit();
    var pane = IDE.panes[paneIndex] || IDE.panes[0];
    if (pane.tabs.indexOf(path) < 0) pane.tabs.push(path);
    pane.active = path;
    IDE.focus = 0;
    IDE.draw();
  }

  function openBrief() {
    if (!currentBrief) {
      Aistb.speak(["지금 들어온 의뢰가 없습니다."]);
      return;
    }
    if (!IDE.isSplit()) IDE.toggleSplit();
    // 의뢰서는 오른쪽에 두고 손은 왼쪽(코드)에 남긴다. 한 번만 그리도록 직접 넣는다.
    var right = IDE.panes[1];
    if (right.tabs.indexOf(currentBrief) < 0) right.tabs.push(currentBrief);
    right.active = currentBrief;
    IDE.focus = 0;
    IDE.draw();
    evaluate();
  }

  IDE.onChange = function () {
    Aistb.poke();
    evaluate();
  };
  IDE.onRun = function (path, result) {
    Aistb.poke();
    if (!result.ok) {
      Aistb.speak([
        { text: pick(conf.errorLines) || "코드가 도중에 멈췄습니다. 아래 빨간 글씨를 먼저 읽어보세요.", tone: "bad" },
      ]);
      return;
    }
    evaluate();
  };

  Aistb.watchIdle(75, function () {
    if (Aistb.isSpeaking()) return; // 이미 할 말이 떠 있으면 끼어들지 않는다
    var b = beat();
    Aistb.speak([(b && b.nudge) || pick(conf.idleLines) || "천천히 하셔도 됩니다."]);
  });

  function saveNow() {
    var st = loadProgress();
    st.beat = i;
    saveProgress(st);
  }

  function openSettings() {
    var back = document.createElement("div");
    back.className = "modal-back";
    var box = document.createElement("div");
    box.className = "modal";
    box.innerHTML = "<h3>환경설정</h3>";

    box.appendChild(
      radioRow("글자 크기", ["작게", "보통", "크게"], Settings.get("fontSize", "보통"), function (v) {
        Settings.set("fontSize", v);
      })
    );
    box.appendChild(
      radioRow("화면 효과", ["켜기", "끄기"], Settings.get("motion", "켜기"), function (v) {
        Settings.set("motion", v);
      })
    );

    var close = document.createElement("button");
    close.className = "big-btn small";
    close.textContent = "닫기";
    close.onclick = function () {
      back.remove();
    };
    box.appendChild(close);
    back.appendChild(box);
    back.onclick = function (e) {
      if (e.target === back) back.remove();
    };
    screen.appendChild(back);
  }

  function radioRow(label, options, value, onPick) {
    var row = document.createElement("div");
    row.className = "set-row";
    var l = document.createElement("span");
    l.textContent = label;
    row.appendChild(l);
    var group = document.createElement("span");
    group.className = "set-group";
    options.forEach(function (o) {
      var b = document.createElement("button");
      b.className = "set-opt" + (o === value ? " on" : "");
      b.textContent = o;
      b.onclick = function () {
        group.querySelectorAll(".set-opt").forEach(function (x) {
          x.classList.remove("on");
        });
        b.classList.add("on");
        onPick(o);
      };
      group.appendChild(b);
    });
    row.appendChild(group);
    return row;
  }

  setTimeout(play, 600);
};

// ── 하루의 끝, 일기 ─────────────────────────────────────
Scenes.diary = function (stage, chapter, done) {
  stage.className = "stage scene-intro";
  var box = document.createElement("div");
  box.className = "intro-box diary";

  (chapter.diary || []).forEach(function (line) {
    var p = document.createElement("p");
    p.className = "intro-line" + (line === "" ? " gap" : "");
    p.innerHTML = rich(line);
    box.appendChild(p);
  });

  var next = document.createElement("button");
  next.className = "big-btn";
  next.textContent = "다음날로";
  next.onclick = done;
  box.appendChild(next);

  stage.appendChild(box);
};

function pick(list) {
  if (!list || !list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

// 대본에서 쓸 수 있는 표시는 **굵게** 와 ~~취소선~~ 둘뿐이다.
function rich(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/~~(.+?)~~/g, "<s>$1</s>");
}
