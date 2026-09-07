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

function clearProgress() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
