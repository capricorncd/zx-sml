/*!
 * zx-sml version 0.2.1
 * Author: Capricorncd <capricorncd@qq.com>
 * Repository: https://github.com/capricorncd/zx-sml
 * Released on: 2022-07-24 15:34:05 (GMT+0900)
 */
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
function isArray(input) {
  return Array.isArray(input);
}
function isObject(input) {
  return input !== null && !isArray(input) && typeof input === "object";
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
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var dateUtils2020 = { exports: {} };
/*! For license information please see date-utils-2020.js.LICENSE.txt */
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(typeof self != "undefined" ? self : commonjsGlobal, function() {
    return (() => {
      var e = { 949: (e2, t2) => {
        Object.defineProperty(t2, "__esModule", { value: true }), t2.toTwoDigits = void 0, t2.toTwoDigits = function(e3) {
          return e3[1] ? e3 : "0" + e3;
        };
      }, 607: (e2, t2, r) => {
        Object.defineProperty(t2, "__esModule", { value: true }), t2.toTwoDigits = t2.toDate = t2.formatDate = void 0;
        var n = r(949);
        Object.defineProperty(t2, "toTwoDigits", { enumerable: true, get: function() {
          return n.toTwoDigits;
        } });
        var i = { weeks: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] };
        function o(e3) {
          if (e3 instanceof Date)
            return e3;
          if (typeof e3 == "number")
            return new Date(e3);
          if (typeof e3 == "string") {
            var t3 = e3.trim();
            if (/^\d+$/.test(t3)) {
              var r2 = t3.length;
              return r2 === 8 ? new Date([t3.substr(0, 4), t3.substr(4, 2), t3.substr(6, 2)].join("/")) : r2 === 6 ? new Date([t3.substr(0, 4), t3.substr(4, 2), "01"].join("/")) : r2 === 4 ? new Date(t3 + "/01/01") : new Date(parseInt(e3));
            }
            if (t3 = t3.replace(/[?????????]/g, function(e4) {
              return e4 === "\u65E5" ? "" : "/";
            }).replace(/[(??????].*?[)??????]/g, " ").replace(/\bam|pm\b/gi, " ").replace(/\s+/g, " "), /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.test(t3))
              return new Date([RegExp.$1, RegExp.$2, RegExp.$3].join("/"));
            if (/^(\d{4})[-/](\d{1,2})$/.test(t3))
              return new Date([RegExp.$1, RegExp.$2, "01"].join("/"));
            var n2 = new Date(t3);
            return isNaN(n2.getFullYear()) ? null : n2;
          }
          return null;
        }
        t2.formatDate = function(e3, t3, r2) {
          var s, a = o(e3);
          if (!a || !t3)
            return e3 + "";
          if (t3 === "timestamp")
            return a.getTime().toString();
          /(y+)/i.test(t3) && (s = RegExp.$1, t3 = t3.replace(s, (a.getFullYear() + "").substr(4 - s.length))), r2 && Array.isArray(r2.weeks) || (r2 = i);
          var u = { "M+": a.getMonth() + 1, "d+": a.getDate(), "h+": a.getHours(), "m+": a.getMinutes(), "s+": a.getSeconds(), "w+": a.getDay(), "W+": r2.weeks[a.getDay()], "a+": a.getHours() < 12 ? "am" : "pm", "A+": a.getHours() < 12 ? "AM" : "PM" };
          for (var f in u)
            if (new RegExp("(" + f + ")").test(t3)) {
              s = RegExp.$1;
              var g = u[f] + "";
              t3 = t3.replace(s, s.length === 1 ? g : n.toTwoDigits(g));
            }
          if (/(g)/i.test(t3)) {
            var p = a.toString().split(/\s+/).slice(5), l = t3.includes("g");
            t3 = t3.replace(/g/i, l ? p[0] : p.join(" "));
          }
          return t3;
        }, t2.toDate = o;
      } }, t = {};
      return function r(n) {
        if (t[n])
          return t[n].exports;
        var i = t[n] = { exports: {} };
        return e[n](i, i.exports, r), i.exports;
      }(607);
    })();
  });
})(dateUtils2020);
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
    el.setAttribute(toSnakeCase(key), key === "style" && isObject(val) ? toStrStyles(val) : val);
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
var formatDate = dateUtils2020.exports.formatDate;
var toDate = dateUtils2020.exports.toDate;
var toTwoDigits = dateUtils2020.exports.toTwoDigits;
export { $, $$, base64ToBlob, classNames, createBlobURL, createElement, createUrlForGetRequest, fileToBase64, formatBytes, formatDate, formatKeys, getMaxZIndex, getScrollParents, getStyleValue, isArray, isElement, isNumberLike, isObject, joinUrl, slice, splitBase64, splitValue, toCamelCase, toDate, toNumber, toSnakeCase, toStrStyles, toTwoDigits };
