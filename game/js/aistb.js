// Aistb — 모니터 우측 하단에 상주하는 지원 AI.
// 말할 때는 플레이어가 눌러야 넘어가고, 가리킬 것이 있으면 그 옆까지 걸어간다.
var Aistb = {
  el: null,
  bubble: null,
  menu: null,
  parent: null,
  veil: null,
  actions: [],
  idleTimer: null,
  onIdle: null,
  _advance: null,

  mount: function (parent) {
    var wrap = document.createElement("div");
    wrap.className = "aistb";

    var bubble = document.createElement("div");
    bubble.className = "aistb-bubble";
    bubble.hidden = true;

    var body = document.createElement("button");
    body.className = "aistb-body";
    body.title = "Aistb";
    body.innerHTML =
      "<span class='aistb-face'><i class='eye left'></i><i class='eye right'></i><i class='mouth'></i></span>";

    var menu = document.createElement("div");
    menu.className = "aistb-menu";
    menu.hidden = true;

    body.onclick = function (e) {
      e.stopPropagation();
      // 말하는 중에 본체를 누르면 메뉴가 아니라 다음 말로 넘어간다.
      if (Aistb.isSpeaking()) {
        Aistb._advance();
        return;
      }
      Aistb.toggleMenu();
    };
    document.addEventListener("click", function () {
      Aistb.closeMenu();
    });

    wrap.append(bubble, menu, body);
    parent.appendChild(wrap);

    Aistb.el = wrap;
    Aistb.bubble = bubble;
    Aistb.menu = menu;
    Aistb.parent = parent;
    Aistb.setDecay(Aistb.decay); // 씬이 바뀌어도 지금 단계를 그대로 이어간다
    return wrap;
  },

  // ── 고장 단계 ─────────────────────────────────────────
  // 0이 평소이고, 숫자가 커질수록 눈이 자주 빨개진다.
  // 말투가 나빠지는 것과 도움이 줄어드는 것은 여기가 아니라 챕터의 대사가 정한다.
  //
  // **소수점을 쓸 수 있다.** 3.4 는 3단계의 생김새에 3과 4 사이의 빈도다.
  // 악화는 연속적이어야 하는데(앞으로.md) 정수 네 칸으로는 열두 장을 이어 갈 수 없다.
  decay: 0,
  BLINK: { 1: 17, 2: 8, 3: 3.5, 4: 6 }, // 단계별 눈이 튀는 간격(초). css 가 이 값을 쓴다
  setDecay: function (level) {
    Aistb.decay = level || 0;
    if (!Aistb.el) return;
    var tier = Math.floor(Aistb.decay);
    for (var n = 1; n <= 4; n++) Aistb.el.classList.remove("decay-" + n);
    if (tier > 0) Aistb.el.classList.add("decay-" + tier);
    // 같은 단계 안에서도 소수점만큼 더 자주 튄다. 끝까지 가면 간격이 절반 가까이 된다.
    var base = Aistb.BLINK[tier];
    if (!base) {
      Aistb.el.style.removeProperty("--eye-glitch"); // 평소로 돌아왔으면 자국을 남기지 않는다
      return;
    }
    var secs = base - base * 0.45 * (Aistb.decay - tier);
    Aistb.el.style.setProperty("--eye-glitch", secs.toFixed(2) + "s");
  },

  // ── 말하기 ────────────────────────────────────────────
  say: function (text, opts) {
    if (!Aistb.bubble) return;
    var o = opts || {};
    Aistb.bubble.hidden = false;
    Aistb.bubble.className = "aistb-bubble" + (o.tone ? " " + o.tone : "");
    Aistb.bubble.innerHTML = "";
    if (o.who) {
      var w = document.createElement("span");
      w.className = "aistb-who";
      w.textContent = o.who;
      Aistb.bubble.appendChild(w);
    }
    var body = document.createElement("span");
    body.innerHTML = Aistb.format(text);
    Aistb.bubble.appendChild(body);

    if (Aistb._target && !Aistb._resting) requestAnimationFrame(Aistb.place);

    Aistb.el.classList.add("talking");
    clearTimeout(Aistb._talkTimer);
    Aistb._talkTimer = setTimeout(function () {
      Aistb.el.classList.remove("talking");
    }, 900);
    Aistb.poke();
  },

  // 대사에서 쓸 수 있는 표시는 **굵게** 와 ~~취소선~~ 둘뿐이다.
  format: function (text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/~~(.+?)~~/g, "<s>$1</s>");
  },

  hush: function () {
    if (Aistb.bubble) Aistb.bubble.hidden = true;
  },

  // Aistb가 말할 때는 플레이어가 눌러야 넘어간다. 혼자 넘어가지 않는다.
  speak: function (items, onDone) {
    var list = (items || [])
      .filter(function (x) {
        return x;
      })
      .map(function (x) {
        return typeof x === "string" ? { text: x } : x;
      });

    // 고장이 깊으면 하려던 말 사이사이에 엉뚱한 말이 끼어든다(js/glitch.js).
    // 원래 말을 지우지는 않는다 — 아직 가르치는 중인 장이 있다.
    if (typeof Glitch !== "undefined") list = Glitch.weave(list, Aistb.decay);

    Aistb.clearVeil();
    // 독백이 떠 있으면 그 가림막을 걷는다. 둘이 겹치면 화면이 두 배로 어두워진다.
    if (typeof Self !== "undefined") Self.clearVeil();
    if (list.length === 0) {
      if (onDone) onDone();
      return;
    }

    Aistb.closeMenu();
    var veil = document.createElement("div");
    veil.className = "veil";
    var tip = document.createElement("span");
    tip.className = "veil-tip";
    veil.appendChild(tip);
    Aistb.parent.appendChild(veil);
    Aistb.veil = veil;

    var i = -1;
    function next() {
      i += 1;
      if (i >= list.length) {
        Aistb.clearVeil();
        Aistb.rest();
        if (onDone) onDone();
        return;
      }
      var line = list[i];
      if (line.spot !== undefined) Aistb.point(line.spot);
      Aistb.say(line.text, { who: line.who, tone: line.tone });
      tip.textContent = i < list.length - 1 ? "눌러서 다음 →" : "눌러서 계속";
    }
    veil.onclick = function (e) {
      e.stopPropagation();
      next();
    };
    Aistb._advance = next;
    next();
  },

  // 가리키던 표시는 그대로 두고 몸만 원래 자리로 돌아간다.
  rest: function () {
    if (!Aistb._lastSpot) return;
    Aistb._resting = true;
    Aistb.goHome();
  },

  clearVeil: function () {
    if (Aistb.veil) {
      Aistb.veil.remove();
      Aistb.veil = null;
    }
    Aistb._advance = null;
  },

  isSpeaking: function () {
    return !!Aistb.veil;
  },

  // ── 가리키기 ──────────────────────────────────────────
  // 대상에 테두리를 두르고, Aistb가 그 옆으로 이동한다.
  // spot 은 두 가지 형태를 받는다.
  //   "선택자"                        — 화면 요소 하나
  //   { text: "찾을 말", in: "선택자" } — 그 안에 있는 특정 문장이나 단어
  // opts.move 가 false면 표시만 남기고 Aistb는 제자리(우측 하단)로 돌아간다.
  point: function (spot, opts) {
    var move = !opts || opts.move !== false;
    Aistb._lastSpot = spot || null;
    Aistb._resting = !move;
    Aistb.unspot();
    if (!spot) {
      Aistb._target = null;
      Aistb.goHome();
      return;
    }

    var target = null;
    if (typeof spot === "string") {
      target = Aistb.parent.querySelector(spot);
      if (target) target.classList.add("spotlight");
    } else if (spot && spot.text) {
      target = Aistb.spotText(spot.text, spot.in);
    }

    if (!target) {
      Aistb._target = null;
      Aistb.goHome();
      return;
    }
    if (target.scrollIntoView) target.scrollIntoView({ block: "nearest" });
    if (move) Aistb.moveTo(target);
    else Aistb.goHome();
  },

  // 글 안의 특정 대목을 감싸서 표시한다. textarea 안의 글자는 감쌀 수 없어 대상이 아니다.
  spotText: function (needle, within) {
    var scope = within ? Aistb.parent.querySelector(within) : Aistb.parent;
    if (!scope) return null;

    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var at = node.nodeValue.indexOf(needle);
      if (at < 0) continue;
      var after = node.splitText(at);
      after.splitText(needle.length);
      var mark = document.createElement("span");
      mark.className = "spotlight spot-text";
      after.parentNode.replaceChild(mark, after);
      mark.appendChild(after);
      return mark;
    }
    return null;
  },

  // 화면을 다시 그리면 표시가 날아가므로, 가리키던 곳을 다시 잡아준다.
  repoint: function () {
    if (Aistb._lastSpot) Aistb.point(Aistb._lastSpot, { move: !Aistb._resting });
  },

  unspot: function () {
    if (!Aistb.parent) return;
    Aistb.parent.querySelectorAll(".spot-text").forEach(function (mark) {
      var parent = mark.parentNode;
      while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
      parent.removeChild(mark);
      parent.normalize();
    });
    Aistb.parent.querySelectorAll(".spotlight").forEach(function (el) {
      el.classList.remove("spotlight");
    });
  },

  // 말풍선 높이에 따라 전체 덩치가 달라지므로, 잰 다음에 자리를 잡는다.
  // 기준은 말풍선이 아니라 본체다. 본체 가운데가 대상 가운데에 오게 맞춘다.
  place: function () {
    var target = Aistb._target;
    if (!target || !target.isConnected || !Aistb.el || Aistb._resting) return;

    var box = Aistb.parent.getBoundingClientRect();
    var r = target.getBoundingClientRect();
    var wrap = Aistb.el.getBoundingClientRect();
    var bodyEl = Aistb.el.querySelector(".aistb-body");
    var body = bodyEl.getBoundingClientRect();

    var bodyOffset = body.top - wrap.top; // 말풍선이 차지한 높이
    var left = r.right - box.left + 12;

    // 오른쪽에 두면 화면을 넘칠 때는 대상 왼쪽으로 보낸다.
    if (left + wrap.width > box.width - 8) {
      left = r.left - box.left - wrap.width - 12;
    }
    left = Math.max(8, Math.min(left, box.width - wrap.width - 8));

    var top = r.top - box.top + r.height / 2 - bodyOffset - body.height / 2;
    // 말풍선까지 포함해 화면 안에 다 들어오게 가둔다.
    top = Math.max(8, Math.min(top, box.height - wrap.height - 8));

    Aistb.el.classList.add("moved");
    Aistb.el.classList.toggle("left-side", left < box.width / 2);
    Aistb.el.style.left = left + "px";
    Aistb.el.style.top = top + "px";
    Aistb.el.style.right = "auto";
    Aistb.el.style.bottom = "auto";
  },

  moveTo: function (target) {
    Aistb._target = target;
    Aistb.place();
  },

  goHome: function () {
    if (!Aistb.el) return;
    Aistb.el.classList.remove("moved", "left-side");
    Aistb.el.style.left = "";
    Aistb.el.style.top = "";
    Aistb.el.style.right = "";
    Aistb.el.style.bottom = "";
  },

  // ── 메뉴 ──────────────────────────────────────────────
  setActions: function (actions) {
    Aistb.actions = actions || [];
    if (Aistb.menu && !Aistb.menu.hidden) Aistb.drawMenu();
    Aistb.markBadge();
  },

  markBadge: function () {
    if (!Aistb.el) return;
    var any = Aistb.actions.some(function (a) {
      return a.highlight && a.enabled !== false;
    });
    Aistb.el.classList.toggle("has-todo", any);
  },

  toggleMenu: function () {
    if (!Aistb.menu) return;
    if (Aistb.menu.hidden) {
      Aistb.drawMenu();
      Aistb.menu.hidden = false;
    } else {
      Aistb.menu.hidden = true;
    }
  },

  closeMenu: function () {
    if (Aistb.menu) Aistb.menu.hidden = true;
  },

  drawMenu: function () {
    Aistb.menu.innerHTML = "";
    if (Aistb.actions.length === 0) {
      var none = document.createElement("div");
      none.className = "aistb-none";
      none.textContent = "지금은 처리할 일이 없습니다.";
      Aistb.menu.appendChild(none);
      return;
    }
    Aistb.actions.forEach(function (a) {
      var b = document.createElement("button");
      b.className = "aistb-item" + (a.highlight ? " highlight" : "");
      b.textContent = a.label;
      b.disabled = a.enabled === false;
      b.onclick = function (e) {
        e.stopPropagation();
        Aistb.closeMenu();
        a.run();
      };
      Aistb.menu.appendChild(b);
    });
  },

  // ── 자리비움 ──────────────────────────────────────────
  watchIdle: function (seconds, handler) {
    Aistb.onIdle = handler;
    Aistb._idleAfter = seconds * 1000;
    Aistb.poke();
  },

  poke: function () {
    clearTimeout(Aistb.idleTimer);
    if (!Aistb.onIdle || !Aistb._idleAfter) return;
    Aistb.idleTimer = setTimeout(function () {
      if (Aistb.onIdle) Aistb.onIdle();
    }, Aistb._idleAfter);
  },

  stopIdle: function () {
    clearTimeout(Aistb.idleTimer);
    Aistb.onIdle = null;
  },
};
