// 한 장의 대사와 힌트만 씬 번호와 함께 뽑는다. 다시 쓸 때 쓰는 작업용 도구다.
//
//   node tools/dump_lines.js ch01 ch02
var fs = require("fs");

var RE = new RegExp('(text|nudge):\\s*("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')');

process.argv.slice(2).forEach(function (id) {
  var s = fs.readFileSync("content/" + id + ".js", "utf8");
  var body = s.slice(s.indexOf("beats: ["));
  console.log("========== " + id);
  var n = 0;
  body.split(/\r?\n/).forEach(function (line) {
    if (/^      \{/.test(line)) console.log("--- " + ++n);
    var m = line.match(RE);
    if (m) {
      console.log((m[1] === "nudge" ? "  [힌트] " : "  ") + m[2].slice(1, -1));
    }
  });
});
