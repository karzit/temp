// 모니터 안에 떠 있는 코드 에디터. 탐색기 + 탭 + 편집창 + 실행 결과.
// 화면을 둘로 쪼개면 의뢰서를 띄워놓고 코드를 짤 수 있다.
var IDE = {
  root: null,
  panes: [{ tabs: [], active: null }],
  focus: 0,
  selectedDir: null,   // 아직 아무 폴더도 고르지 않은 상태
  newform: null,       // 이름 입력창이 열려 있으면 { kind: "dir" | "file" }
  expanded: { work: true },
  onChange: null, // 파일이 생기거나 바뀌면 부른다
  onRun: null, // 실행이 끝나면 (path, result) 로 부른다
  lastRun: null,

  mount: function (parent) {
    var ide = document.createElement("div");
    ide.className = "ide";

    var side = document.createElement("aside");
    side.className = "ide-side";
    side.innerHTML =
      "<div class='side-head'><span>탐색기</span>" +
      "<span class='side-btns'>" +
      "<button class='mini' data-new='file' title='새 파일'>＋파일</button>" +
      "<button class='mini' data-new='dir' title='새 폴더'>＋폴더</button>" +
      "</span></div>" +
      "<div class='tree'></div><div class='newform-slot'></div>";

    var main = document.createElement("div");
    main.className = "ide-main";
    main.innerHTML =
      "<div class='panes'></div>" +
      "<div class='ide-resizer' title='끌어서 결과 창 크기 조절'></div>" +
      "<div class='ide-bottom'>" +
      "<div class='run-row'>" +
      "<button class='run' title='중단점까지, 없으면 끝까지'>▶ 실행</button>" +
      "<button class='step' title='문장 하나만 실행'>↓ 한 줄</button>" +
      "<button class='reset-run' title='처음부터 다시'>↺</button>" +
      "<span class='run-target'></span><span class='run-state'></span></div>" +
      "<pre class='out'></pre>" +
      "<div class='pybar' hidden><span class='pybar-label'></span><span class='pybar-track'><i class='pybar-fill'></i></span></div>" +
      "</div>";

    ide.append(side, main);
    parent.appendChild(ide);
    IDE.root = ide;

    side.querySelectorAll("[data-new]").forEach(function (b) {
      b.onclick = function () {
        IDE.newEntryForm(b.getAttribute("data-new"));
      };
    });
    main.querySelector(".run").onclick = IDE.run;
    main.querySelector(".step").onclick = IDE.step;
    main.querySelector(".reset-run").onclick = IDE.resetRun;
    IDE.setupResizer(main);

    IDE.draw();
    return ide;
  },

  q: function (sel) {
    return IDE.root.querySelector(sel);
  },

  // 결과 창 위쪽 경계를 끌어서 높이를 바꾼다. 출력이 길 때 넓혀 볼 수 있게.
  bottomHeight: 168,

  setupResizer: function (main) {
    var bar = main.querySelector(".ide-resizer");
    var bottom = main.querySelector(".ide-bottom");
    if (!bar || !bottom) return;
    bottom.style.height = IDE.bottomHeight + "px";

    function begin(startY) {
      var startH = bottom.getBoundingClientRect().height;
      var limit = main.getBoundingClientRect().height - 150; // 편집창이 너무 좁아지지 않게

      function move(ev) {
        var y = ev.clientY;
        if (y === undefined && ev.touches && ev.touches[0]) y = ev.touches[0].clientY;
        var h = Math.max(60, Math.min(startH + (startY - y), limit));
        IDE.bottomHeight = h;
        bottom.style.height = h + "px";
      }
      function stop() {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", stop);
        document.removeEventListener("pointercancel", stop);
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", stop);
        document.body.classList.remove("resizing");
      }

      document.body.classList.add("resizing");
      // 움직임과 놓는 것은 전역에서 받는다. 커서가 막대 밖으로 나가도 이어져야 하기 때문.
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", stop);
      document.addEventListener("pointercancel", stop);
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", stop);
    }

    bar.onpointerdown = function (e) {
      e.preventDefault();
      begin(e.clientY);
    };
    bar.onmousedown = function (e) {
      if (window.PointerEvent) return; // pointerdown이 이미 처리했다
      e.preventDefault();
      begin(e.clientY);
    };

    // 두 번 누르면 기본 높이로 되돌린다.
    bar.ondblclick = function () {
      IDE.bottomHeight = 168;
      bottom.style.height = "168px";
    };
  },

  // ── 탐색기 ────────────────────────────────────────────
  draw: function () {
    IDE.drawTree();
    IDE.drawPanes();
    IDE.drawRunTarget();
    if (typeof Aistb !== "undefined" && Aistb.el) Aistb.repoint();
  },

  drawTree: function () {
    var host = IDE.q(".tree");
    host.innerHTML = "";
    host.appendChild(IDE.treeLevel("", 0));
  },

  treeLevel: function (base, depth) {
    var frag = document.createDocumentFragment();
    FS.list(base).forEach(function (name) {
      var path = FS.join(base, name);
      var node = FS.node(path);
      var row = document.createElement("button");
      row.className = "tree-row" + (node.type === "dir" ? " dir" : " file");
      row.setAttribute("data-path", path);
      if (node.type === "dir" && IDE.selectedDir === path) row.classList.add("sel");
      if (node.type === "file" && IDE.activePath() === path) row.classList.add("open");
      row.style.paddingLeft = 8 + depth * 14 + "px";

      var icon = node.type === "dir" ? (IDE.expanded[path] ? "▾" : "▸") : "";
      var tw = document.createElement("span");
      tw.className = "tw";
      tw.textContent = icon;
      if (node.type === "dir") {
        tw.onclick = function (e) {
          e.stopPropagation();
          IDE.expanded[path] = !IDE.expanded[path];
          IDE.draw();
        };
      }
      row.appendChild(tw);
      var label = document.createElement("span");
      label.textContent = name;
      row.appendChild(label);
      if (node.kind === "brief") {
        var tag = document.createElement("i");
        tag.className = "tree-tag";
        tag.textContent = "의뢰서";
        row.appendChild(tag);
      }

      row.onclick = function () {
        if (node.type === "dir") {
          // 이름을 누르는 것은 "여기에 만들겠다"는 뜻이다. 접히지는 않는다.
          IDE.selectedDir = path;
          IDE.expanded[path] = true;
          IDE.draw();
        } else {
          IDE.open(path);
        }
      };
      // 행 하나를 감싸서, 이름 옆에 지우기 버튼을 둔다(버튼 안에 버튼을 넣을 수 없다).
      var line = document.createElement("div");
      line.className = "tree-line";
      line.appendChild(row);

      if (!node.readOnly) {
        var del = document.createElement("button");
        del.className = "tree-del";
        del.title = "지우기";
        del.textContent = "×";
        del.onclick = function (e) {
          e.stopPropagation();
          IDE.remove(path);
        };
        line.appendChild(del);
      }
      frag.appendChild(line);

      if (node.type === "dir" && IDE.expanded[path]) {
        frag.appendChild(IDE.treeLevel(path, depth + 1));
      }
    });
    return frag;
  },

  remove: function (path) {
    var node = FS.node(path);
    if (!node) return;
    if (node.readOnly) {
      IDE.note("의뢰서는 지울 수 없습니다.");
      return;
    }
    var inside = node.type === "dir" ? FS.countInside(path) : 0;
    if (inside > 0 && !confirm(path + " 안에 " + inside + "개가 들어 있습니다. 함께 지울까요?")) return;

    FS.remove(path);

    // 지운 것(과 그 안에 있던 것)의 탭을 닫는다.
    var prefix = path + "/";
    IDE.panes.forEach(function (pane) {
      pane.tabs = pane.tabs.filter(function (p) {
        return p !== path && p.indexOf(prefix) !== 0;
      });
      if (pane.active && pane.tabs.indexOf(pane.active) < 0) {
        pane.active = pane.tabs[pane.tabs.length - 1] || null;
      }
    });
    if (IDE.selectedDir === path || (IDE.selectedDir || "").indexOf(prefix) === 0) {
      IDE.selectedDir = null;
    }
    IDE.draw();
    if (IDE.onChange) IDE.onChange();
  },

  note: function (text) {
    var slot = IDE.q(".newform-slot");
    slot.innerHTML = "<div class='newform'><div class='newform-msg'></div></div>";
    slot.querySelector(".newform-msg").textContent = text;
    setTimeout(function () {
      if (slot.textContent === text) slot.innerHTML = "";
    }, 2500);
  },

  newEntryForm: function (kind) {
    var slot = IDE.q(".newform-slot");
    slot.innerHTML = "";
    if (!IDE.selectedDir) {
      slot.innerHTML = "<div class='newform'><div class='newform-msg'>먼저 만들 위치가 될 폴더를 눌러 주세요.</div></div>";
      return;
    }
    IDE.newform = { kind: kind };
    if (IDE.onChange) IDE.onChange();
    var form = document.createElement("div");
    form.className = "newform";
    var where = document.createElement("div");
    where.className = "newform-where";
    where.textContent = (IDE.selectedDir || "(최상위)") + " 안에";
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = kind === "dir" ? "폴더 이름" : "파일 이름 (예: hello.py)";
    var msg = document.createElement("div");
    msg.className = "newform-msg";

    function create() {
      var name = input.value.trim();
      if (!name) {
        msg.textContent = "이름을 입력해 주세요.";
        return;
      }
      var path = FS.join(IDE.selectedDir, name);
      if (FS.exists(path)) {
        msg.textContent = "같은 이름이 이미 있습니다.";
        return;
      }
      if (kind === "dir") {
        FS.mkdir(path);
        IDE.expanded[path] = true;
        IDE.selectedDir = path; // 방금 만든 폴더 안에 이어서 만들 수 있게
      } else {
        FS.write(path, "");
      }
      slot.innerHTML = "";
      IDE.newform = null;
      IDE.draw();
      if (kind === "file") IDE.open(path);
      if (IDE.onChange) IDE.onChange();
    }

    input.onkeydown = function (e) {
      if (e.key === "Enter") create();
      if (e.key === "Escape") {
        slot.innerHTML = "";
        IDE.newform = null;
      }
    };
    var ok = document.createElement("button");
    ok.className = "mini primary";
    ok.textContent = "만들기";
    ok.onclick = create;

    form.append(where, input, ok, msg);
    slot.appendChild(form);
    input.focus();
  },

  // ── 탭과 편집창 ───────────────────────────────────────
  activePath: function () {
    return IDE.panes[IDE.focus] ? IDE.panes[IDE.focus].active : null;
  },

  open: function (path, paneIndex) {
    var i = typeof paneIndex === "number" ? paneIndex : IDE.focus;
    var pane = IDE.panes[i];
    if (!pane) return;
    if (pane.tabs.indexOf(path) < 0) pane.tabs.push(path);
    pane.active = path;
    IDE.focus = i;
    IDE.draw();
    if (IDE.onChange) IDE.onChange();
  },

  close: function (path, i) {
    var pane = IDE.panes[i];
    pane.tabs = pane.tabs.filter(function (p) {
      return p !== path;
    });
    if (pane.active === path) pane.active = pane.tabs[pane.tabs.length - 1] || null;
    if (IDE.panes.length > 1 && pane.tabs.length === 0) {
      IDE.panes.splice(i, 1);
      IDE.focus = 0;
    }
    IDE.draw();
  },

  toggleSplit: function () {
    if (IDE.panes.length > 1) {
      IDE.panes = [IDE.panes[0]];
      IDE.focus = 0;
    } else {
      IDE.panes.push({ tabs: [], active: null });
      IDE.focus = 1;
    }
    IDE.draw();
    if (IDE.onChange) IDE.onChange();
  },

  isSplit: function () {
    return IDE.panes.length > 1;
  },

  drawPanes: function () {
    var host = IDE.q(".panes");
    host.innerHTML = "";
    host.classList.toggle("split", IDE.isSplit());

    IDE.panes.forEach(function (pane, i) {
      var sec = document.createElement("section");
      sec.className = "pane" + (IDE.focus === i ? " focused" : "");
      // 여기서 다시 그리면 안 된다. 누른 요소가 사라져서 클릭이 완성되지 않는다.
      // (탭 선택·탭 닫기·화면 분할이 전부 이것 때문에 먹지 않았다.)
      sec.onmousedown = function () {
        if (IDE.focus === i) return;
        IDE.focus = i;
        host.querySelectorAll(".pane").forEach(function (el, n) {
          el.classList.toggle("focused", n === i);
        });
        IDE.drawRunTarget();
      };

      var tabs = document.createElement("div");
      tabs.className = "tabs";
      pane.tabs.forEach(function (path) {
        var t = document.createElement("span");
        t.className = "tab" + (pane.active === path ? " on" : "");
        t.setAttribute("data-path", path);
        var name = document.createElement("button");
        name.className = "tab-name";
        name.textContent = FS.nameOf(path);
        name.onclick = function () {
          if (IDE._justDragged) return; // 끌어서 옮긴 것은 선택이 아니다
          pane.active = path;
          IDE.focus = i;
          IDE.draw();
        };
        var x = document.createElement("button");
        x.className = "tab-x";
        x.textContent = "×";
        x.onpointerdown = function (e) {
          e.stopPropagation(); // 닫기 버튼에서는 드래그가 시작되지 않게
        };
        x.onclick = function (e) {
          e.stopPropagation();
          IDE.close(path, i);
        };
        t.onpointerdown = function (e) {
          if (e.button !== 0) return;
          IDE.startTabDrag(e, path, i);
        };
        t.append(name, x);
        tabs.appendChild(t);
      });

      if (i === 0) {
        var split = document.createElement("button");
        split.className = "split-btn";
        split.title = "화면 나누기";
        split.textContent = IDE.isSplit() ? "◧" : "◫";
        split.onclick = IDE.toggleSplit;
        tabs.appendChild(split);
      }

      var area = document.createElement("div");
      area.className = "editor-area";
      if (!pane.active) {
        area.innerHTML = "<div class='pane-empty'>왼쪽에서 파일을 고르세요.</div>";
      } else {
        var node = FS.node(pane.active);
        if (!node) {
          area.innerHTML = "<div class='pane-empty'>사라진 파일입니다.</div>";
        } else if (node.readOnly) {
          var doc = document.createElement("div");
          doc.className = "doc";
          node.content.split("\n").forEach(function (line) {
            var p = document.createElement("p");
            p.textContent = line;
            if (/^#{1,3} /.test(line)) p.className = "doc-h";
            doc.appendChild(p);
          });
          area.appendChild(doc);
        } else {
          area.appendChild(IDE.buildEditor(pane.active, node));
        }
      }

      sec.append(tabs, area);
      host.appendChild(sec);
    });
  },

  // ── 탭 끌어 옮기기 ────────────────────────────────────
  // 같은 줄에서는 순서를 바꾸고, 반대쪽 화면으로 끌면 그쪽으로 옮긴다.
  startTabDrag: function (e, path, fromPane) {
    var startX = e.clientX;
    var startY = e.clientY;
    var started = false;
    var ghost = null;
    var marker = null;
    var drop = null;

    function move(ev) {
      if (!started) {
        if (Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) < 5) return;
        started = true;
        document.body.classList.add("dragging-tab");
        ghost = document.createElement("div");
        ghost.className = "tab-ghost";
        ghost.textContent = FS.nameOf(path);
        marker = document.createElement("div");
        marker.className = "tab-marker";
        marker.hidden = true;
        document.body.append(ghost, marker);
      }
      ghost.style.left = ev.clientX + 12 + "px";
      ghost.style.top = ev.clientY + 12 + "px";

      drop = IDE.dropTargetAt(ev.clientX, ev.clientY);
      if (!drop) {
        marker.hidden = true;
        return;
      }
      marker.hidden = false;
      marker.style.left = drop.x + "px";
      marker.style.top = drop.top + "px";
      marker.style.height = drop.height + "px";
    }

    function stop() {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", stop);
      document.removeEventListener("pointercancel", stop);
      document.body.classList.remove("dragging-tab");
      if (ghost) ghost.remove();
      if (marker) marker.remove();
      if (!started) return;

      // 방금 끝난 드래그가 클릭으로 이어지지 않게 한 박자 막는다.
      IDE._justDragged = true;
      setTimeout(function () {
        IDE._justDragged = false;
      }, 0);

      if (drop) IDE.moveTab(path, fromPane, drop.pane, drop.index);
    }

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", stop);
    document.addEventListener("pointercancel", stop);
  },

  // 그 좌표가 어느 화면의 몇 번째 자리인지, 그리고 표시선을 그릴 위치.
  dropTargetAt: function (x, y) {
    var el = document.elementFromPoint(x, y);
    if (!el || !el.closest) return null;
    var paneEl = el.closest(".pane");
    if (!paneEl || !IDE.root.contains(paneEl)) return null;

    var paneEls = [].slice.call(IDE.root.querySelectorAll(".pane"));
    var pane = paneEls.indexOf(paneEl);
    if (pane < 0) return null;

    var tabsEl = paneEl.querySelector(".tabs");
    var tabEls = [].slice.call(tabsEl.querySelectorAll(".tab"));
    var box = tabsEl.getBoundingClientRect();
    var index = tabEls.length;
    var lineX = tabEls.length ? tabEls[tabEls.length - 1].getBoundingClientRect().right : box.left + 2;

    for (var k = 0; k < tabEls.length; k++) {
      var r = tabEls[k].getBoundingClientRect();
      if (x < r.left + r.width / 2) {
        index = k;
        lineX = r.left;
        break;
      }
    }
    return { pane: pane, index: index, x: lineX, top: box.top, height: box.height };
  },

  moveTab: function (path, from, to, index) {
    var src = IDE.panes[from];
    var dst = IDE.panes[to];
    if (!src || !dst) return;

    var at = src.tabs.indexOf(path);
    if (at < 0) return;
    src.tabs.splice(at, 1);
    if (from === to && at < index) index -= 1; // 앞에서 빠진 만큼 당겨진다

    // 옮겨갈 쪽에 같은 파일이 이미 열려 있으면 그것을 치우고 한 자리로 합친다.
    var dup = dst.tabs.indexOf(path);
    if (dup >= 0) {
      dst.tabs.splice(dup, 1);
      if (dup < index) index -= 1;
    }

    index = Math.max(0, Math.min(index, dst.tabs.length));
    dst.tabs.splice(index, 0, path);
    dst.active = path;
    if (src.tabs.indexOf(src.active) < 0) {
      src.active = src.tabs[src.tabs.length - 1] || null;
    }
    IDE.focus = to;

    // 옮기고 나서 빈 화면이 남으면 분할을 접는다.
    if (from !== to && IDE.panes.length > 1 && src.tabs.length === 0) {
      IDE.panes.splice(from, 1);
      IDE.focus = to > from ? to - 1 : to;
    }
    IDE.draw();
    if (IDE.onChange) IDE.onChange();
  },

  // ── 편집창 (줄 번호 · 중단점 · 현재 줄) ───────────────
  buildEditor: function (path, node) {
    var wrap = document.createElement("div");
    wrap.className = "editor-wrap";

    var gutter = document.createElement("div");
    gutter.className = "gutter";

    var stripe = document.createElement("div");
    stripe.className = "line-stripe";
    stripe.hidden = true;

    var ta = document.createElement("textarea");
    ta.className = "code";
    ta.spellcheck = false;
    ta.value = node.content;

    ta.oninput = function () {
      node.content = ta.value;
      // 내용이 바뀌면 문장 경계가 달라진다. 하던 실행은 버린다.
      // 다만 여기서 화면을 다시 그리면 안 된다 — 치는 도중에 편집창이 새로 만들어져
      // 포커스가 날아가고, 그 뒤에 친 글자가 통째로 사라진다.
      if (IDE.stepper && IDE.stepper.path === path) IDE.invalidateRun();
      IDE.drawGutter(wrap, path);
      if (IDE.onChange) IDE.onChange();
    };
    ta.onscroll = function () {
      gutter.scrollTop = ta.scrollTop;
      stripe.style.marginTop = -ta.scrollTop + "px";
    };

    wrap.append(gutter, stripe, ta);
    wrap.setAttribute("data-path", path);
    setTimeout(function () {
      IDE.drawGutter(wrap, path);
    }, 0);
    return wrap;
  },

  // 중단점은 파일마다 줄 번호 목록으로 갖고 있는다.
  breakpoints: {},

  toggleBreakpoint: function (path, line) {
    var set = IDE.breakpoints[path] || (IDE.breakpoints[path] = []);
    var at = set.indexOf(line);
    if (at >= 0) set.splice(at, 1);
    else set.push(line);
    IDE.draw();
  },

  hasBreakpoint: function (path, line) {
    var set = IDE.breakpoints[path];
    return !!set && set.indexOf(line) >= 0;
  },

  // 문장이 걸친 줄 가운데 중단점이 있으면 그 줄 번호를 돌려준다.
  breakpointIn: function (path, span) {
    for (var line = span[0]; line <= span[1]; line++) {
      if (IDE.hasBreakpoint(path, line)) return line;
    }
    return 0;
  },

  drawGutter: function (wrap, path) {
    var node = FS.node(path);
    if (!node) return;
    var gutter = wrap.querySelector(".gutter");
    var stripe = wrap.querySelector(".line-stripe");
    var count = node.content.split("\n").length;
    var nextLine = IDE.nextLineOf(path);

    gutter.innerHTML = "";
    for (var n = 1; n <= count; n++) {
      (function (line) {
        var row = document.createElement("button");
        row.className = "gline";
        if (IDE.hasBreakpoint(path, line)) row.classList.add("bp");
        if (line === nextLine) row.classList.add("here");
        row.textContent = line;
        row.title = "누르면 중단점";
        row.onclick = function () {
          IDE.toggleBreakpoint(path, line);
        };
        gutter.appendChild(row);
      })(n);
    }

    // 다음에 실행될 줄에 띠를 둔다.
    if (nextLine) {
      stripe.hidden = false;
      stripe.style.top = (nextLine - 1) * IDE.LINE_H + IDE.PAD_TOP + "px";
    } else {
      stripe.hidden = true;
    }
  },

  LINE_H: 21,
  PAD_TOP: 12,

  // 이 파일에서 다음에 실행될 줄(없으면 null).
  nextLineOf: function (path) {
    var st = IDE.stepper;
    if (!st || st.path !== path || st.at >= st.steps.length) return null;
    return st.steps[st.at][0];
  },

  // 이 파일에서 지금까지 실행한 문장 수. 대본이 진행을 판단할 때 쓴다.
  stepAt: function (path) {
    var st = IDE.stepper;
    return st && st.path === path ? st.at : 0;
  },

  stepDone: function (path) {
    var st = IDE.stepper;
    return !!st && st.path === path && st.at >= st.steps.length;
  },

  drawRunTarget: function () {
    var path = IDE.activePath();
    var runnable = path && FS.isFile(path) && !FS.node(path).readOnly;
    IDE.q(".run-target").textContent = runnable ? path : "실행할 파일을 열어주세요";
    IDE.q(".run").disabled = !runnable || IDE.busy;
    IDE.q(".step").disabled = !runnable || IDE.busy;

    var st = IDE.stepper;
    var state = IDE.q(".run-state");
    if (st && st.path === path) {
      state.textContent = st.at >= st.steps.length
        ? "끝까지 실행됨"
        : st.at + " / " + st.steps.length + " 문장";
      IDE.q(".reset-run").hidden = false;
    } else {
      state.textContent = "";
      IDE.q(".reset-run").hidden = true;
    }
  },

  // ── 실행 ──────────────────────────────────────────────
  busy: false,
  stepper: null, // { path, steps, at, ns, lines }

  // 하던 실행만 버린다. 화면은 건드리지 않는다(타이핑 중에 불린다).
  invalidateRun: function () {
    if (!IDE.stepper) return;
    endSession(IDE.stepper.ns);
    IDE.stepper = null;
    var state = IDE.q(".run-state");
    if (state) state.textContent = "";
    var reset = IDE.q(".reset-run");
    if (reset) reset.hidden = true;
    var wrap = IDE.root.querySelector(".editor-wrap .line-stripe");
    if (wrap) wrap.hidden = true;
  },

  resetRun: function () {
    if (IDE.stepper) endSession(IDE.stepper.ns);
    IDE.stepper = null;
    var out = IDE.q(".out");
    out.className = "out";
    out.textContent = "아직 실행하지 않았습니다.";
    IDE.draw();
  },

  // 실행할 준비를 한다. 이미 하던 것이 있으면 이어서 한다.
  prepare: function (path) {
    if (IDE.stepper && IDE.stepper.path === path) return Promise.resolve(IDE.stepper);

    var node = FS.node(path);
    IDE.waitForPython();
    return planSteps(node.content).then(function (steps) {
      return newSession().then(function (ns) {
        if (IDE.stepper) endSession(IDE.stepper.ns);
        IDE.stepper = {
          path: path,
          steps: steps || [[1, node.content.split("\n").length]],
          at: 0,
          ns: ns,
          lines: node.content.split("\n"),
          output: "",
        };
        IDE.q(".out").textContent = "";
        IDE.q(".out").className = "out";
        return IDE.stepper;
      });
    });
  },

  waitForPython: function () {
    if (isPythonReady()) return;
    IDE.showProgress("파이썬을 준비하는 중입니다. 끝나는 대로 실행됩니다.");
    onPythonReady(function () {
      IDE.hideProgress();
    });
  },

  // 문장 하나만 실행.
  step: function () {
    IDE.advance(1);
  },

  // 중단점을 만날 때까지, 없으면 끝까지.
  run: function () {
    IDE.advance(Infinity);
  },

  advance: function (maxSteps) {
    var path = IDE.activePath();
    if (!path || !FS.isFile(path) || IDE.busy) return;
    IDE.busy = true;
    IDE.drawRunTarget();

    IDE.prepare(path)
      .then(function (st) {
        return IDE.runSteps(st, maxSteps);
      })
      .catch(function (err) {
        var out = IDE.q(".out");
        out.className = "out bad";
        out.textContent = String(err.message || err);
      })
      .then(function () {
        IDE.busy = false;
        if (isPythonReady()) IDE.hideProgress();
        IDE.draw();
      });
  },

  runSteps: function (st, maxSteps) {
    var out = IDE.q(".out");
    var done = 0;

    function one() {
      if (st.at >= st.steps.length || done >= maxSteps) return Promise.resolve();
      // 중단점이 걸린 문장 앞에서 멈춘다(그 문장은 아직 실행하지 않는다).
      // 여러 줄짜리 문장이면 그 안 어느 줄에 찍었든 잡는다.
      var bp = IDE.breakpointIn(st.path, st.steps[st.at]);
      if (done > 0 && bp) {
        out.textContent = st.output + "\n\n— " + bp + "번 줄에서 멈췄습니다. ▶ 실행을 다시 누르면 이어서 갑니다. —";
        return Promise.resolve();
      }

      var span = st.steps[st.at];
      var chunk = st.lines.slice(span[0] - 1, span[1]).join("\n");
      return runInSession(st.ns, chunk, span[0], function (s) {
        if (s) IDE.showProgress(s);
        else if (isPythonReady()) IDE.hideProgress();
      }).then(function (r) {
        var printed = (r.output || "").trim();
        if (printed) st.output += (st.output ? "\n" : "") + printed;
        out.textContent = st.output;

        if (!r.ok) {
          out.className = "out bad";
          out.textContent = (st.output ? st.output + "\n" : "") + r.error;
          st.at = st.steps.length; // 멈춘 자리에서 더 가지 않는다
          IDE.lastRun = { path: st.path, ok: false, output: st.output };
          if (IDE.onRun) IDE.onRun(st.path, IDE.lastRun);
          return;
        }

        out.className = "out ok";
        st.at += 1;
        done += 1;
        IDE.drawStripeOnly();

        if (st.at >= st.steps.length) {
          IDE.lastRun = { path: st.path, ok: true, output: st.output };
          if (IDE.onRun) IDE.onRun(st.path, IDE.lastRun);
          return;
        }
        if (IDE.onChange) IDE.onChange(); // 진행 상황을 대본이 볼 수 있게
        return one();
      });
    }

    return one();
  },

  // 실행 중에도 현재 줄 표시만 가볍게 갱신한다.
  drawStripeOnly: function () {
    var st = IDE.stepper;
    if (!st) return;
    var wrap = IDE.root.querySelector('.editor-wrap[data-path="' + st.path + '"]');
    if (wrap) IDE.drawGutter(wrap, st.path);
    var state = IDE.q(".run-state");
    if (state) {
      state.textContent = st.at >= st.steps.length ? "끝까지 실행됨" : st.at + " / " + st.steps.length + " 문장";
    }
  },

  // 실제 내려받는 양을 알 수 없어 시간 기준으로 채우고, 끝나면 한 번에 100%로 맞춘다.
  showProgress: function (label) {
    var bar = IDE.q(".pybar");
    if (!bar) return;
    bar.hidden = false;
    IDE.q(".pybar-label").textContent = label;
    var fill = IDE.q(".pybar-fill");
    if (IDE._pyTimer) return;
    // 파이썬을 아직 받는 중이면 미리 받기 시작한 시각부터, 그 외에는 지금부터 센다.
    var t0 = !isPythonReady() && pythonLoadStart ? pythonLoadStart : Date.now();
    fill.style.width = "0%";
    IDE._pyTimer = setInterval(function () {
      var sec = (Date.now() - t0) / 1000;
      var pct = Math.min(92, 100 * (1 - Math.exp(-sec / 9)));
      fill.style.width = pct.toFixed(1) + "%";
    }, 120);
  },

  hideProgress: function () {
    var bar = IDE.q(".pybar");
    if (!bar || bar.hidden) return;
    clearInterval(IDE._pyTimer);
    IDE._pyTimer = null;
    IDE.q(".pybar-fill").style.width = "100%";
    setTimeout(function () {
      bar.hidden = true;
    }, 450);
  },
};
