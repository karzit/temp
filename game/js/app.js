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

var CHAPTERS = [CH00, CH01];

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
        saveProgress({ chapter: ci + 1, scene: 0, settings: loadProgress().settings });
        playScene(ci + 1, 0);
      } else {
        endOfContent(stage);
      }
      return;
    }

    var st = loadProgress();
    saveProgress({ chapter: ci, scene: si, settings: st.settings });

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
  box.innerHTML =
    "<p class='intro-line'>여기까지가 지금 준비된 분량입니다.</p>" +
    "<p class='intro-line dim'>다음 챕터는 아직 만들어지지 않았습니다.</p>";
  stage.appendChild(box);
}
