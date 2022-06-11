;(function (n, d) {
  typeof exports == 'object' && typeof module != 'undefined'
    ? d(exports)
    : typeof define == 'function' && define.amd
    ? define(['exports'], d)
    : ((n = typeof globalThis != 'undefined' ? globalThis : n || self),
      d((n['zx-sml'] = {})))
})(this, function (n) {
  'use strict'
  function d(e) {
    return Array.isArray(e)
  }
  function m(e) {
    return e !== null && !d(e) && typeof e == 'object'
  }
  var A =
      typeof globalThis != 'undefined'
        ? globalThis
        : typeof window != 'undefined'
        ? window
        : typeof global != 'undefined'
        ? global
        : typeof self != 'undefined'
        ? self
        : {},
    p = { exports: {} }
  /*! For license information please see date-utils-2020.js.LICENSE.txt */ ;(function (
    e,
    t
  ) {
    ;(function (u, i) {
      e.exports = i()
    })(typeof self != 'undefined' ? self : A, function () {
      return (() => {
        var u = {
            949: (f, o) => {
              Object.defineProperty(o, '__esModule', { value: !0 }),
                (o.toTwoDigits = void 0),
                (o.toTwoDigits = function (s) {
                  return s[1] ? s : '0' + s
                })
            },
            607: (f, o, s) => {
              Object.defineProperty(o, '__esModule', { value: !0 }),
                (o.toTwoDigits = o.toDate = o.formatDate = void 0)
              var D = s(949)
              Object.defineProperty(o, 'toTwoDigits', {
                enumerable: !0,
                get: function () {
                  return D.toTwoDigits
                },
              })
              var U = {
                weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
              }
              function $(l) {
                if (l instanceof Date) return l
                if (typeof l == 'number') return new Date(l)
                if (typeof l == 'string') {
                  var r = l.trim()
                  if (/^\d+$/.test(r)) {
                    var g = r.length
                    return g === 8
                      ? new Date(
                          [r.substr(0, 4), r.substr(4, 2), r.substr(6, 2)].join(
                            '/'
                          )
                        )
                      : g === 6
                      ? new Date(
                          [r.substr(0, 4), r.substr(4, 2), '01'].join('/')
                        )
                      : g === 4
                      ? new Date(r + '/01/01')
                      : new Date(parseInt(l))
                  }
                  if (
                    ((r = r
                      .replace(/[年月日]/g, function (a) {
                        return a === '\u65E5' ? '' : '/'
                      })
                      .replace(/[(（（].*?[)））]/g, ' ')
                      .replace(/\bam|pm\b/gi, ' ')
                      .replace(/\s+/g, ' ')),
                    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.test(r))
                  )
                    return new Date([RegExp.$1, RegExp.$2, RegExp.$3].join('/'))
                  if (/^(\d{4})[-/](\d{1,2})$/.test(r))
                    return new Date([RegExp.$1, RegExp.$2, '01'].join('/'))
                  var c = new Date(r)
                  return isNaN(c.getFullYear()) ? null : c
                }
                return null
              }
              ;(o.formatDate = function (l, r, g) {
                var c,
                  a = $(l)
                if (!a || !r) return l + ''
                if (r === 'timestamp') return a.getTime().toString()
                ;/(y+)/i.test(r) &&
                  ((c = RegExp.$1),
                  (r = r.replace(
                    c,
                    (a.getFullYear() + '').substr(4 - c.length)
                  ))),
                  (g && Array.isArray(g.weeks)) || (g = U)
                var j = {
                  'M+': a.getMonth() + 1,
                  'd+': a.getDate(),
                  'h+': a.getHours(),
                  'm+': a.getMinutes(),
                  's+': a.getSeconds(),
                  'w+': a.getDay(),
                  'W+': g.weeks[a.getDay()],
                  'a+': a.getHours() < 12 ? 'am' : 'pm',
                  'A+': a.getHours() < 12 ? 'AM' : 'PM',
                }
                for (var v in j)
                  if (new RegExp('(' + v + ')').test(r)) {
                    c = RegExp.$1
                    var T = j[v] + ''
                    r = r.replace(c, c.length === 1 ? T : D.toTwoDigits(T))
                  }
                if (/(g)/i.test(r)) {
                  var h = a.toString().split(/\s+/).slice(5),
                    _ = r.includes('g')
                  r = r.replace(/g/i, _ ? h[0] : h.join(' '))
                }
                return r
              }),
                (o.toDate = $)
            },
          },
          i = {}
        return (function f(o) {
          if (i[o]) return i[o].exports
          var s = (i[o] = { exports: {} })
          return u[o](s, s.exports, f), s.exports
        })(607)
      })()
    })
  })(p)
  function E(e, t = {}) {
    const [u, i] = e.split('?'),
      f = []
    i && f.push(i)
    for (const [o, s] of Object.entries(t))
      f.push(`${o}=${m(s) ? JSON.stringify(s) : s}`)
    return u + (f.length ? `?${f.join('&')}` : '')
  }
  function S(e = '', t = '-') {
    return e
      .replace(/[A-Z]/g, (u) => `${t}${u.toLowerCase()}`)
      .replace(new RegExp(`^${t}`), '')
  }
  function M(e = '', t = !1) {
    const u = e.replace(/[-_\s](\w)/g, (i, f) => f.toUpperCase())
    return t ? u.replace(/^\w/, (i) => i.toUpperCase()) : u
  }
  function y(e) {
    if (typeof e == 'number') return e
    const t = Number(e)
    return isNaN(t) ? 0 : t
  }
  function R(e) {
    if (typeof e == 'number') return [e, '']
    const t = e.match(/^(-?\d+(?:\.\d+)?)([a-zA-Z%]*)$/)
    return t ? [y(t[1]), t[2]] : [0, '']
  }
  function b(e) {
    return typeof e == 'string'
      ? e
      : e === null || typeof e == 'undefined'
      ? ''
      : Array.isArray(e)
      ? e.map(b).join(' ')
      : typeof e == 'object'
      ? Object.keys(e)
          .filter((t) => e[t])
          .join(' ')
      : String(e)
  }
  function N(...e) {
    return e
      .map(b)
      .filter((t) => !!t)
      .join(' ')
  }
  function O(...e) {
    return e
      .join('/')
      .replace(/(\w(?!:))(\/+)/g, '$1/')
      .replace(/\/$/, '')
      .replace(/\/([?#])/, '$1')
  }
  function w(e, t = 0) {
    return Array.prototype.slice.call(e, t)
  }
  function C(e, t = document) {
    return e instanceof HTMLElement ? e : t.querySelector(e)
  }
  function k(e, t = document) {
    return w(t.querySelectorAll(e), 0)
  }
  function x(e, t = {}, u) {
    const i = document.createElement(e)
    for (const [f, o] of Object.entries(t)) i.setAttribute(f, o)
    return u && (i.innerHTML = u), i
  }
  ;(n.$ = C),
    (n.$$ = k),
    (n.classNames = N),
    (n.createElement = x),
    (n.createUrlForGetRequest = E),
    (n.formatDate = p.exports.formatDate),
    (n.isArray = d),
    (n.isObject = m),
    (n.joinUrl = O),
    (n.slice = w),
    (n.splitValue = R),
    (n.toCamelCase = M),
    (n.toDate = p.exports.toDate),
    (n.toNumber = y),
    (n.toSnakeCase = S),
    (n.toTwoDigits = p.exports.toTwoDigits),
    Object.defineProperties(n, {
      __esModule: { value: !0 },
      [Symbol.toStringTag]: { value: 'Module' },
    })
})
