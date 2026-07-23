// Frozen Lake Q-Learning — 100 concurrent units, shared Q-table, 60fps render

const GRID = 8;
const CELL = 640 / GRID;
const N_UNITS = 100;
const ALPHA = 0.15;
const GAMMA = 0.95;
const EPSILON = 0.2;

// 0 = ice, 1 = hole, 2 = start, 3 = goal
const MAP = [
  "S.......",
  ".H..H...",
  "...H....",
  "..H...H.",
  ".H..H...",
  "..H..H.H",
  ".H..H...",
  "...H..G.",
].map(row => row.split(""));

function cellType(r, c) {
  const ch = MAP[r][c];
  if (ch === "H") return 1;
  if (ch === "S") return 2;
  if (ch === "G") return 3;
  return 0;
}

const startPos = (() => {
  for (let r = 0; r < GRID; r++)
    for (let c = 0; c < GRID; c++)
      if (cellType(r, c) === 2) return { r, c };
})();

const ACTIONS = [
  { dr: -1, dc: 0 }, // up
  { dr: 1, dc: 0 },  // down
  { dr: 0, dc: -1 }, // left
  { dr: 0, dc: 1 },  // right
];

// shared Q-table: Q[r][c][action]
const Q = Array.from({ length: GRID }, () =>
  Array.from({ length: GRID }, () => [0, 0, 0, 0])
);

function stateIdx(r, c) { return r * GRID + c; }

function bestAction(r, c) {
  const q = Q[r][c];
  let best = 0;
  for (let a = 1; a < 4; a++) if (q[a] > q[best]) best = a;
  return best;
}

function step(r, c, a) {
  let nr = r + ACTIONS[a].dr;
  let nc = c + ACTIONS[a].dc;
  // out of bounds or a hole: treated as a wall, unit stays put
  if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID || cellType(nr, nc) === 1) {
    nr = r; nc = c;
  }
  return { nr, nc };
}

function reward(type) {
  if (type === 3) return 1;
  return -0.01; // holes are walls now, never a landing type
}

class Unit {
  constructor(id) {
    this.id = id;
    this.hue = (id * 37) % 360;
    this.reset();
  }
  reset() {
    this.r = startPos.r;
    this.c = startPos.c;
    this.px = this.c;
    this.py = this.r;
    this.respawnTimer = 0;
  }
  learnStep() {
    if (this.respawnTimer > 0) {
      this.respawnTimer--;
      if (this.respawnTimer === 0) this.reset();
      return;
    }

    const r = this.r, c = this.c;
    const a = Math.random() < EPSILON
      ? Math.floor(Math.random() * 4)
      : bestAction(r, c);
    const { nr, nc } = step(r, c, a);
    const type = cellType(nr, nc);
    const rew = reward(type);

    const maxNext = Math.max(...Q[nr][nc]);
    Q[r][c][a] += ALPHA * (rew + GAMMA * maxNext - Q[r][c][a]);

    this.r = nr;
    this.c = nc;

    if (type === 3) {
      goalsReached++;
      this.respawnTimer = 18; // let the unit visibly sit on the goal before respawning
      episode++;
    }
  }
  render(ctx) {
    // interpolate one axis at a time so the path is always orthogonal
    // (never cuts diagonally across a corner, e.g. through a hole)
    const EPS = 0.02;
    if (Math.abs(this.py - this.r) > EPS) {
      this.py += (this.r - this.py) * 0.35;
    } else if (Math.abs(this.px - this.c) > EPS) {
      this.px += (this.c - this.px) * 0.35;
    } else {
      this.px = this.c;
      this.py = this.r;
    }
    const x = this.px * CELL + CELL / 2;
    const y = this.py * CELL + CELL / 2;
    ctx.beginPath();
    ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, 0.85)`;
    ctx.arc(x, y, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

let units = Array.from({ length: N_UNITS }, (_, i) => new Unit(i));
let nextUnitId = units.length;

let episode = 0;
let goalsReached = 0;
let running = true;
let targetFps = 60;

const canvas = document.getElementById("lake");
const ctx = canvas.getContext("2d");

function maxQ(r, c) {
  return Math.max(...Q[r][c]);
}

function drawGrid() {
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const type = cellType(r, c);
      const x = c * CELL, y = r * CELL;

      if (type === 1) {
        ctx.fillStyle = "#05070c";
      } else if (type === 2) {
        ctx.fillStyle = "#2f6f4f";
      } else if (type === 3) {
        ctx.fillStyle = "#d4af37";
      } else {
        const q = maxQ(r, c);
        const t = Math.max(0, Math.min(1, (q + 0.2) / 1.2));
        const light = 14 + t * 30;
        ctx.fillStyle = `hsl(212, 60%, ${light}%)`;
      }
      ctx.fillRect(x, y, CELL, CELL);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.strokeRect(x, y, CELL, CELL);

      if (type === 0) {
        const q = maxQ(r, c);
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(q.toFixed(2), x + CELL / 2, y + CELL / 2);
      }
    }
  }
}

const statEpisode = document.getElementById("stat-episode");
const statFps = document.getElementById("stat-fps");
const statGoals = document.getElementById("stat-goals");
const statAvgQ = document.getElementById("stat-avgq");
const toggleBtn = document.getElementById("toggle");

toggleBtn.addEventListener("click", () => {
  running = !running;
  toggleBtn.textContent = running ? "일시정지" : "재개";
});

const unitsSlider = document.getElementById("units-slider");
const unitsValue = document.getElementById("units-value");
const fpsSlider = document.getElementById("fps-slider");
const fpsValue = document.getElementById("fps-value");

unitsSlider.addEventListener("input", () => {
  const target = parseInt(unitsSlider.value, 10);
  unitsValue.textContent = target;
  if (target > units.length) {
    while (units.length < target) units.push(new Unit(nextUnitId++));
  } else if (target < units.length) {
    units.length = target;
  }
});

fpsSlider.addEventListener("input", () => {
  targetFps = parseInt(fpsSlider.value, 10);
  fpsValue.textContent = targetFps;
});

let lastTime = performance.now();
let frameCount = 0;
let fpsAccum = 0;

// updates per frame per unit so learning is visible but bounded
const LEARN_STEPS_PER_FRAME = 1;

function avgMaxQ() {
  let sum = 0, n = 0;
  for (let r = 0; r < GRID; r++)
    for (let c = 0; c < GRID; c++)
      if (cellType(r, c) === 0) { sum += maxQ(r, c); n++; }
  return n ? sum / n : 0;
}

let sinceLastFrame = 0;

function tick(now) {
  requestAnimationFrame(tick);
  const dt = now - lastTime;
  lastTime = now;

  const frameInterval = 1000 / targetFps;
  sinceLastFrame += dt;
  if (sinceLastFrame < frameInterval) return;
  sinceLastFrame = sinceLastFrame % frameInterval;

  frameCount++;
  fpsAccum += dt;
  if (fpsAccum >= 500) {
    statFps.textContent = Math.round((frameCount * 1000) / fpsAccum);
    frameCount = 0;
    fpsAccum = 0;
    statEpisode.textContent = episode;
    statGoals.textContent = goalsReached;
    statAvgQ.textContent = avgMaxQ().toFixed(3);
  }

  if (running) {
    for (const u of units) {
      for (let i = 0; i < LEARN_STEPS_PER_FRAME; i++) u.learnStep();
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  for (const u of units) u.render(ctx);
}

requestAnimationFrame(tick);
