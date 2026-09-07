

const UI = {
  chapterTitle: () => document.getElementById("chapter-title"),
  progress: () => document.getElementById("progress"),
  scene: () => document.getElementById("scene"),
  panel: () => document.getElementById("panel"),
  hint: () => document.getElementById("hint-area"),
  next: () => document.getElementById("btn-next"),
};

const widgets = {};
function registerWidget(name, factory) {
  widgets[name] = factory;
}

class Game {
  constructor(chapter, { onProgress = () => {}, onFinish = null, startAt = 0 } = {}) {
    this.chapter = chapter;
    this.i = Math.min(startAt, chapter.beats.length - 1);
    this.onProgress = onProgress;
    this.onFinish = onFinish;
  }

  start() {
    UI.chapterTitle().textContent = this.chapter.title;
    UI.scene().innerHTML = "";
    UI.next().onclick = () => this.next();
    this.render();
  }

  next() {
    if (this.i < this.chapter.beats.length - 1) {
      this.i += 1;
      this.onProgress(this.i);
      this.render();
    } else {
      this.finish();
    }
  }

  finish() {
    UI.panel().innerHTML = "";
    if (this.onFinish) {
      // 스토리 모드라 챕터가 끊기지 않고 이어진다.
      UI.next().textContent = this.chapter.nextLabel || "다음 챕터";
      UI.next().disabled = false;
      UI.next().onclick = () => this.onFinish();
    } else {
      UI.next().textContent = "끝";
      UI.next().disabled = true;
      this.say({ narration: "여기까지입니다. 다음 챕터는 아직 준비 중입니다." });
    }
  }

  render() {
    const beat = this.chapter.beats[this.i];
    UI.panel().innerHTML = "";
    UI.hint().textContent = "";
    UI.progress().textContent = `${this.i + 1} / ${this.chapter.beats.length}`;

    if (beat.say || beat.narration) {
      this.say(beat);
      this.allowNext(true);
    } else if (beat.choice) {
      this.renderChoice(beat.choice);
    } else if (beat.widget) {
      this.renderWidget(beat);
    } else if (beat.code) {
      this.renderCode(beat.code);
    }
    scrollToBottom();
  }

  allowNext(on, label = "계속") {
    UI.next().disabled = !on;
    UI.next().textContent = label;
  }

  say({ say, who, narration }) {
    const p = document.createElement("p");
    p.className = narration ? "line narration" : "line";
    if (who) {
      const w = document.createElement("span");
      w.className = "who";
      w.textContent = who;
      p.appendChild(w);
    }
    const body = document.createElement("span");
    body.innerHTML = rich(narration || say);
    p.appendChild(body);
    UI.scene().appendChild(p);
  }

  renderChoice({ question, options }) {
    this.say({ say: question, who: "질문" });
    this.allowNext(false);

    const box = document.createElement("div");
    options.forEach((opt) => {
      const b = document.createElement("button");
      b.className = "choice";
      b.textContent = opt.text;
      b.onclick = () => {
        box.querySelectorAll("button").forEach((x) => (x.disabled = true));
        b.classList.add(opt.ok ? "picked-ok" : "picked-bad");
        const v = document.createElement("div");
        v.className = "verdict " + (opt.ok ? "ok" : "bad");
        v.textContent = opt.why;
        box.appendChild(v);
        // 틀려도 막지 않는다. 왜 틀렸는지 읽는 것이 이 스테이지의 내용이다.
        this.allowNext(true);
        scrollToBottom();
      };
      box.appendChild(b);
    });
    UI.panel().appendChild(box);
  }

  renderWidget(beat) {
    if (beat.brief) this.say({ say: beat.brief, who: "과제" });
    this.allowNext(false);

    const factory = widgets[beat.widget];
    if (!factory) {
      UI.panel().textContent = `알 수 없는 위젯: ${beat.widget}`;
      this.allowNext(true);
      return;
    }
    const host = document.createElement("div");
    host.className = "widget";
    UI.panel().appendChild(host);

    factory(host, beat.config || {}, {
      solved: (msg) => {
        UI.hint().textContent = msg || "통과";
        this.allowNext(true);
      },
      hint: (msg) => {
        UI.hint().textContent = msg;
      },
    });
  }

  renderCode({ brief, starter, check, packages, hint }) {
    if (brief) this.say({ say: brief, who: "과제" });
    this.allowNext(false);

    const ta = document.createElement("textarea");
    ta.className = "editor";
    ta.spellcheck = false;
    ta.value = starter || "";

    const row = document.createElement("div");
    row.className = "btn-row";
    const run = document.createElement("button");
    run.className = "primary";
    run.textContent = "실행하고 채점";
    const hintBtn = document.createElement("button");
    hintBtn.className = "ghost";
    hintBtn.textContent = "힌트";

    const out = document.createElement("div");
    out.className = "code-out";
    out.textContent = "아직 실행하지 않았습니다.";

    hintBtn.onclick = () => {
      UI.hint().textContent = hint || "힌트가 없는 문제입니다.";
    };

    run.onclick = async () => {
      run.disabled = true;
      out.className = "code-out";
      out.textContent = "";
      const status = (s) => {
        UI.hint().textContent = s;
      };
      try {
        const r = await runCheck(ta.value, check, { packages, onStatus: status });
        out.className = "code-out " + (r.ok ? "ok" : "bad");
        out.textContent = [r.output, r.ok ? "통과했습니다." : r.error].filter(Boolean).join("\n").trim();
        if (r.ok) this.allowNext(true);
      } catch (err) {
        out.className = "code-out bad";
        out.textContent = String(err.message || err);
      } finally {
        run.disabled = false;
        UI.hint().textContent = "";
        scrollToBottom();
      }
    };

    row.append(run, hintBtn);
    UI.panel().append(ta, row, out);
  }
}

// 대본에서 쓸 수 있는 표시는 취소선 ~~이렇게~~ 하나뿐이다. 그 외에는 전부 그대로 나온다.
function rich(text) {
  const escaped = String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/~~(.+?)~~/g, "<s>$1</s>");
}

function scrollToBottom() {
  requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }));
}
