

const COL = { fg: "#e6e8ec", dim: "#99a0ad", line: "#2e333d", accent: "#6ea8fe", ok: "#5fd48a", bad: "#ef6f6f" };

// 직선 하나를 손으로 맞춰보는 위젯.
// 왼쪽은 데이터와 직선, 오른쪽은 W에 따른 비용 곡선 — 두 그림이 같이 움직이는 것이 핵심이다.
registerWidget("fitline", (host, config, api) => {
  const {
    xs = [1, 2, 3, 4, 5, 6],
    ys = [7, 10, 15, 17, 22, 24],
    wRange = [0, 8],
    bRange = [-5, 15],
    lockB = null,
    target = 2.0,
    xLabel = "x",
    yLabel = "y",
  } = config;

  let W = wRange[0];
  let b = lockB === null ? bRange[0] : lockB;
  let best = Infinity;
  let done = false;

  const cost = (w, bb) => xs.reduce((s, x, i) => s + (w * x + bb - ys[i]) ** 2, 0) / xs.length;

  const fit = document.createElement("canvas");
  fit.width = 760;
  fit.height = 280;
  const curve = document.createElement("canvas");
  curve.width = 760;
  curve.height = 150;
  curve.style.marginTop = "10px";

  const readout = document.createElement("div");
  readout.className = "readout";

  const wLabel = document.createElement("label");
  wLabel.textContent = "W (기울기)";
  const wSlider = range(wRange[0], wRange[1], 0.05, W);
  wLabel.appendChild(wSlider);

  const bLabel = document.createElement("label");
  bLabel.textContent = "b (절편)";
  const bSlider = range(bRange[0], bRange[1], 0.1, b);
  bLabel.appendChild(bSlider);

  host.append(fit, curve, readout, wLabel);
  if (lockB === null) host.append(bLabel);

  wSlider.oninput = () => {
    W = Number(wSlider.value);
    draw();
  };
  bSlider.oninput = () => {
    b = Number(bSlider.value);
    draw();
  };

  function draw() {
    const c = cost(W, b);
    if (c < best) best = c;

    drawFit();
    drawCurve();

    readout.innerHTML =
      `W = <b>${W.toFixed(2)}</b>` +
      (lockB === null ? ` &nbsp; b = <b>${b.toFixed(1)}</b>` : ` &nbsp; b = ${b.toFixed(1)} (고정)`) +
      ` &nbsp; cost = <b style="color:${c <= target ? COL.ok : COL.fg}">${c.toFixed(2)}</b>` +
      ` &nbsp; 목표 ≤ ${target}`;

    if (!done && c <= target) {
      done = true;
      api.solved(`cost ${c.toFixed(2)} — 통과했습니다.`);
    } else if (!done) {
      api.hint(`지금까지 가장 낮은 cost: ${best.toFixed(2)}`);
    }
  }

  function drawFit() {
    const g = fit.getContext("2d");
    const pad = 46;
    const xMax = Math.max(...xs) * 1.15;
    const yMax = Math.max(...ys, ...xs.map((x) => W * x + b)) * 1.15;
    const px = (x) => pad + (x / xMax) * (fit.width - pad * 1.5);
    const py = (y) => fit.height - pad - (y / Math.max(yMax, 1)) * (fit.height - pad * 1.5);

    g.clearRect(0, 0, fit.width, fit.height);
    axes(g, fit, pad, xLabel, yLabel);

    // 각 점에서 직선까지의 오차를 세로선으로 — 비용이 "무엇의 합인지"가 눈에 보여야 한다.
    xs.forEach((x, i) => {
      g.strokeStyle = COL.bad;
      g.globalAlpha = 0.5;
      g.beginPath();
      g.moveTo(px(x), py(ys[i]));
      g.lineTo(px(x), py(W * x + b));
      g.stroke();
      g.globalAlpha = 1;
    });

    g.strokeStyle = COL.accent;
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(px(0), py(b));
    g.lineTo(px(xMax), py(W * xMax + b));
    g.stroke();
    g.lineWidth = 1;

    xs.forEach((x, i) => {
      g.fillStyle = COL.fg;
      g.beginPath();
      g.arc(px(x), py(ys[i]), 4, 0, Math.PI * 2);
      g.fill();
    });
  }

  function drawCurve() {
    const g = curve.getContext("2d");
    const pad = 46;
    const N = 160;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const w = wRange[0] + ((wRange[1] - wRange[0]) * i) / N;
      pts.push([w, cost(w, b)]);
    }
    const cMax = Math.max(...pts.map((p) => p[1]));
    const px = (w) => pad + ((w - wRange[0]) / (wRange[1] - wRange[0])) * (curve.width - pad * 1.5);
    const py = (c) => curve.height - pad + 12 - (c / Math.max(cMax, 1)) * (curve.height - pad);

    g.clearRect(0, 0, curve.width, curve.height);
    axes(g, curve, pad, "W", "cost");

    g.strokeStyle = COL.dim;
    g.beginPath();
    pts.forEach(([w, c], i) => (i ? g.lineTo(px(w), py(c)) : g.moveTo(px(w), py(c))));
    g.stroke();

    const c = cost(W, b);
    g.fillStyle = c <= target ? COL.ok : COL.accent;
    g.beginPath();
    g.arc(px(W), py(c), 5, 0, Math.PI * 2);
    g.fill();
  }

  function axes(g, cv, pad, xl, yl) {
    g.strokeStyle = COL.line;
    g.beginPath();
    g.moveTo(pad, 8);
    g.lineTo(pad, cv.height - pad + 12);
    g.lineTo(cv.width - 10, cv.height - pad + 12);
    g.stroke();
    g.fillStyle = COL.dim;
    g.font = "12px sans-serif";
    g.fillText(xl, cv.width - 40, cv.height - pad + 30);
    g.fillText(yl, 8, 20);
  }

  function range(min, max, step, value) {
    const r = document.createElement("input");
    r.type = "range";
    r.min = min;
    r.max = max;
    r.step = step;
    r.value = value;
    return r;
  }

  draw();
});
