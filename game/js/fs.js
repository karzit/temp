// 게임 안의 가상 파일 시스템. 브라우저 메모리에만 있고 진짜 디스크와는 상관없다.
// 경로는 "work/first_task/hello.py" 처럼 문자열로 쓴다.
var FS = {
  root: { type: "dir", children: {} },

  reset: function () {
    FS.root = { type: "dir", children: {} };
  },

  // 트리가 그대로 JSON이 된다. 저장할 때는 이 모양 그대로 넣어 둔다.
  snapshot: function () {
    return JSON.parse(JSON.stringify(FS.root));
  },

  // 되돌릴 것이 없으면 false. 부른 쪽에서 reset 할지 정한다.
  restore: function (tree) {
    if (!tree || tree.type !== "dir" || !tree.children) return false;
    FS.root = tree;
    return true;
  },

  split: function (path) {
    return String(path).split("/").filter(Boolean);
  },

  node: function (path) {
    var parts = FS.split(path);
    var node = FS.root;
    for (var i = 0; i < parts.length; i++) {
      if (node.type !== "dir" || !node.children[parts[i]]) return null;
      node = node.children[parts[i]];
    }
    return node;
  },

  exists: function (path) {
    return !!FS.node(path);
  },

  isFile: function (path) {
    var n = FS.node(path);
    return !!n && n.type === "file";
  },

  parentOf: function (path) {
    var parts = FS.split(path);
    return FS.node(parts.slice(0, -1).join("/"));
  },

  nameOf: function (path) {
    var parts = FS.split(path);
    return parts[parts.length - 1] || "";
  },

  // 중간 폴더가 없으면 함께 만든다.
  mkdir: function (path) {
    var parts = FS.split(path);
    var node = FS.root;
    parts.forEach(function (name) {
      if (!node.children[name]) node.children[name] = { type: "dir", children: {} };
      node = node.children[name];
    });
    return node;
  },

  write: function (path, content, opts) {
    var parts = FS.split(path);
    var dir = FS.mkdir(parts.slice(0, -1).join("/"));
    var name = parts[parts.length - 1];
    var existing = dir.children[name];
    if (existing && existing.type === "file") {
      existing.content = content;
      return existing;
    }
    dir.children[name] = {
      type: "file",
      content: content || "",
      readOnly: !!(opts && opts.readOnly),
      kind: (opts && opts.kind) || null,
    };
    return dir.children[name];
  },

  read: function (path) {
    var n = FS.node(path);
    return n && n.type === "file" ? n.content : null;
  },

  // 폴더 안의 이름들을 폴더 먼저, 그 다음 가나다순으로 돌려준다.
  list: function (path) {
    var n = path ? FS.node(path) : FS.root;
    if (!n || n.type !== "dir") return [];
    return Object.keys(n.children).sort(function (a, b) {
      var na = n.children[a], nb = n.children[b];
      if (na.type !== nb.type) return na.type === "dir" ? -1 : 1;
      return a.localeCompare(b);
    });
  },

  remove: function (path) {
    var parts = FS.split(path);
    if (parts.length === 0) return false;
    var parent = FS.node(parts.slice(0, -1).join("/"));
    if (!parent || parent.type !== "dir") return false;
    var name = parts[parts.length - 1];
    if (!parent.children[name]) return false;
    delete parent.children[name];
    return true;
  },

  // 폴더 안에 무엇이 들어 있는지 세어본다(지우기 전에 물어보려고).
  countInside: function (path) {
    var node = FS.node(path);
    if (!node || node.type !== "dir") return 0;
    return Object.keys(node.children).reduce(function (n, name) {
      return n + 1 + FS.countInside(FS.join(path, name));
    }, 0);
  },

  join: function (base, name) {
    return base ? base + "/" + name : name;
  },

  // 지금 들어 있는 파일 전부를 [{ path, content }] 로 훑어준다.
  // 파이썬 쪽에서도 같은 파일을 열 수 있게 옮겨 심을 때 쓴다.
  allFiles: function (base) {
    var out = [];
    FS.list(base || "").forEach(function (name) {
      var path = FS.join(base || "", name);
      var node = FS.node(path);
      if (node.type === "dir") out = out.concat(FS.allFiles(path));
      else out.push({ path: path, content: node.content });
    });
    return out;
  },
};
