// 슬라이싱 표기를 격자에서 직접 집어보게 하는 위젯.
// m[0]과 m[:, 0]의 차이는 설명보다 한 번 잘못 집어보는 편이 빠르다.
registerWidget("gridindex", function (host, config, api) {
  var rows = config.rows || 3;
  var cols = config.cols || 4;
  var questions = config.questions || [];
  var qi = 0;
  var picked = new Set();

  var prompt = document.createElement("div");
  prompt.className = "grid-prompt";

  var grid = document.createElement("div");
  grid.className = "grid";
  grid.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";

  var cells = [];
  for (var i = 0; i < rows * cols; i++) {
    (function (idx) {
      var c = document.createElement("button");
      c.className = "cell";
      c.textContent = idx;
      c.onclick = function () {
        if (picked.has(idx)) picked.delete(idx);
        else picked.add(idx);
        c.classList.toggle("on");
        verdict.textContent = "";
      };
      cells.push(c);
      grid.appendChild(c);
    })(i);
  }

  var verdict = document.createElement("div");
  verdict.className = "verdict";

  var row = document.createElement("div");
  row.className = "btn-row";
  var check = document.createElement("button");
  check.className = "primary";
  check.textContent = "확인";
  var clear = document.createElement("button");
  clear.className = "ghost";
  clear.textContent = "지우기";
  row.append(check, clear);

  clear.onclick = reset;
  check.onclick = function () {
    var want = questions[qi].cells;
    var same = want.length === picked.size && want.every(function (v) { return picked.has(v); });
    if (!same) {
      verdict.className = "verdict bad";
      verdict.textContent = questions[qi].why || "다시 보세요. 쉼표 앞이 행, 뒤가 열입니다.";
      want.forEach(function (v) { cells[v].classList.add("answer"); });
      setTimeout(function () {
        want.forEach(function (v) { cells[v].classList.remove("answer"); });
      }, 900);
      return;
    }
    verdict.className = "verdict ok";
    qi += 1;
    if (qi >= questions.length) {
      verdict.textContent = "맞습니다. " + questions.length + "문제 모두 통과.";
      check.disabled = true;
      clear.disabled = true;
      api.solved("통과");
    } else {
      verdict.textContent = "맞습니다. 다음 문제.";
      reset();
      ask();
    }
  };

  function reset() {
    picked.clear();
    cells.forEach(function (c) { c.classList.remove("on"); });
  }

  function ask() {
    prompt.innerHTML =
      "<code>" + questions[qi].expr + "</code> 가 고르는 칸을 모두 누르세요. " +
      "<span class='qnum'>(" + (qi + 1) + "/" + questions.length + ")</span>";
  }

  host.append(prompt, grid, row, verdict);
  ask();
});
