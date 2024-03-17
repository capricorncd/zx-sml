/*!
 * zx-sml version 0.8.1
 * Author: Capricorncd <capricorncd@qq.com>
 * Repository: https://github.com/capricorncd/zx-sml
 * Released on: 2024-03-17 16:11:32 (GMT+0900)
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
function $(e) {
  return typeof e == "string" ? /^-?\d+(\.\d+)?$/.test(e) : g(e);
}
function g(e) {
  return Number.isFinite(e);
}
function h(e, t = "px") {
  if ($(e))
    return `${e}${t}`;
  if (typeof e == "string") {
    const r = e.trim();
    return /\d+\s+/.test(r) ? r.trim().split(/\s+/).map((n) => h(n, t)).join(" ") : r;
  }
  return "";
}
/*!
 * date-utils-2020 v1.1.0
 * Author: Capricorncd
 * Repository: https://github.com/capricorncd/date-utils-2020#readme
 * Released on: 2023/01/14 14:10:19 GMT+0900
 */
function j(e) {
  return String(e).padStart(2, "0");
}
const x = {
  // weeks: ['日', '一', '二', '三', '四', '五', '六']
  weeks: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
};
function D(e, t, r) {
  const n = E(e);
  if (!n || !t)
    return String(e);
  if (t === "timestamp")
    return n.getTime().toString();
  if (/(y+)/i.test(t)) {
    const i = RegExp.$1;
    t = t.replace(i, (n.getFullYear() + "").substring(4 - i.length));
  }
  (!r || !Array.isArray(r.weeks)) && (r = x);
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
      t = t.replace(s, s.length === 1 ? a : j(a));
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
function E(e) {
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
function U(e, t = {}) {
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
function I(e) {
  if (typeof e == "number")
    return [e, ""];
  const t = d(e).match(/^(-?\d+(?:\.\d+)?)(.*)$/);
  return t ? [f(t[1], !0), t[2]] : [0, ""];
}
function y(e) {
  return typeof e == "string" ? e : e === null || typeof e > "u" ? "" : Array.isArray(e) ? e.map(y).join(" ") : typeof e == "object" ? Object.keys(e).filter((t) => e[t]).join(" ") : String(e);
}
function M(...e) {
  return e.map(y).filter((t) => !!t).join(" ");
}
function O(...e) {
  return e.join("/").replace(/(\w(?!:))(\/+)/g, "$1/").replace(/\/([?#])|\/$/g, "$1");
}
function R(e, t = 0) {
  return Array.prototype.slice.call(e, t);
}
function S(e = {}, t = !1) {
  const r = t ? m : p, n = {};
  for (const [o, s] of Object.entries(e))
    n[r(o)] = u(s) ? S(s, t) : s;
  return n;
}
function T(e, t = !1, r = 2) {
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
function k(e, t = document) {
  return e ? e instanceof HTMLElement ? e : t.querySelector(e) : null;
}
function v(e, t = document) {
  return R(t.querySelectorAll(e));
}
function A(e, t = {}, r) {
  const n = document.createElement(e);
  for (const [o, s] of Object.entries(t))
    n.setAttribute(
      p(o),
      o === "style" && u(s) ? B(s) : String(s)
    );
  return r && (Array.isArray(r) || (r = [r]), r.forEach((o) => {
    if (typeof o == "string") {
      const s = A("div");
      s.innerHTML = o, n.append(...s.childNodes);
    } else
      n.append(o);
  })), n;
}
function B(...e) {
  const t = e.reduce((n, o) => ({ ...n, ...S(o) }), {}), r = [];
  for (const [n, o] of Object.entries(t))
    o === "" || typeof o > "u" || o === null || r.push(`${n}:${o}`);
  return r.join(";");
}
function C(e = 100) {
  const t = document.getElementsByTagName("*");
  let r, n, o;
  const s = [];
  for (let i = 0; i < t.length; i++)
    r = t[i], r.nodeType === 1 && (n = window.getComputedStyle(r, null), n.position !== "static" && (o = +n.zIndex, o > 0 && s.push(o)));
  return s.length ? Math.max.apply(null, s) : e;
}
function N(e, t, r = !1) {
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
    o = N(n, "overflow"), typeof o == "string" && t.includes(o) && r.push(n), n = n.parentElement;
  return r;
}
function H(e) {
  return new Promise((t, r) => {
    const n = new FileReader();
    n.onload = (o) => {
      var i;
      const s = (i = o.target) == null ? void 0 : i.result;
      s ? t(s) : r(new Error(`FileReader's result is null, ${o.target}`));
    }, n.onerror = r, n.readAsDataURL(e);
  });
}
function J(e) {
  return (window.URL || window.webkitURL).createObjectURL(e);
}
function L(e) {
  const t = e.split(",");
  let r = "";
  return /data:(\w+\/\w+);base64/.test(t[0]) && (r = RegExp.$1), {
    type: r,
    data: t[1]
  };
}
function P(e, t) {
  const r = L(e), n = window.atob(r.data);
  t = t || r.type;
  const o = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++)
    o[s] = n.charCodeAt(s);
  return new Blob([o], { type: t });
}
function q(e, t) {
  localStorage.setItem(e, JSON.stringify(t));
}
function Y(e, t) {
  try {
    const r = localStorage.getItem(e);
    return r ? JSON.parse(r) : t;
  } catch {
    return t;
  }
}
function Z(e) {
  localStorage.removeItem(e);
}
function z() {
  localStorage.clear();
}
function G(e, t) {
  sessionStorage.setItem(e, JSON.stringify(t));
}
function K(e, t) {
  try {
    const r = sessionStorage.getItem(e);
    return r ? JSON.parse(r) : t;
  } catch {
    return t;
  }
}
function W(e) {
  sessionStorage.removeItem(e);
}
function _() {
  sessionStorage.clear();
}
function c(e) {
  const t = Math.random().toString(36).slice(2);
  return typeof e == "number" ? e > t.length ? t.padEnd(Math.min(e, 1e3), t) : t.substring(0, e) : t;
}
function Q(e, t) {
  return [e, c(5), c(5), c(), t].filter(Boolean).join("-");
}
export {
  k as $,
  v as $$,
  P as base64ToBlob,
  M as classNames,
  z as clearLocalStorage,
  _ as clearSessionStorage,
  J as createBlobURL,
  A as createElement,
  U as createUrlForGetRequest,
  H as fileToBase64,
  T as formatBytes,
  D as formatDate,
  S as formatKeys,
  Y as getLocalStorage,
  C as getMaxZIndex,
  F as getScrollParents,
  K as getSessionStorage,
  N as getStyleValue,
  w as isArray,
  b as isElement,
  g as isNumber,
  $ as isNumberLike,
  u as isObject,
  O as joinUrl,
  Q as randomId,
  c as randomStr,
  Z as removeLocalStorage,
  W as removeSessionStorage,
  q as setLocalStorage,
  G as setSessionStorage,
  R as slice,
  L as splitBase64,
  I as splitValue,
  m as toCamelCase,
  h as toCssValue,
  E as toDate,
  f as toNumber,
  p as toSnakeCase,
  B as toStrStyles,
  j as toTwoDigits
};
