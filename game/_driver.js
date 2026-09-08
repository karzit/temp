window.__mk = (plan) => {
  window.__L = []; window.__DS = new Set(); window.__last = -1; window.__stall = 0;
  const act = l => { const a = (Aistb.actions||[]).find(x => x.label === l); if (a && a.enabled !== false) { a.run(); return true; } return false; };
  window.__Q = plan.map(step => {
    if (step.create) return { need: null, when: step.after, go: () => { FS.write(step.create, step.code); IDE.open(step.create, 0); IDE.draw(); if (IDE.onChange) IDE.onChange(); IDE.run(); } };
    if (step.brief) return { need: step.brief, go: () => act("의뢰 확인") };
    if (step.report) return { need: step.report, go: () => act("완료 보고") };
    return { need: null, go: () => act("업무 종료") };
  });
  window.__tick = async (n) => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    for (let t = 0; t < n; t++) {
      try {
        if (document.querySelector(".stage").className.indexOf("scene-diary") >= 0) { window.__L.push("일기 도달"); return "diary"; }
        if (Aistb.isSpeaking() && Aistb._advance) { Aistb._advance(); await sleep(30); continue; }
        if (IDE.busy) { await sleep(200); continue; }
        const b = (loadProgress().beat ?? -1);
        if (b !== window.__last) { window.__L.push("beat " + b); window.__last = b; window.__stall = 0; } else window.__stall++;
        if (window.__stall >= 2) {
          for (let k = 0; k < window.__Q.length; k++) {
            if (window.__DS.has(k)) continue;
            const q = window.__Q[k];
            if (q.need && !FS.exists(q.need)) continue;
            if (q.when && !FS.exists(q.when)) continue;
            window.__L.push("do[" + k + "]"); window.__DS.add(k); q.go(); window.__stall = 0; break;
          }
        }
      } catch (e) { window.__L.push("ERR " + e.message); }
      await sleep(150);
    }
    return "budget";
  };
  window.__run = async (ms) => { const end = Date.now() + ms; while (Date.now() < end) { const r = await window.__tick(8); if (r === "diary") return "diary"; } return "budget"; };
  return "plan " + plan.length;
};
window.__P2 = [
  { brief: "work/의뢰_0002.md" },
  { create: "work/task_02/fee.py", after: "work/의뢰_0002.md", code: 'import numpy as np\ndistance = np.array([2, 5, 1, 8, 3])\nfee = distance * 1500 + 2000\nprint(fee)\n' },
  { report: "work/task_02/fee.py" },
  { brief: "work/의뢰_0003.md" },
  { create: "work/task_03/report.py", after: "work/의뢰_0003.md", code: 'import numpy as np\ncounts = np.array([31, 45, 28, 52, 39, 47, 33])\nrecent = counts[-3:]\navg = recent.mean()\nbest = counts.argmax()\nprint(recent, avg, best)\n' },
  { report: "work/task_03/report.py" },
  { brief: "work/의뢰_0004.md" },
  { create: "work/task_04/lunch.py", after: "work/의뢰_0004.md", code: 'import numpy as np\nlog = np.array([[12, 30, 41, 9], [15, 28, 44, 11], [10, 33, 39, 7]])\nlunch = log[:, 1]\nlunch_avg = lunch.mean()\nby_slot = log.mean(axis=0)\nprint(lunch, lunch_avg, by_slot)\n' },
  { report: "work/task_04/lunch.py" },
  { end: true },
];
window.__P3 = [
  { brief: "work/의뢰_0005.md" },
  { create: "work/task_05/heat.py", after: "work/의뢰_0005.md", code: 'import numpy as np\nt = np.array([61, 84, 73, 92, 58, 80, 77, 88])\nhot = t[t >= 80]\nhot_count = (t >= 80).sum()\ncooled = np.where(t >= 80, 80, t)\nprint(hot, hot_count, cooled)\n' },
  { report: "work/task_05/heat.py" },
  { brief: "work/의뢰_0006.md" },
  { create: "work/task_06/half.py", after: "work/의뢰_0006.md", code: 'import numpy as np\nlog = np.array([0, 1, 2, 5, 9, 14, 11, 21, 18, 15, 4, 1])\nblocks = log.reshape(4, 3)\nby_block = blocks.sum(axis=1)\nbusiest = by_block.argmax()\nquiet = (log <= 3).sum()\nprint(by_block, busiest, quiet)\n' },
  { report: "work/task_06/half.py" },
  { brief: "work/의뢰_0007.md" },
  { create: "work/task_07/robots.py", after: "work/의뢰_0007.md", code: 'import numpy as np\nnames = np.array(["1호", "2호", "3호", "4호"])\nlog = np.array([[8, 15, 9, 4], [11, 20, 12, 7], [5, 11, 6, 3], [13, 22, 15, 8]])\ntotals = log.sum(axis=1)\nbusy_names = names[totals >= 50]\ntop2 = names[np.argsort(totals)[::-1]][:2]\npeak_slot = log.sum(axis=0).argmax()\nprint(totals, busy_names, top2, peak_slot)\n' },
  { report: "work/task_07/robots.py" },
  { end: true },
];
window.__P5 = [
  { brief: "work/의뢰_0008.md" },
  { create: "work/task_08/busy.py", after: "work/의뢰_0008.md", code: 'import pandas as pd\ndf = pd.DataFrame({"name": ["가온","노을","다움","라온","마루"], "count": [41,22,35,30,47], "team": ["A","B","A","B","B"]})\nbusy = df[df["count"] >= 30]\nhow_many = len(busy)\nprint(busy, how_many)\n' },
  { report: "work/task_08/busy.py" },
  { brief: "work/의뢰_0009.md" },
  { create: "work/task_09/team.py", after: "work/의뢰_0009.md", code: 'import pandas as pd\ndf = pd.DataFrame({"name": ["가온","노을","다움","라온","마루"], "count": [41,22,35,30,47], "team": ["A","B","A","B","B"]})\nresult = df[df["count"] >= 30].groupby("team")["count"].mean()\nprint(result)\n' },
  { report: "work/task_09/team.py" },
  { brief: "work/의뢰_0010.md" },
  { create: "work/task_10/summary.py", after: "work/의뢰_0010.md", code: 'import pandas as pd\ndf = pd.DataFrame({"name": ["가온","노을","다움","라온","마루"], "count": [41,22,35,30,47], "team": ["A","B","A","B","B"]})\ntotal_avg = df["count"].mean()\nby_team_sum = df.groupby("team")["count"].sum()\nprint(total_avg, by_team_sum)\n' },
  { report: "work/task_10/summary.py" },
  { end: true },
];
"ok"
