/*!
 * zx-sml version 0.8.0
 * Author: Capricorncd <capricorncd@qq.com>
 * Repository: https://github.com/capricorncd/zx-sml
 * Released on: 2024-03-17 16:01:21 (GMT+0900)
 */
import E from "node:fs";
import B from "node:os";
import D from "node:path";
const a = "", d = {
  method: "method",
  type: "type",
  document: "document",
  constant: "constant",
  property: "property"
};
function H(e) {
  return Array.isArray(e);
}
function L(e) {
  return typeof e == "object" && e !== null && !H(e);
}
function P(e) {
  return Number.isFinite(e);
}
function K(e) {
  return e.replace(
    /^-?[1-9]\d{0,2}(,\d{3})+/,
    (s) => s.replace(/,/g, "")
  );
}
function I(e, s = !1, r) {
  if (typeof s == "number" && (r = s, s = !1), typeof r != "number" && (r = 0), P(e))
    return e;
  if (typeof e == "string") {
    if (!s && /^(-?\d+(?:\.\d+)?)\D*/.test(K(e)))
      return I(RegExp.$1, !0);
    const t = Number(e);
    return isNaN(t) ? r : t;
  }
  return r;
}
const x = {
  // 'bright': '\x1B[1m',
  // 'grey': '\x1B[2m',
  // 'italic': '\x1B[3m',
  // 'underline': '\x1B[4m',
  // 'reverse': '\x1B[7m',
  // 'hidden': '\x1B[8m',
  // 'black': '\x1B[30m',
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  // 'blue': '\x1B[34m',
  // 'magenta': '\x1B[35m',
  // 'cyan': '\x1B[36m',
  white: "\x1B[37m"
  // 'blackBG': '\x1B[40m',
  // 'redBG': '\x1B[41m',
  // 'greenBG': '\x1B[42m',
  // 'yellowBG': '\x1B[43m',
  // 'blueBG': '\x1B[44m',
  // 'magentaBG': '\x1B[45m',
  // 'cyanBG': '\x1B[46m',
  // 'whiteBG': '\x1B[47m',
};
function G(...e) {
  console.log("😎", x.green, ...e, x.white);
}
function j(...e) {
  console.log("😕", x.yellow, ...e, x.white);
}
function ge(...e) {
  console.log("😡", x.red, ...e, x.white);
}
const O = ":--", M = {
  left: O,
  center: ":--:",
  right: "--:"
};
function b(e) {
  if (!e || E.existsSync(e)) {
    j(`The directory already exists, or is null, ${e}`);
    return;
  }
  const s = e.lastIndexOf("/");
  if (s === -1) {
    j(`The 'dir' maybe a valid directory name, ${e}`);
    return;
  }
  const r = e.substring(0, s);
  E.existsSync(r) ? E.mkdirSync(e) : (b(r), b(e));
}
function W(e) {
  return typeof e == "string" ? /.+\.\w+$/.test(e) : !1;
}
function y(e) {
  return Array.isArray(e) && e.length > 0;
}
function U(e, s = " ", r = "-") {
  const t = e.filter((n) => !!n);
  return t.length ? t.join(s) : r;
}
function Y(e, s, r) {
  let t = -1;
  for (let n = 0; n < r && (t = e.indexOf(s, t + 1), t !== -1); n++)
    ;
  return t;
}
function A(e) {
  return typeof e > "u" ? [] : Array.isArray(e) ? e : [e];
}
function R(e) {
  return e = e.trim(), e.endsWith(";") && (e = e.substr(0, e.length - 1)), !e.includes("|") || /^(\w+<([^<]|\([^(]+\)\[\]|\w+<[^<]+>)+>|\([^(]+\)\[\])$/.test(e) ? [e] : e.split(/\s*\|\s*/);
}
function N(e) {
  return e.replace(/\|/g, "\\|");
}
function z(e) {
  const s = Y(e, "`", 2);
  return s === -1 ? "" : e.substr(s + 1);
}
function J(e) {
  e = e.replace("@param", "").trim();
  const s = {
    raw: e,
    name: "",
    required: !1,
    types: [],
    desc: []
  };
  if (/(\w+\??)\s+`([^`]+)`(.*)/.test(e)) {
    const r = RegExp.$1;
    s.name = r.replace("?", ""), s.required = !r.includes("?"), s.types.push(...R(RegExp.$2));
    const t = RegExp.$3 || z(e);
    s.desc.push(t.trim());
  }
  return s;
}
function Q(e) {
  e = e.replace(/@returns?/, "").trim();
  const s = {
    raw: e,
    types: [],
    desc: []
  };
  return /`([^`]+)`\s*(.*)/.test(e) && (s.types.push(...R(RegExp.$1)), s.desc.push(RegExp.$2)), s;
}
function X(e) {
  return /@sort\s*(-?\d+)/.test(e) ? I(RegExp.$1) : 0;
}
function v(e) {
  return e.replace(/^([\w.]+).*/, "$1");
}
function _(e, s, r = "Name", t = {}) {
  if (!y(e))
    return [];
  const n = t.alias || {}, c = n.tableHead || {};
  let u = {
    0: "no",
    1: "yes"
  };
  n.requiredValues && (n.requiredValues[s] ? u = n.requiredValues[s] : n.requiredValues[0] && n.requiredValues[1] && (u = n.requiredValues));
  const o = t.tableAlign || {}, i = {
    align: [
      o[r],
      o.Types,
      o.Required,
      o.Description
    ],
    // table head
    thead: [
      c[r] || r,
      c.Types || "Types",
      c.Required || "Required",
      c.Description || "Description"
    ],
    // table body
    tbody: e.map((f) => {
      var g;
      return [
        f.name,
        "`" + N((g = f.types) == null ? void 0 : g.join("`/`")) + "`",
        u[+f.required],
        N(U(f.desc))
      ];
    })
  }, l = ee(i);
  return l.push(a), l;
}
function F(e, s) {
  const r = Object.keys(e).reduce((t, n) => (Object.keys(e[n]).forEach((c) => {
    t[c] = e[n][c];
  }), t), {});
  return Z(r, s);
}
function Z(e, s = {}) {
  const r = [], t = Object.keys(e);
  return s.disableKeySorting || t.sort(), t.forEach((n) => r.push(e[n])), r.some((n) => n.sort) && r.sort((n, c) => n.sort - c.sort), r;
}
function V(e, s) {
  if (e.props)
    return e.props;
  const r = [], t = e.codes[0] || "";
  /\sextends\s+(.+)\s*\{/.test(t) && RegExp.$1.split(/\s*,\s*/).map((o) => v(o.trim())).forEach((o) => {
    const i = s.find((l) => l.name === o);
    i && (i.props || (i.props = V(i, s)), r.push(...i.props));
  });
  let n = !1, c = [];
  return e.codes.forEach((u) => {
    if (!n && /\{\s*$/.test(u))
      return n = !0;
    if (/^\s*(?:(?:readonly|static|public)\s+)?((?:(?:\w|\[.+\])+|(?:'.+')|(?:".+"))\??)\s*:\s*([^/]*)(?:\/\/(.*))?/.test(
      u
    )) {
      const o = RegExp.$1, i = R(RegExp.$2);
      c.push(RegExp.$3.trim());
      const l = {
        raw: u,
        name: o.replace(/('|")(.+)\1/, "$2").replace(/\?/g, ""),
        required: !o.includes("?"),
        desc: c.filter(Boolean),
        types: i
      }, f = r.findIndex((g) => g.name === l.name);
      f >= 0 && r.splice(f, 1), r.push(l), c = [];
    } else
      /^\s*\/\/(.+)/.test(u) && (c || (c = []), c.push(RegExp.$1.trim()));
  }), r;
}
function q(e, s = []) {
  return e.map(
    (r, t) => M[s[t]] || O
  ).join("|");
}
function ee(e) {
  if (!L(e) || !y(e.tbody))
    return [];
  const { align: s = [], thead: r, tbody: t } = e, n = [];
  let c = 0;
  for (y(r) ? n.push(r.join("|"), q(r, s)) : (n.push(t[0].join("|"), q(t[0], s)), c = 1); c < t.length; c++)
    n.push(t[c].join("|"));
  return n;
}
function se(e, s, r = {}) {
  const t = Object.keys(d);
  y(r.expendTypes) && r.expendTypes.forEach((h) => {
    h && !t.includes(h) && t.push(h);
  });
  const n = new RegExp(`^\\*\\s*@(${t.join("|")})\\s*(.+)`), c = [d.type, d.constant];
  y(r.codeTypes) && r.codeTypes.forEach((h) => {
    c.push(h);
  });
  let u = !1, o = !1, i = "", l = "", f = "", g = "";
  return E.readFileSync(e, "utf8").toString().split(new RegExp(B.EOL)).forEach((h) => {
    var p;
    const $ = h;
    if (h = h.trim(), n.test(h)) {
      u = !0, i = RegExp.$1;
      const m = RegExp.$2.trim();
      l = v(m), f = `${i}_${l}`, s[f] = {
        type: i,
        sort: 0,
        name: l,
        fullName: m,
        desc: [],
        params: [],
        returns: [],
        codes: [],
        private: !1,
        path: e
      };
      return;
    } else if (h === "*/" && u) {
      u = !1;
      return;
    }
    if (h === "/**" && (l = ""), !u || !l) {
      l && c.includes(i) && h && s[f].codes.push(
        $.replace(/^export(\s+default)?\s*/, "")
      );
      return;
    }
    if (typeof ((p = r.expendTypesHandlers) == null ? void 0 : p[i]) == "function")
      r.expendTypesHandlers[i](s[f], h);
    else {
      if (/^\*\s*(```\w+|@code)/.test(h) && (o = !0), /^\*(.*)/.test(h)) {
        g = RegExp.$1;
        const m = g.trim();
        if (m.startsWith("@param"))
          s[f].params.push(J(m));
        else if (m.startsWith("@return"))
          s[f].returns.push(Q(m));
        else if (m.startsWith("@private"))
          s[f].private = !0;
        else if (m.startsWith("@sort"))
          s[f].sort = X(m);
        else if (o) {
          m.startsWith("@code") && (r.isExtractCodeFromComments && s[f].codes.push(""), g = g.replace(/@code\w*/, "").trim());
          const T = g.replace(/^\s/, "").replace("*\\/", "*/");
          r.isExtractCodeFromComments ? s[f].codes.push(T) : s[f].desc.push(T);
        } else
          s[f].desc.push(m.replace("@description", "").trim());
      }
      o && /^\*\s*```$/.test(h) && (o = !1);
    }
  }), s;
}
function re(e, s, r = {}) {
  const t = {};
  return L(s) && (r = s, s = !1), S(e, t, r), ne(t, r), s ? F(t, r) : t;
}
function S(e, s, r) {
  const { fileType: t = /\.(ts|js)$/ } = r;
  if (Array.isArray(e))
    e.forEach((n) => {
      S(n, s, r);
    });
  else {
    const n = E.statSync(e);
    n.isDirectory() ? E.readdirSync(e).forEach((c) => {
      S(D.join(e, c), s, r);
    }) : n.isFile() && t.test(e) && (s[e] = {}, se(e, s[e], r));
  }
}
function te(e) {
  if (Array.isArray(e))
    return e.filter((t) => t.type === d.type);
  const s = [];
  let r;
  return Object.keys(e).forEach((t) => {
    Object.keys(e[t]).forEach((n) => {
      r = e[t][n], r.type === d.type && s.push(r);
    });
  }), s;
}
function ne(e, s) {
  const r = te(e);
  y(s.types) && r.push(...s.types), r.forEach((t) => {
    t.props = V(t, r);
  });
}
function ce(e, s, r = {}) {
  e.returns.length || e.returns.push({
    raw: "`void`",
    types: ["void"],
    desc: []
  }), s.push(
    `### ${e.fullName}`,
    a,
    ...e.desc,
    a,
    ...r.methodWithRaw ? e.params.map((t) => `- @param ${t.raw}`) : _(e.params, d.method, "Param", r),
    a,
    ...e.returns.map((t) => `- @returns ${t.raw}`),
    a
  ), C(e.codes, s);
}
function C(e, s) {
  y(e) && s.push(...e, a);
}
function oe(e, s, r = {}) {
  var f;
  s.push(`### ${e.fullName}`, a, ...e.desc, a);
  const t = _(
    e.props,
    d.type,
    "Prop",
    r
  ), n = ["```ts", ...e.codes, "```", a], u = [
    "<details>",
    `<summary>${((f = r.alias) == null ? void 0 : f.sourceCodeSummary) || "Source Code"}</summary>`,
    a,
    ...n,
    a,
    "</details>",
    a
  ], { typeWithSourceCode: o, typeWithTable: i, typeWithAuto: l } = r;
  o && i ? s.push(...t, ...n) : o ? s.push(...n) : i ? s.push(...t) : t.length ? s.push(...t, ...u) : l ? s.push(...n) : s.push(...u);
}
function fe(e) {
  let s = 0;
  const r = [];
  return e.forEach((t) => {
    t === a ? s++ : s = 0, !(s > 1) && r.push(t);
  }), r;
}
function ae(e, s, r) {
  var u, o, i;
  if (!y(e))
    return;
  const t = ((u = s.alias) == null ? void 0 : u.types) || {}, n = A(
    (i = (o = s.lines) == null ? void 0 : o.afterTitle) == null ? void 0 : i[d.document]
  );
  let c = null;
  return e.forEach((l, f) => {
    f === 0 ? (c = l.name + ".md", r.push(
      `# ${t[d.document] || l.fullName}`,
      a
    ), y(n) && r.push(...n, a)) : r.push(`### ${l.fullName}`, a), r.push(...l.desc, a), C(l.codes, r);
  }), c;
}
function ue(e, s, r) {
  y(e) && (w(d.method, s, r), e.forEach((t) => {
    ce(t, r, s);
  }));
}
function ie(e, s, r) {
  y(e) && (w(d.type, s, r), e.forEach((t) => {
    oe(t, r, s);
  }));
}
function w(e, s, r) {
  var u, o, i;
  const t = ((u = s.alias) == null ? void 0 : u.types) || {}, n = {
    document: "Document",
    method: "Methods",
    type: "Types",
    constant: "Constants",
    property: "Property"
  };
  r.push(
    `## ${t[e] || n[e] || e}`,
    a
  );
  const c = A((i = (o = s.lines) == null ? void 0 : o.afterTitle) == null ? void 0 : i[e]);
  y(c) && r.push(...c, a);
}
function le(e, s, r) {
  y(e) && (w(d.constant, s, r), e.forEach((t) => {
    r.push(`### ${t.fullName}`, a, ...t.desc, a), y(t.codes) && r.push("```ts", ...t.codes, "```", a);
  }));
}
function de(e, s, r) {
  y(e) && (w(d.property, s, r), e.forEach((t) => {
    r.push(`### ${t.fullName}`, a, ...t.desc, a), t.returns.length && r.push(
      ...t.returns.map((n) => `- @returns ${n.raw}`),
      a
    ), C(t.codes, r);
  }));
}
function k(e, s, r = {}) {
  var g, h, $;
  console.log("Output file is start ...");
  const t = {};
  let n = null;
  e.forEach((p) => {
    t[p.type] || (t[p.type] = []), t[p.type].push(p);
  });
  const c = [], u = A((g = r.lines) == null ? void 0 : g.start);
  y(u) && c.push(...u, a);
  const o = ((h = r.lines) == null ? void 0 : h.afterType) || {};
  (y(r.outputDocTypesAndOrder) ? r.outputDocTypesAndOrder : [
    d.document,
    d.property,
    d.method,
    d.type,
    d.constant
  ]).forEach((p) => {
    var T;
    const m = (T = r.handlers) == null ? void 0 : T[p];
    typeof m == "function" ? m(t[p], r, c) : p === d.document ? n = ae(t[p], r, c) : p === d.property ? de(t[p], r, c) : p === d.method ? ue(t[p], r, c) : p === d.type ? ie(t[p], r, c) : p === d.constant && le(t[p], r, c), o[p] && c.push(...A(o[p]), a);
  });
  const l = A(($ = r.lines) == null ? void 0 : $.end);
  y(l) && c.push(...l, a);
  const f = fe(c);
  return s && (W(s) ? n = s : n && (n = D.join(s, n)), n && pe(n, f)), G(n || "no files were output!"), console.log("Output file is ended."), {
    outputFileName: n,
    lines: f,
    data: e
  };
}
function pe(e, s) {
  Array.isArray(s) && (s = s.join(B.EOL)), E.writeFileSync(e, s, "utf8");
}
function Ee(e, s, r) {
  L(s) && (r = s, s = void 0), r = r || {}, // file or directory's path
  (typeof e == "string" || // or an array of paths
  y(e) && e.every((c) => typeof c == "string")) && (e = re(e, !0, r));
  const t = r.lines || {}, n = r.alias || {};
  if (r = {
    ...r,
    lines: t,
    alias: n
  }, s && !E.existsSync(s))
    if (W(s)) {
      const c = s.split("/");
      c.pop(), b(c.join("/"));
    } else
      b(s);
  return Array.isArray(e) ? k(e, s, r) : k(
    F(e, r),
    s,
    r
  );
}
export {
  a as BLANK_LINE,
  d as DOC_TYPES,
  _ as createPropsTable,
  ge as error,
  Y as findCharIndex,
  A as formatAsArray,
  R as formatAsTypes,
  re as getCommentsData,
  v as getTypeName,
  te as getTypes,
  J as handleParam,
  V as handleProps,
  Q as handleReturn,
  X as handleSort,
  W as isFileLike,
  y as isValidArray,
  G as log,
  F as mergeIntoArray,
  b as mkdirSync,
  Ee as outputFile,
  N as replaceVerticalBarsInTables,
  Z as toArray,
  U as toStrForStrArray,
  ee as toTableLines,
  j as warn,
  pe as writeFileSync
};
