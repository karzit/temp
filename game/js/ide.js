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
      "<div class='run-row'><button class='run'>▶ 실행</button><span class='run-target'></span></div>" +
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
          var ta = document.createElement("textarea");
          ta.className = "code";
          ta.spellcheck = false;
          ta.value = node.content;
          ta.oninput = function () {
            node.content = ta.value;
            if (IDE.onChange) IDE.onChange();
          };
          area.appendChild(ta);
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

  drawRunTarget: function () {
    var path = IDE.activePath();
    var label = IDE.q(".run-target");
    var runnable = path && FS.isFile(path) && !FS.node(path).readOnly;
    label.textContent = runnable ? path : "실행할 파일을 열어주세요";
    IDE.q(".run").disabled = !runnable;
  },

  // ── 실행 ──────────────────────────────────────────────
  run: function () {
    var path = IDE.activePath();
    if (!path || !FS.isFile(path)) return;
    var node = FS.node(path);
    var out = IDE.q(".out");
    var btn = IDE.q(".run");
    btn.disabled = true;
    out.className = "out";
    out.textContent = "";

    // 미리 받아두고 있었으니 대개는 바로 돌아간다. 아직 안 끝났을 때만 막대를 보여준다.
    if (!isPythonReady()) {
      IDE.showProgress("파이썬을 준비하는 중입니다. 끝나는 대로 실행됩니다.");
      onPythonReady(function () {
        IDE.hideProgress();
      });
    }

    runCheck(node.content, null, {
      onStatus: function (s) {
        if (s) IDE.showProgress(s);
        else if (isPythonReady()) IDE.hideProgress();
      },
    })
      .then(function (r) {
        var printed = (r.output || "").trim();
        out.className = "out " + (r.ok ? "ok" : "bad");
        out.textContent = (r.ok ? printed : (printed ? printed + "\n" : "") + r.error) || "(출력이 없습니다)";
        IDE.lastRun = { path: path, ok: r.ok, output: printed };
        if (IDE.onRun) IDE.onRun(path, IDE.lastRun);
      })
      .catch(function (err) {
        out.className = "out bad";
        out.textContent = String(err.message || err);
      })
      .then(function () {
        if (isPythonReady()) IDE.hideProgress();
        btn.disabled = false;
        IDE.drawRunTarget();
      });
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
