// 한꺼번에 돌려 놓고 그 다음에 여러 개를 따로 짚는 자리를 찾는다.
// ch01 머리 주석의 규칙("설명이 결과보다 앞서지 않게")이 깨지는 자리다.
//
//   node tools/check_pace.js         어긋난 곳만
//   node tools/check_pace.js -v      그 자리의 대사까지
var fs = require("fs");
var verbose = process.argv.indexOf("-v") >= 0;

var files = fs.readdirSync("content").filter(function (f) {
  return /^ch\d+\.js$/.test(f);
}).sort();

var batch = 0;
var rows = [];

files.forEach(function (f) {
  var s = fs.readFileSync("content/" + f, "utf8").replace(/\r\n/g, "\n");
  var beats = s.split(/\n      \{\n/);
  beats.forEach(function (b, i) {
    var m = b.match(/(남은|마지막)\s*(한|두|세|네|다섯|여섯|것|넷|셋)[^"]*▶ 실행으로/);
    if (!m) return;
    if (/마지막 한 [줄문]/.test(m[0])) return; // 한 문장만 돌리는 것은 위반이 아니다
    batch++;
    var next = beats[i + 1] || "";
    var spots = (next.match(/spot: \{ text:/g) || []).length;
    if (spots < 2) return;
    // 나란히 놓고 비교하는 자리는 한꺼번에 돌리는 것이 맞다.
    // 둘 다 화면에 있어야 비교가 되므로 따로 밟으면 오히려 비교가 안 된다.
    var pairs = [["위가", "아래가"], ["앞이", "뒤가"], ["왼쪽이", "오른쪽이"], ["열별은", "행별은"]];
    var isCompare = pairs.some(function (kv) {
      return next.indexOf(kv[0]) >= 0 && next.indexOf(kv[1]) >= 0;
    });
    if (isCompare) return;
    var out = "  " + f + " — 한꺼번에 돌린 뒤 " + spots + "개를 따로 짚음";
    if (verbose) {
      var texts = next.match(/text: "(?:[^"\\]|\\.)*"/g) || [];
      out += "\n" + texts.map(function (t) {
        return "      " + t.slice(7, -1);
      }).join("\n");
    }
    rows.push(out);
  });
});

console.log("여러 문장을 ▶ 실행으로 한꺼번에: " + batch + "곳");
console.log("비교가 아닌데 따로 설명하는 자리: " + rows.length + "곳");
if (rows.length) console.log(rows.join("\n"));
