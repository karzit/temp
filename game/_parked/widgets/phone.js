// 휴대폰 화면 위젯. 홈 → 받은 편지함 → 메일 본문.
// 읽고 넘기는 장면이 아니라 직접 눌러서 여는 장면이라, 첫 조작을 여기서 익히게 된다.
registerWidget("phone", function (host, config, api) {
  var apps = config.apps || [];
  var mails = config.mails || [];
  var goal = config.goal || 0; // 이 번호의 메일을 열면 통과

  var screen = document.createElement("div");
  screen.className = "phone";
  var quip = document.createElement("div");
  quip.className = "phone-quip";
  host.append(screen, quip);

  function say(t) {
    quip.textContent = t || "";
  }

  function home() {
    say("");
    screen.innerHTML = "";
    var grid = document.createElement("div");
    grid.className = "app-grid";

    apps.forEach(function (app, i) {
      var wrap = document.createElement("button");
      wrap.className = "app" + (app.shake ? " shake" : "");
      wrap.innerHTML =
        "<span class='icon'>" + app.icon + (app.badge ? "<i class='badge'>" + app.badge + "</i>" : "") + "</span>" +
        "<span class='app-name'></span>";
      wrap.querySelector(".app-name").textContent = app.name;
      wrap.onclick = function () {
        if (app.opens === "mail") inbox();
        else say(app.quip || "지금은 그럴 때가 아닌 것 같다.");
      };
      grid.appendChild(wrap);
    });

    screen.appendChild(grid);
  }

  function inbox() {
    say("");
    screen.innerHTML = "";
    screen.appendChild(bar("받은 편지함", home));

    var list = document.createElement("div");
    list.className = "mail-list";
    mails.forEach(function (m, i) {
      var row = document.createElement("button");
      row.className = "mail-row" + (m.unread ? " unread" : "");
      var from = document.createElement("div");
      from.className = "from";
      from.textContent = m.from;
      var subj = document.createElement("div");
      subj.className = "subj";
      subj.textContent = m.subject;
      row.append(from, subj);
      row.onclick = function () {
        m.unread = false;
        read(i);
      };
      list.appendChild(row);
    });
    screen.appendChild(list);
  }

  function read(i) {
    var m = mails[i];
    screen.innerHTML = "";
    screen.appendChild(bar(m.from, inbox));

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
    screen.appendChild(body);

    if (i === goal) {
      api.solved("메일을 읽었습니다.");
      say("");
    } else {
      say(m.quip || "");
    }
  }

  function bar(title, back) {
    var b = document.createElement("div");
    b.className = "phone-bar";
    var btn = document.createElement("button");
    btn.className = "back";
    btn.textContent = "‹";
    btn.onclick = back;
    var t = document.createElement("span");
    t.textContent = title;
    b.append(btn, t);
    return b;
  }

  home();
});
