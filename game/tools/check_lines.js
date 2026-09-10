// 지금까지 걸러낸 어색함의 유형으로 대사를 훑는다. 후보를 찾아줄 뿐이고 판단은 사람이 한다.
//
//   node tools/check_lines.js            전체
//   node tools/check_lines.js ch12 ch13  그 장만
var fs = require("fs");

var RE = new RegExp('text:\\s*("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')', "g");

var TESTS = [
  ["진행 안내", /^(좋습니다|훌륭합니다|이제|먼저|다음으로)[.,]?\s/],
  ["화면 반복", /^(보시는 대로|출력을 비교|화면 (오른쪽|왼쪽|아래))/],
  ["겹존대", /(되실 예정|하시게 되실|이시며|계실 것)/],
];

var files = process.argv.slice(2);
if (!files.length) {
  files = fs.readdirSync("content").filter(function (f) {
    return /^ch\d+\.js$/.test(f);
  }).sort().map(function (f) {
    return f.replace(".js", "");
  });
}

var counts = {};
TESTS.forEach(function (t) { counts[t[0]] = 0; });

files.forEach(function (id) {
  var s = fs.readFileSync("content/" + id + ".js", "utf8");
  var body = s.slice(s.indexOf("beats: ["));
  var m;
  RE.lastIndex = 0;
  while ((m = RE.exec(body))) {
    var t = m[1].slice(1, -1);
    TESTS.forEach(function (test) {
      var hit = test[1].test(t);
      if (!hit) return;
      counts[test[0]]++;
      console.log("[" + test[0] + "] " + id + "  " + t);
    });
  }
});

console.log("");
TESTS.forEach(function (t) {
  console.log(t[0] + ": " + counts[t[0]]);
});
