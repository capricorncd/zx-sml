/*!
 * zx-sml version 0.8.0
 * Author: Capricorncd <capricorncd@qq.com>
 * Repository: https://github.com/capricorncd/zx-sml
 * Released on: 2024-03-17 16:01:21 (GMT+0900)
 */
function w(e) {
  return Array.isArray(e);
}
function u(e) {
  return typeof e == "object" && e !== null && !w(e);
}
function b(e) {
  return e && e.nodeType === 1;
}
function N(e) {
  return typeof e == "string" ? /^-?\d+(\.\d+)?$/.test(e) : g(e);
}
function g(e) {
  return Number.isFinite(e);
}
/*!
 * date-utils-2020 v1.1.0
 * Author: Capricorncd
 * Repository: https://github.com/capricorncd/date-utils-2020#readme
 * Released on: 2023/01/14 14:10:19 GMT+0900
 */
function $(e) {
  return String(e).padStart(2, "0");
}
const h = {
  // weeks: ['日', '一', '二', '三', '四', '五', '六']
  weeks: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
};
function L(e, t, r) {
  const n = j(e);
  if (!n || !t)
    return String(e);
  if (t === "timestamp")
    return n.getTime().toString();
  if (/(y+)/i.test(t)) {
    const i = RegExp.$1;
    t = t.replace(i, (n.getFullYear() + "").substring(4 - i.length));
  }
  (!r || !Array.isArray(r.weeks)) && (r = h);
  const o = {
    "M+": n.getMonth() + 1,
    "d+": n.getDate(),
    "h+": n.getHours(),
    "m+": n.getMinutes(),
    "s+": n.getSeconds(),
    // // week number
    // 'w+': date.getDay(),
    // // week text
    // 'W+': langPackage.weeks[date.getDay()],
    // am/pm
    "a+": n.getHours() < 12 ? "am" : "pm",
    "A+": n.getHours() < 12 ? "AM" : "PM"
  };
  let s;
  for (const i in o)
    if (new RegExp("(" + i + ")").test(t)) {
      s = RegExp.$1;
      const a = o[i] + "";
      t = t.replace(s, s.length === 1 ? a : $(a));
    }
  if (/w+/i.test(t)) {
    const i = n.getDay();
    t = t.replace(/w+/i, /W+/.test(t) ? r.weeks[i] : String(i));
  }
  if (/g/i.test(t)) {
    const i = n.toString().split(/\s+/).slice(5), a = t.includes("g");
    t = t.replace(/g/i, a ? i[0] : i.join(" "));
  }
  return t;
}
function j(e) {
  let t = null;
  if (e instanceof Date)
    t = e;
  else if (typeof e == "number")
    t = new Date(e);
  else if (typeof e == "string") {
    let r = e.trim();
    if (/^\d+$/.test(r)) {
      const n = r.length;
      n === 8 ? t = new Date([r.substring(0, 4), r.substring(4, 6), r.substring(6, 8)].join("/")) : n === 6 ? t = new Date([r.substring(0, 4), r.substring(4, 6), "01"].join("/")) : n === 4 ? t = /* @__PURE__ */ new Date(r + "/01/01") : t = new Date(parseInt(e));
    } else
      r = r.replace(/[年月日]/g, (n) => n === "日" ? "" : "/").replace(/[(（（].*?[)））]/g, " ").replace(/\bam|pm\b/ig, " ").replace(/\s+/g, " "), /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.test(r) ? t = new Date([RegExp.$1, RegExp.$2, RegExp.$3].join("/")) : /^(\d{4})[-/](\d{1,2})$/.test(r) ? t = new Date([RegExp.$1, RegExp.$2, "01"].join("/")) : t = new Date(r);
  }
  return t && !isNaN(t.getFullYear()) ? t : null;
}
function D(e, t = {}) {
  const [r, n] = e.split("?"), o = [];
  n && o.push(n);
  for (const [s, i] of Object.entries(t))
    o.push(`${s}=${u(i) ? JSON.stringify(i) : i}`);
  return r + (o.length ? `?${o.join("&")}` : "");
}
function p(e = "", t = "-") {
  return e.replace(
    /[A-Z]/g,
    (r, n) => `${n > 0 ? t : ""}${r.toLowerCase()}`
  );
}
function m(e = "", t = !1) {
  const r = e.replace(/[-_\s](\w)/g, (n, o) => o.toUpperCase());
  return t ? r.replace(/^\w/, (n) => n.toUpperCase()) : r;
}
function d(e) {
  return e.replace(
    /^-?[1-9]\d{0,2}(,\d{3})+/,
    (t) => t.replace(/,/g, "")
  );
}
function f(e, t = !1, r) {
  if (typeof t == "number" && (r = t, t = !1), typeof r != "number" && (r = 0), g(e))
    return e;
  if (typeof e == "string") {
    if (!t && /^(-?\d+(?:\.\d+)?)\D*/.test(d(e)))
      return f(RegExp.$1, !0);
    const n = Number(e);
    return isNaN(n) ? r : n;
  }
  return r;
}
function v(e) {
  if (typeof e == "number")
    return [e, ""];
  const t = d(e).match(/^(-?\d+(?:\.\d+)?)(.*)$/);
  return t ? [f(t[1], !0), t[2]] : [0, ""];
}
function y(e) {
  return typeof e == "string" ? e : e === null || typeof e > "u" ? "" : Array.isArray(e) ? e.map(y).join(" ") : typeof e == "object" ? Object.keys(e).filter((t) => e[t]).join(" ") : String(e);
}
function U(...e) {
  return e.map(y).filter((t) => !!t).join(" ");
}
function I(...e) {
  return e.join("/").replace(/(\w(?!:))(\/+)/g, "$1/").replace(/\/([?#])|\/$/g, "$1");
}
function E(e, t = 0) {
  return Array.prototype.slice.call(e, t);
}
function S(e = {}, t = !1) {
  const r = t ? m : p, n = {};
  for (const [o, s] of Object.entries(e))
    n[r(o)] = u(s) ? S(s, t) : s;
  return n;
}
function M(e, t = !1, r = 2) {
  const n = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], o = t ? 1e3 : 1024;
  let s = String(e), i = "Byte";
  for (let a = 0, l = e / o; l > 1; l /= o, a++)
    s = l.toFixed(r), i = n[a];
  return t && (i = i.replace("i", "")), {
    text: s.replace(/\.0+$/, "") + i,
    value: +s,
    unit: i,
    bytes: e
  };
}
function O(e, t = document) {
  return e ? e instanceof HTMLElement ? e : t.querySelector(e) : null;
}
function T(e, t = document) {
  return E(t.querySelectorAll(e));
}
function x(e, t = {}, r) {
  const n = document.createElement(e);
  for (const [o, s] of Object.entries(t))
    n.setAttribute(
      p(o),
      o === "style" && u(s) ? R(s) : String(s)
    );
  return r && (Array.isArray(r) || (r = [r]), r.forEach((o) => {
    if (typeof o == "string") {
      const s = x("div");
      s.innerHTML = o, n.append(...s.childNodes);
    } else
      n.append(o);
  })), n;
}
function R(...e) {
  const t = e.reduce((n, o) => ({ ...n, ...S(o) }), {}), r = [];
  for (const [n, o] of Object.entries(t))
    o === "" || typeof o > "u" || o === null || r.push(`${n}:${o}`);
  return r.join(";");
}
function k(e = 100) {
  const t = document.getElementsByTagName("*");
  let r, n, o;
  const s = [];
  for (let i = 0; i < t.length; i++)
    r = t[i], r.nodeType === 1 && (n = window.getComputedStyle(r, null), n.position !== "static" && (o = +n.zIndex, o > 0 && s.push(o)));
  return s.length ? Math.max.apply(null, s) : e;
}
function A(e, t, r = !1) {
  if (!b(e))
    return null;
  const n = window.getComputedStyle(
    e,
    null
  );
  if (t)
    try {
      const o = n[m(t)];
      return r ? f(o) : o;
    } catch {
      return null;
    }
  return n;
}
function F(e) {
  const t = ["auto", "scroll"], r = [];
  let n = e.parentElement, o;
  for (; n; )
    o = A(n, "overflow"), typeof o == "string" && t.includes(o) && r.push(n), n = n.parentElement;
  return r;
}
function C(e) {
  return new Promise((t, r) => {
    const n = new FileReader();
    n.onload = (o) => {
      var i;
      const s = (i = o.target) == null ? void 0 : i.result;
      s ? t(s) : r(new Error(`FileReader's result is null, ${o.target}`));
    }, n.onerror = r, n.readAsDataURL(e);
  });
}
function H(e) {
  return (window.URL || window.webkitURL).createObjectURL(e);
}
function B(e) {
  const t = e.split(",");
  let r = "";
  return /data:(\w+\/\w+);base64/.test(t[0]) && (r = RegExp.$1), {
    type: r,
    data: t[1]
  };
}
function J(e, t) {
  const r = B(e), n = window.atob(r.data);
  t = t || r.type;
  const o = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++)
    o[s] = n.charCodeAt(s);
  return new Blob([o], { type: t });
}
function P(e, t) {
  localStorage.setItem(e, JSON.stringify(t));
}
function q(e, t) {
  try {
    const r = localStorage.getItem(e);
    return r ? JSON.parse(r) : t;
  } catch {
    return t;
  }
}
function Y(e) {
  localStorage.removeItem(e);
}
function Z() {
  localStorage.clear();
}
function z(e, t) {
  sessionStorage.setItem(e, JSON.stringify(t));
}
function G(e, t) {
  try {
    const r = sessionStorage.getItem(e);
    return r ? JSON.parse(r) : t;
  } catch {
    return t;
  }
}
function K(e) {
  sessionStorage.removeItem(e);
}
function W() {
  sessionStorage.clear();
}
function c(e) {
  const t = Math.random().toString(36).slice(2);
  return typeof e == "number" ? e > t.length ? t.padEnd(Math.min(e, 1e3), t) : t.substring(0, e) : t;
}
function _(e, t) {
  return [e, c(5), c(5), c(), t].filter(Boolean).join("-");
}
export {
  O as $,
  T as $$,
  J as base64ToBlob,
  U as classNames,
  Z as clearLocalStorage,
  W as clearSessionStorage,
  H as createBlobURL,
  x as createElement,
  D as createUrlForGetRequest,
  C as fileToBase64,
  M as formatBytes,
  L as formatDate,
  S as formatKeys,
  q as getLocalStorage,
  k as getMaxZIndex,
  F as getScrollParents,
  G as getSessionStorage,
  A as getStyleValue,
  w as isArray,
  b as isElement,
  g as isNumber,
  N as isNumberLike,
  u as isObject,
  I as joinUrl,
  _ as randomId,
  c as randomStr,
  Y as removeLocalStorage,
  K as removeSessionStorage,
  P as setLocalStorage,
  z as setSessionStorage,
  E as slice,
  B as splitBase64,
  v as splitValue,
  m as toCamelCase,
  j as toDate,
  f as toNumber,
  p as toSnakeCase,
  R as toStrStyles,
  $ as toTwoDigits
};
