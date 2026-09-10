// 토이비의 독백. 종장에서만 쓴다.
//
// 종장 전까지 채점 결과는 전부 Aistb 말풍선 하나를 지나간다(js/scenes.js 의 finishReport).
// 종장에서는 그 화자를 쓸 수 없다. Aistb 가 도와주지 않는 것이 그 장의 내용이기 때문이다.
// 그래서 Aistb 를 거치지 않는 표시 수단이 따로 있어야 한다 — 이 파일이 그것이다.
//
// 말풍선과 일부러 다르게 생겼다. 이름표가 없고, 화면 왼쪽 아래에 놓이고, 색이 죽어 있다.
// 누가 말해 주는 것이 아니라 혼자 생각하는 것이라는 뜻이다.
var Self = {
  el: null,
  veil: null,
  parent: null,

  mount: function (parent) {
    var box = document.createElement("div");
    box.className = "self-line";
    box.hidden = true;
    parent.appendChild(box);
    Self.el = box;
    Self.parent = parent;
    return box;
  },

  hush: function () {
    if (Self.el) Self.el.hidden = true;
  },

  // 눌러서 넘기지 않아도 되는 한 줄. 채점을 기다리는 동안 같은 것에 쓴다.
  note: function (text) {
    if (!Self.el) return;
    Self.el.hidden = false;
    Self.el.innerHTML = Aistb.format(text);
  },

  clearVeil: function () {
    if (Self.veil && Self.veil.parentNode) Self.veil.parentNode.removeChild(Self.veil);
    Self.veil = null;
  },

  // 한 줄이든 여러 줄이든 받는다. 플레이어가 눌러야 넘어가는 것은 Aistb.speak 과 같다.
  say: function (items, onDone) {
    var list = (typeof items === "string" ? [items] : items || []).filter(function (x) {
      return x;
    });
    Self.clearVeil();
    Aistb.clearVeil(); // 가림막은 한 번에 하나만 떠 있어야 한다
    if (!Self.el || list.length === 0) {
      if (onDone) onDone();
      return;
    }

    Aistb.closeMenu();
    var veil = document.createElement("div");
    veil.className = "veil";
    var tip = document.createElement("span");
    tip.className = "veil-tip";
    veil.appendChild(tip);
    Self.parent.appendChild(veil);
    Self.veil = veil;

    var i = -1;
    function next() {
      i += 1;
      if (i >= list.length) {
        Self.clearVeil();
        Aistb._advance = null;
        if (onDone) onDone();
        return;
      }
      Self.note(list[i]);
      tip.textContent = i < list.length - 1 ? "눌러서 다음 →" : "눌러서 계속";
    }
    veil.onclick = function (e) {
      e.stopPropagation();
      next();
    };
    // Aistb 몸을 눌러도 넘어가게 둔다. 종장에서도 손이 가는 자리는 거기다.
    Aistb._advance = next;
    next();
  },
};
