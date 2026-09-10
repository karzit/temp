// 진행 상황은 브라우저 localStorage 한 곳에만 둔다. 서버도 계정도 없다.
const KEY = "ml-game-progress-v1";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // 사생활 보호 모드 등으로 저장이 막혀도 게임 자체는 계속 돌아가야 한다.
  }
}

// 몇 가지만 덮어쓰고 나머지(파일, 진행 위치)는 건드리지 않는다.
// 통째로 saveProgress 하면 다른 곳에서 넣어 둔 것이 지워진다.
function patchProgress(patch) {
  const state = loadProgress();
  Object.keys(patch).forEach(function (key) {
    state[key] = patch[key];
  });
  saveProgress(state);
}

function clearProgress() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
