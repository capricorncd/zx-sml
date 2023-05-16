/*!
 * zx-sml version 0.7.4
 * Author: Capricorncd <capricorncd@qq.com>
 * Repository: https://github.com/capricorncd/zx-sml
 * Released on: 2023-05-16 20:59:18 (GMT+0900)
 */
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a2, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a2, prop, b[prop]);
    }
  return a2;
};
function isArray(input) {
  return Array.isArray(input);
}
function isObject(input) {
  return typeof input === "object" && input !== null && !isArray(input);
}
function isElement(el) {
  return el && el.nodeType === 1;
}
function isNumberLike(input) {
  if (typeof input === "string") {
    return /^-?\d+(\.\d+)?$/.test(input);
  }
  return typeof input === "number";
}
/*!
 * date-utils-2020 v1.1.0
 * Author: Capricorncd
 * Repository: https://github.com/capricorncd/date-utils-2020#readme
 * Released on: 2023/01/14 14:10:19 GMT+0900
 */
function l(n) {
  return String(n).padStart(2, "0");
}
const a = {
  weeks: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
};
function u(n, e, t) {
  const s = c(n);
  if (!s || !e)
    return String(n);
  if (e === "timestamp")
    return s.getTime().toString();
  if (/(y+)/i.test(e)) {
    const r = RegExp.$1;
    e = e.replace(r, (s.getFullYear() + "").substring(4 - r.length));
  }
  (!t || !Array.isArray(t.weeks)) && (t = a);
  const o = {
    "M+": s.getMonth() + 1,
    "d+": s.getDate(),
    "h+": s.getHours(),
    "m+": s.getMinutes(),
    "s+": s.getSeconds(),
    "a+": s.getHours() < 12 ? "am" : "pm",
    "A+": s.getHours() < 12 ? "AM" : "PM"
  };
  let g;
  for (const r in o)
    if (new RegExp("(" + r + ")").test(e)) {
      g = RegExp.$1;
      const i = o[r] + "";
      e = e.replace(g, g.length === 1 ? i : l(i));
    }
  if (/w+/i.test(e)) {
    const r = s.getDay();
    e = e.replace(/w+/i, /W+/.test(e) ? t.weeks[r] : String(r));
  }
  if (/g/i.test(e)) {
    const r = s.toString().split(/\s+/).slice(5), i = e.includes("g");
    e = e.replace(/g/i, i ? r[0] : r.join(" "));
  }
  return e;
}
function c(n) {
  let e = null;
  if (n instanceof Date)
    e = n;
  else if (typeof n == "number")
    e = new Date(n);
  else if (typeof n == "string") {
    let t = n.trim();
    if (/^\d+$/.test(t)) {
      const s = t.length;
      s === 8 ? e = new Date([t.substring(0, 4), t.substring(4, 6), t.substring(6, 8)].join("/")) : s === 6 ? e = new Date([t.substring(0, 4), t.substring(4, 6), "01"].join("/")) : s === 4 ? e = new Date(t + "/01/01") : e = new Date(parseInt(n));
    } else
      t = t.replace(/[年月日]/g, (s) => s === "\u65E5" ? "" : "/").replace(/[(（（].*?[)））]/g, " ").replace(/\bam|pm\b/ig, " ").replace(/\s+/g, " "), /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.test(t) ? e = new Date([RegExp.$1, RegExp.$2, RegExp.$3].join("/")) : /^(\d{4})[-/](\d{1,2})$/.test(t) ? e = new Date([RegExp.$1, RegExp.$2, "01"].join("/")) : e = new Date(t);
  }
  return e && !isNaN(e.getFullYear()) ? e : null;
}
function createUrlForGetRequest(url, params = {}) {
  const [prefixUrl, search] = url.split("?");
  const queryParams = [];
  if (search)
    queryParams.push(search);
  for (const [key, val] of Object.entries(params)) {
    queryParams.push(`${key}=${isObject(val) ? JSON.stringify(val) : val}`);
  }
  return prefixUrl + (queryParams.length ? `?${queryParams.join("&")}` : "");
}
function toSnakeCase(input = "", connectSymbol = "-") {
  return input.replace(/[A-Z]/g, (s, offset) => `${offset > 0 ? connectSymbol : ""}${s.toLowerCase()}`);
}
function toCamelCase(input = "", isFirstCapitalLetter = false) {
  const result = input.replace(/[-_\s](\w)/g, (_, s) => s.toUpperCase());
  return isFirstCapitalLetter ? result.replace(/^\w/, (s) => s.toUpperCase()) : result;
}
function restoreUSLocalString(input) {
  return input.replace(/^-?[1-9]\d{0,2}(,\d{3})+/, (match) => match.replace(/,/g, ""));
}
function toNumber(input, isStrictMode = false) {
  if (typeof input === "number")
    return input;
  if (typeof input === "string") {
    if (!isStrictMode && /^(-?\d+(?:\.\d+)?)\D*/.test(restoreUSLocalString(input))) {
      return toNumber(RegExp.$1, true);
    }
    const n = Number(input);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}
function splitValue(input) {
  if (typeof input === "number") {
    return [input, ""];
  }
  const result = restoreUSLocalString(input).match(/^(-?\d+(?:\.\d+)?)(.*)$/);
  return result ? [toNumber(result[1], true), result[2]] : [0, ""];
}
function toString(input) {
  if (typeof input === "string")
    return input;
  if (input === null || typeof input === "undefined")
    return "";
  if (Array.isArray(input))
    return input.map(toString).join(" ");
  if (typeof input === "object") {
    return Object.keys(input).filter((key) => input[key]).join(" ");
  }
  return String(input);
}
function classNames(...args) {
  return args.map(toString).filter((item) => !!item).join(" ");
}
function joinUrl(...args) {
  return args.join("/").replace(/(\w(?!:))(\/+)/g, "$1/").replace(/\/([?#])|\/$/g, "$1");
}
function slice(arrayLike, offset = 0) {
  return Array.prototype.slice.call(arrayLike, offset);
}
function formatKeys(obj = {}, isCamelCase = false) {
  const formatter = isCamelCase ? toCamelCase : toSnakeCase;
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[formatter(key)] = isObject(value) ? formatKeys(value, isCamelCase) : value;
  }
  return result;
}
function formatBytes(bytes, useDecimal = false, decimalPlaces = 2) {
  const aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  const denominator = useDecimal ? 1e3 : 1024;
  let value = String(bytes);
  let unit = "Byte";
  for (let nMultiple = 0, nApprox = bytes / denominator; nApprox > 1; nApprox /= denominator, nMultiple++) {
    value = nApprox.toFixed(decimalPlaces);
    unit = aMultiples[nMultiple];
  }
  if (useDecimal)
    unit = unit.replace("i", "");
  return {
    text: value.replace(/\.0+$/, "") + unit,
    value: +value,
    unit,
    bytes
  };
}
function $(selector, doc = document) {
  if (!selector)
    return null;
  if (selector instanceof HTMLElement)
    return selector;
  return doc.querySelector(selector);
}
function $$(selector, doc = document) {
  return slice(doc.querySelectorAll(selector));
}
function createElement(tag, attrs = {}, children) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    el.setAttribute(toSnakeCase(key), key === "style" && isObject(val) ? toStrStyles(val) : String(val));
  }
  if (children) {
    if (!Array.isArray(children)) {
      children = [children];
    }
    children.forEach((child) => {
      if (typeof child === "string") {
        const temp = createElement("div");
        temp.innerHTML = child;
        el.append(...temp.childNodes);
      } else {
        el.append(child);
      }
    });
  }
  return el;
}
function toStrStyles(...args) {
  const styles = args.reduce((prev, obj) => {
    return __spreadValues(__spreadValues({}, prev), formatKeys(obj));
  }, {});
  const arr = [];
  for (const [key, value] of Object.entries(styles)) {
    if (value === "" || typeof value === "undefined" || value === null)
      continue;
    arr.push(`${key}:${value}`);
  }
  return arr.join(";");
}
function getMaxZIndex(defaultZIndex = 100) {
  const elements = document.getElementsByTagName("*");
  let el, css, zIndex;
  const arr = [];
  for (let i = 0; i < elements.length; i++) {
    el = elements[i];
    if (el.nodeType !== 1)
      continue;
    css = window.getComputedStyle(el, null);
    if (css.position !== "static") {
      zIndex = +css.zIndex;
      if (zIndex > 0)
        arr.push(zIndex);
    }
  }
  return arr.length ? Math.max.apply(null, arr) : defaultZIndex;
}
function getStyleValue(el, attr, isNumber = false) {
  if (!isElement(el))
    return null;
  const css = window.getComputedStyle(el, null);
  if (attr) {
    try {
      const value = css[toCamelCase(attr)];
      return isNumber ? toNumber(value) : value;
    } catch (e) {
      return null;
    }
  }
  return css;
}
function getScrollParents(el) {
  const scrollableValues = ["auto", "scroll"];
  const arr = [];
  let parent = el.parentElement;
  let val;
  while (parent) {
    val = getStyleValue(parent, "overflow");
    if (typeof val === "string" && scrollableValues.includes(val)) {
      arr.push(parent);
    }
    parent = parent.parentElement;
  }
  return arr;
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a;
      const result = (_a = e.target) == null ? void 0 : _a.result;
      if (result) {
        resolve(result);
      } else {
        reject(new Error(`FileReader's result is null, ${e.target}`));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function createBlobURL(blob) {
  const windowURL = window.URL || window.webkitURL;
  return windowURL.createObjectURL(blob);
}
function splitBase64(base64) {
  const arr = base64.split(",");
  let type = "";
  if (/data:(\w+\/\w+);base64/.test(arr[0])) {
    type = RegExp.$1;
  }
  return {
    type,
    data: arr[1]
  };
}
function base64ToBlob(base64, type) {
  const dataInfo = splitBase64(base64);
  const data = window.atob(dataInfo.data);
  type = type || dataInfo.type;
  const ia = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    ia[i] = data.charCodeAt(i);
  }
  return new Blob([ia], { type });
}
function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function getLocalStorage(key, def) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : def;
  } catch (err) {
    return def;
  }
}
function removeLocalStorage(key) {
  localStorage.removeItem(key);
}
function clearLocalStorage() {
  localStorage.clear();
}
function setSessionStorage(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}
function getSessionStorage(key, def) {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : def;
  } catch (err) {
    return def;
  }
}
function removeSessionStorage(key) {
  sessionStorage.removeItem(key);
}
function clearSessionStorage() {
  sessionStorage.clear();
}
function randomStr(n) {
  const str = Math.random().toString(16).replace(/^0\.\d*/, "");
  return typeof n === "number" ? n > str.length ? str.padEnd(Math.min(n, 1e3), str) : str.substring(0, n) : str;
}
function randomId(prefix, suffix) {
  return [prefix, randomStr(5), randomStr(5), randomStr(), suffix].filter(Boolean).join("-");
}
export { $, $$, base64ToBlob, classNames, clearLocalStorage, clearSessionStorage, createBlobURL, createElement, createUrlForGetRequest, fileToBase64, formatBytes, u as formatDate, formatKeys, getLocalStorage, getMaxZIndex, getScrollParents, getSessionStorage, getStyleValue, isArray, isElement, isNumberLike, isObject, joinUrl, randomId, randomStr, removeLocalStorage, removeSessionStorage, setLocalStorage, setSessionStorage, slice, splitBase64, splitValue, toCamelCase, c as toDate, toNumber, toSnakeCase, toStrStyles, l as toTwoDigits };
