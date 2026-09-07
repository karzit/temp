// 챕터를 추가할 때 손대는 곳은 여기 한 줄과 content/ 파일 하나(그리고 index.html의 script 태그)뿐이다.
var CHAPTERS = [CH00, CH02];

(function boot() {
  var state = loadProgress();
  var at = Math.min(state.chapter || 0, CHAPTERS.length - 1);

  function play(index, startAt) {
    var chapter = CHAPTERS[index];
    document.getElementById("scene").innerHTML = "";

    var game = new Game(chapter, {
      startAt: startAt,
      onProgress: function (i) {
        saveProgress({ chapter: index, beat: i });
      },
      onFinish: index < CHAPTERS.length - 1
        ? function () {
            saveProgress({ chapter: index + 1, beat: 0 });
            play(index + 1, 0);
          }
        : null,
    });
    game.start();
  }

  document.getElementById("btn-reset").onclick = function () {
    clearProgress();
    location.reload();
  };

  play(at, state.beat || 0);
})();
