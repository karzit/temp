// 편집창의 코드 자동완성. 주피터와 같은 방식으로 **지금 살아 있는 파이썬 이름**을 물어본다.
// 한 문장이라도 실행한 뒤라면 그 세션(IDE.stepper.ns)에 있는 변수와 모듈이 그대로 후보가 되고,
// 아직 아무것도 안 돌렸으면 파일을 훑어 찾은 이름과 파이썬 기본 낱말로 대신한다.
//
// 편집창이 textarea라서 목록 상자의 자리는 손으로 계산한다. 글꼴이 고정폭이고
// 줄 높이가 IDE.LINE_H로 고정되어 있어, 커서의 줄·칸만 알면 좌표가 나온다.
var Complete = {
  KEYWORDS: [
    "and", "as", "assert", "break", "class", "continue", "def", "del", "elif", "else",
    "except", "False", "finally", "for", "from", "if", "import", "in", "is", "lambda",
    "None", "not", "or", "pass", "raise", "return", "True", "try", "while", "with",
  ],

  BUILTINS: [
    "abs", "bool", "dict", "enumerate", "float", "int", "len", "list", "max", "min",
    "print", "range", "reversed", "round", "set", "sorted", "str", "sum", "tuple", "type", "zip",
  ],

  // 아직 실행하기 전에만 쓰는 목록. 한 번이라도 돌리면 파이썬에게 직접 물어본다.
  STATIC: {
    np: [
      "allclose", "arange", "argmax", "argmin", "argsort", "array", "array_equal",
      "concatenate", "mean", "ones", "sort", "sum", "where", "zeros",
    ],
    pd: ["DataFrame", "Series", "concat", "merge", "read_csv"],
    plt: ["bar", "figure", "legend", "plot", "scatter", "show", "title", "xlabel", "ylabel"],
  },

  MAX: 10,

  box: null,       // 열려 있는 목록 상자
  ta: null,        // 그 상자가 붙어 있는 편집창
  items: [],
  sel: 0,
  from: 0,         // 바꿔 넣을 자리의 시작
  seq: 0,          // 파이썬에 물어본 순서. 늦게 온 답은 버린다
  timer: 0,        // 치는 도중에 너무 자주 묻지 않도록 잠깐 기다리는 자리
  charW: 0,

  // ── 편집창에 붙이기 ───────────────────────────────────
  attach: function (ta, wrap) {
    ta.addEventListener("keydown", function (e) {
      Complete.onKeyDown(e, ta, wrap);
    });
    ta.addEventListener("input", function () {
      // 치는 동안 알아서 열어 준다. 두 글자부터, 또는 점을 찍은 직후.
      // 글자마다 파이썬에 물어보면 부담이 되므로 잠깐 기다렸다가 한 번만 묻는다.
      clearTimeout(Complete.timer);
      Complete.timer = setTimeout(function () {
        Complete.refresh(ta, wrap, false);
      }, 120);
    });
    ta.addEventListener("blur", Complete.close);
    ta.addEventListener("scroll", Complete.close);
    ta.addEventListener("click", Complete.close);
  },

  // ── 키 ────────────────────────────────────────────────
  onKeyDown: function (e, ta, wrap) {
    var open = Complete.box && Complete.ta === ta;

    if (open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        var step = e.key === "ArrowDown" ? 1 : -1;
        Complete.sel = (Complete.sel + step + Complete.items.length) % Complete.items.length;
        Complete.paint();
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        Complete.accept(ta);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        Complete.close();
        return;
      }
    }

    // Ctrl+Space 는 언제나 목록을 연다. 주피터의 Tab 자리다.
    if (e.key === " " && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      Complete.refresh(ta, wrap, true);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (Complete.wordBefore(ta)) Complete.refresh(ta, wrap, true);
      else if (e.shiftKey) Complete.dedent(ta);
      else Complete.insert(ta, "    ");
      return;
    }

    if (e.key === "Enter") {
      // 줄을 바꿀 때 앞줄의 들여쓰기를 이어 준다. : 로 끝나면 한 칸 더 들어간다.
      e.preventDefault();
      Complete.close();
      var upto = ta.value.slice(0, ta.selectionStart);
      var line = upto.slice(upto.lastIndexOf("\n") + 1);
      var pad = (line.match(/^[ \t]*/) || [""])[0];
      if (/:\s*$/.test(line)) pad += "    ";
      Complete.insert(ta, "\n" + pad);
    }
  },

  // ── 편집창 고치기 ─────────────────────────────────────
  // value 를 직접 갈아 끼우면 브라우저가 갖고 있던 되돌리기(Ctrl+Z) 기록이 통째로 날아간다.
  // execCommand 로 넣으면 사람이 친 것과 똑같이 취급되어 되돌리기가 살아 있다.
  replace: function (ta, start, end, text) {
    ta.focus();
    ta.setSelectionRange(start, end);
    var done = false;
    try {
      done = document.execCommand(text ? "insertText" : "delete", false, text);
    } catch (err) {
      done = false;
    }
    if (done) return; // execCommand 는 input 이벤트까지 알아서 낸다
    ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
    ta.selectionStart = ta.selectionEnd = start + text.length;
    Complete.changed(ta);
  },

  insert: function (ta, text) {
    Complete.replace(ta, ta.selectionStart, ta.selectionEnd, text);
  },

  dedent: function (ta) {
    var caret = ta.selectionStart;
    var head = ta.value.lastIndexOf("\n", caret - 1) + 1;
    var take = /^ {1,4}/.exec(ta.value.slice(head));
    if (!take) return;
    Complete.replace(ta, head, head + take[0].length, "");
  },

  // textarea 를 직접 고쳤을 때는 input 이벤트가 안 나므로 손으로 알린다.
  changed: function (ta) {
    ta.dispatchEvent(new Event("input", { bubbles: true }));
  },

  // ── 커서 앞의 낱말 ────────────────────────────────────
  // "np.ar" 이면 { expr: "np", prefix: "ar" }, "arr" 면 { expr: "", prefix: "arr" }.
  context: function (ta) {
    var upto = ta.value.slice(0, ta.selectionStart);
    var token = (/[A-Za-z_][A-Za-z0-9_.]*$|\.$/.exec(upto) || [""])[0];
    if (!token) return null;
    var cut = token.lastIndexOf(".");
    var expr = cut < 0 ? "" : token.slice(0, cut);
    var prefix = cut < 0 ? token : token.slice(cut + 1);
    if (expr && !/^[A-Za-z_][A-Za-z0-9_.]*$/.test(expr)) return null;
    return { expr: expr, prefix: prefix, from: ta.selectionStart - prefix.length };
  },

  wordBefore: function (ta) {
    var c = Complete.context(ta);
    return !!c && (c.prefix.length > 0 || c.expr.length > 0);
  },

  // ── 후보 모으기 ───────────────────────────────────────
  refresh: function (ta, wrap, forced) {
    var c = Complete.context(ta);
    // 알아서 열 때는 두 글자부터. 한 글자로는 후보가 너무 많아 방해가 된다.
    // 점 뒤(np. 처럼)는 그 자리에서 바로 연다.
    if (!c || (!forced && !c.expr && c.prefix.length < 2)) return Complete.close();

    var picked = Complete.pick(Complete.local(ta, c), c.prefix);
    if (picked.length) Complete.open(ta, wrap, c, picked);
    else Complete.close();

    // 파이썬이 살아 있으면 진짜 이름을 물어보고, 답이 오면 목록을 갈아 끼운다.
    if (typeof completeNames !== "function" || !isPythonReady()) return;
    var mine = ++Complete.seq;
    var ns = IDE.stepper ? IDE.stepper.ns : null;
    completeNames(ns, c.expr).then(function (names) {
      // 여기서 Complete.ta 를 보면 안 된다 — 미리 보여줄 후보가 없어 상자를 닫아 둔
      // 사이에 답이 오는 경우가 흔하고, 그때 Complete.ta 는 이미 비어 있다.
      if (mine !== Complete.seq || document.activeElement !== ta) return;
      var now = Complete.context(ta);
      if (!now || now.expr !== c.expr || now.prefix !== c.prefix) return;
      var merged = Complete.pick(names.concat(Complete.local(ta, c)), c.prefix);
      if (merged.length) Complete.open(ta, wrap, c, merged);
      else Complete.close();
    });
  },

  // 파이썬을 못 쓰는 동안 쓰는 후보. 파일에 이미 나온 이름이 제일 쓸모 있다.
  local: function (ta, c) {
    if (c.expr) return Complete.STATIC[c.expr] || [];
    var names = Complete.KEYWORDS.concat(Complete.BUILTINS);
    var re = /(?:^|\n)\s*(?:for\s+|def\s+|import\s+|as\s+)?([A-Za-z_]\w*)\s*(?:=[^=]|,|\()/g;
    var hit;
    while ((hit = re.exec(ta.value))) names.push(hit[1]);
    return names;
  },

  pick: function (names, prefix) {
    var seen = {};
    var out = [];
    var low = prefix.toLowerCase();
    names.forEach(function (n) {
      if (typeof n !== "string" || seen[n]) return;
      if (n.charAt(0) === "_" && prefix.charAt(0) !== "_") return;
      if (n.toLowerCase().indexOf(low) !== 0) return;
      if (n === prefix) return; // 이미 다 친 것은 보여줄 필요가 없다
      seen[n] = 1;
      out.push(n);
    });
    // 친 그대로(대소문자까지) 시작하는 것을 앞에 둔다. "ar" 을 쳤을 때
    // ArithmeticError 가 arr 보다 먼저 나오면 쓸모가 없다.
    return out
      .sort(function (a, b) {
        var ra = a.indexOf(prefix) === 0 ? 0 : 1;
        var rb = b.indexOf(prefix) === 0 ? 0 : 1;
        if (ra !== rb) return ra - rb;
        return a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0;
      })
      .slice(0, Complete.MAX);
  },

  // ── 목록 상자 ─────────────────────────────────────────
  open: function (ta, wrap, c, items) {
    Complete.close();
    Complete.ta = ta;
    Complete.items = items;
    Complete.sel = 0;
    Complete.from = c.from;

    var box = document.createElement("div");
    box.className = "complete";
    wrap.appendChild(box);
    Complete.box = box;
    Complete.place(ta, wrap);
    Complete.paint();
  },

  place: function (ta, wrap) {
    var upto = ta.value.slice(0, Complete.from);
    var rows = upto.split("\n");
    var col = rows[rows.length - 1].length;
    var gutter = wrap.querySelector(".gutter");
    var padLeft = 14;

    if (!Complete.charW) {
      var probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre";
      probe.style.font = getComputedStyle(ta).font;
      probe.textContent = "0123456789";
      document.body.appendChild(probe);
      Complete.charW = probe.getBoundingClientRect().width / 10;
      probe.remove();
    }

    var x = (gutter ? gutter.offsetWidth : 0) + padLeft + col * Complete.charW - ta.scrollLeft;
    var y = IDE.PAD_TOP + rows.length * IDE.LINE_H - ta.scrollTop;
    // 아직 화면에 자리를 못 잡은 동안에는 폭이 0으로 나온다. 그럴 때는 그냥 커서 자리에 둔다.
    var room = wrap.clientWidth || ta.clientWidth || 0;
    if (room > 160) x = Math.min(x, room - 160);
    Complete.box.style.left = Math.max(0, x) + "px";
    Complete.box.style.top = Math.max(0, y) + "px";
  },

  paint: function () {
    var box = Complete.box;
    if (!box) return;
    box.innerHTML = "";
    Complete.items.forEach(function (name, i) {
      var row = document.createElement("button");
      row.className = "complete-item" + (i === Complete.sel ? " on" : "");
      row.textContent = name;
      // 누르면 편집창이 focus 를 잃어 목록이 먼저 닫히므로, 눌리기 전에 처리한다.
      row.onmousedown = function (e) {
        e.preventDefault();
        Complete.sel = i;
        Complete.accept(Complete.ta);
      };
      box.appendChild(row);
    });
  },

  accept: function (ta) {
    var name = Complete.items[Complete.sel];
    if (!ta || !name) return Complete.close();
    var caret = ta.selectionStart;
    var from = Complete.from;
    Complete.close();
    Complete.replace(ta, from, caret, name);
  },

  close: function () {
    if (Complete.box) Complete.box.remove();
    Complete.box = null;
    Complete.ta = null;
    Complete.items = [];
  },
};
