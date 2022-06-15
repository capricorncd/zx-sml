/*!
 * zx-sml version 0.0.3
 * Author: Capricorncd <capricorncd@qq.com>
 * Repository: https://github.com/capricorncd/zx-sml
 * Released on: 2022-06-15 20:10:46 (GMT+0900)
 */
function isArray(input) {
  return Array.isArray(input);
}
function isObject(input) {
  return input !== null && !isArray(input) && typeof input === "object";
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
            if (t3 = t3.replace(/[年月日]/g, function(e4) {
              return e4 === "\u65E5" ? "" : "/";
            }).replace(/[(（（].*?[)））]/g, " ").replace(/\bam|pm\b/gi, " ").replace(/\s+/g, " "), /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.test(t3))
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
  return input.replace(/[A-Z]/g, (s) => `${connectSymbol}${s.toLowerCase()}`).replace(new RegExp(`^${connectSymbol}`), "");
}
function toCamelCase(input = "", isFirstCapitalLetter = false) {
  const result = input.replace(/[-_\s](\w)/g, (_, s) => s.toUpperCase());
  return isFirstCapitalLetter ? result.replace(/^\w/, (s) => s.toUpperCase()) : result;
}
function toNumber(input, isStrictMode = false) {
  if (typeof input === "number")
    return input;
  if (typeof input === "string") {
    if (!isStrictMode && /^(-?\d+(?:\.\d+)?)\D*/.test(input.replace(/(\d),/g, "$1"))) {
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
  const result = input.replace(/(\d),/g, "$1").match(/^(-?\d+(?:\.\d+)?)(.*)$/);
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
  const url = args.join("/").replace(/(\w(?!:))(\/+)/g, "$1/").replace(/\/$/, "");
  return url.replace(/\/([?#])/, "$1");
}
function slice(arrayLike, offset = 0) {
  return Array.prototype.slice.call(arrayLike, offset);
}
function $(selector, doc = document) {
  if (selector instanceof HTMLElement)
    return selector;
  return doc.querySelector(selector);
}
function $$(selector, doc = document) {
  return slice(doc.querySelectorAll(selector), 0);
}
function createElement(tag, attrs = {}, innerHTML) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    el.setAttribute(key, val);
  }
  if (innerHTML)
    el.innerHTML = innerHTML;
  return el;
}
var formatDate = dateUtils2020.exports.formatDate;
var toDate = dateUtils2020.exports.toDate;
var toTwoDigits = dateUtils2020.exports.toTwoDigits;
export { $, $$, classNames, createElement, createUrlForGetRequest, formatDate, isArray, isObject, joinUrl, slice, splitValue, toCamelCase, toDate, toNumber, toSnakeCase, toTwoDigits };
