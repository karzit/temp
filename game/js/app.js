// 부팅과 화면 전환.
var Settings = {
  get: function (key, fallback) {
    var s = loadProgress().settings || {};
    return s[key] === undefined ? fallback : s[key];
  },
  set: function (key, value) {
    var st = loadProgress();
    st.settings = st.settings || {};
    st.settings[key] = value;
    saveProgress(st);
    Settings.apply();
  },
  apply: function () {
    var size = Settings.get("fontSize", "보통");
    var motion = Settings.get("motion", "켜기");
    document.body.classList.toggle("font-small", size === "작게");
    document.body.classList.toggle("font-large", size === "크게");
    document.body.classList.toggle("no-motion", motion === "끄기");
  },
};

var CHAPTERS = [CH00, CH01, CH02, CH03, CH04, CH05, CH06, CH07, CH08, CH09, CH10, CH11, CH12, CH13, CH14, CH15, CH16, CH17, CH18, CH19, CH20, CH21, CH22, CH23, CH24, CH25, CH26, CH27, CH28];

(function boot() {
  var stage = document.getElementById("stage");
  Settings.apply();

  // 소개 문구를 읽는 동안 파이썬을 받아둔다.
  preloadPython();

  var saved = loadProgress();
  var chapterIndex = Math.min(saved.chapter || 0, CHAPTERS.length - 1);
  var sceneIndex = saved.scene || 0;

  function playScene(ci, si) {
    var chapter = CHAPTERS[ci];
    var list = chapter.scenes;
    if (si >= list.length) {
      // 챕터 끝 — 다음 챕터로, 없으면 여기까지.
      if (ci + 1 < CHAPTERS.length) {
        patchProgress({ chapter: ci + 1, scene: 0 });
        playScene(ci + 1, 0);
      } else {
        endOfContent(stage);
      }
      return;
    }

    patchProgress({ chapter: ci, scene: si });

    stage.innerHTML = "";
    stage.className = "stage";
    Aistb.stopIdle();

    var scene = Scenes[list[si]];
    if (!scene) {
      console.warn("알 수 없는 씬:", list[si]);
      playScene(ci, si + 1);
      return;
    }
    // 씬이 두 번 done을 불러도 한 번만 넘어가게 한다.
    var moved = false;
    scene(stage, chapter, function () {
      if (moved) return;
      moved = true;
      playScene(ci, si + 1);
    });
  }

  document.getElementById("btn-restart").onclick = function () {
    if (!confirm("처음부터 다시 시작할까요? 지금까지 만든 파일은 사라집니다.")) return;
    clearProgress();
    location.reload();
  };

  playScene(chapterIndex, sceneIndex);
})();

function endOfContent(stage) {
  stage.innerHTML = "";
  stage.className = "stage scene-intro";
  var box = document.createElement("div");
  box.className = "intro-box";
  // 28장까지 전부 있으므로 여기는 "아직 안 만들어졌다" 가 아니라 끝난 자리다.
  // 크레딧과 노트북 안내는 마지막 일기 아래에 붙어 있다.
  box.innerHTML =
    "<p class='intro-line'>여기까지입니다. 수고하셨습니다.</p>" +
    "<p class='intro-line dim'>우측 아래 “처음부터”로 다시 시작할 수 있습니다.</p>";
  stage.appendChild(box);
}
