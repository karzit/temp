// 26장 응답기록의 정상 응답(,0)이 실제로 0~25장에 있는 대사인지 검사한다.
// 대사를 고치면 이 검사가 깨진다. 깨지면 대사 쪽이 아니라 기록 쪽을 맞춘다.
//
//   node tools/check_log.js
var fs = require("fs");

var said = new Set();
fs.readdirSync("content").filter(function (f) {
  return /^ch(0[0-9]|1[0-9]|2[0-5])\.js$/.test(f);
}).forEach(function (f) {
  var s = fs.readFileSync("content/" + f, "utf8");
  var re = new RegExp('text:\\s*("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')', "g");
  var m;
  while ((m = re.exec(s))) {
    said.add(m[1].slice(1, -1).replace(/\\(.)/g, "$1").trim());
  }
});

var log = fs.readFileSync("content/ch26.js", "utf8");
var bad = [];
var total = 0;
log.split("\n").forEach(function (raw) {
  var line = raw.replace(/\r$/, "");
  var m = line.match(/^\s*"(\d+),(\d\d-\d\d),(.*),0",?$/);
  if (!m) return;
  total++;
  if (!said.has(m[3].trim())) bad.push(m[1] + "  " + m[3]);
});

console.log("정상 응답 " + total + "줄 중 " + bad.length + "줄이 대사에 없습니다.");
bad.forEach(function (b) {
  console.log("  " + b);
});

// 쉼표가 든 대사를 그대로 내보내면 read_csv 가 칸을 잘못 센다.
// 그러면 그날 과제가 에러도 없이 안 풀린다 — 대사만 봐서는 안 보이는 자리다.
// quoteLogText 가 내보낼 때 감싸주므로, 그 처리가 붙어 있는지만 본다.
var quoted = log.indexOf(".map(quoteLogText)") >= 0;
var risky = [];
log.split("\n").forEach(function (raw) {
  var line = raw.replace(/\r$/, "").trim().replace(/^"|",?$/g, "");
  if (!/^\d{4},\d\d-\d\d,/.test(line)) return;
  if (line.split(",").length !== 4) risky.push(line);
});

if (!quoted && risky.length) {
  console.log("\n쉼표가 들어 칸이 어긋나는 줄: " + risky.length + "줄");
  console.log("  → content 뒤에 .map(quoteLogText) 가 빠져 있습니다.");
  risky.slice(0, 3).forEach(function (l) {
    console.log("  " + l);
  });
} else {
  console.log("쉼표 든 줄 " + risky.length + "개는 내보낼 때 따옴표로 감싸집니다.");
}
process.exit(bad.length || (!quoted && risky.length) ? 1 : 0);
