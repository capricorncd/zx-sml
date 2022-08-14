/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const { warn } = require('./log')

/**
 * @method mkdirSync(dir)
 * make a directory synchronously
 * @param dir `string` directory path
 * @returns `void`
 */
function mkdirSync(dir) {
  if (!dir || fs.existsSync(dir)) {
    warn(`The directory already exists, or is null, ${dir}`)
    return
  }
  const index = dir.lastIndexOf('/')
  if (index === -1) {
    warn(`The 'dir' maybe a valid directory name, ${dir}`)
    return
  }
  const parent = dir.substring(0, index)
  if (fs.existsSync(parent)) {
    fs.mkdirSync(dir)
  } else {
    mkdirSync(parent)
    mkdirSync(dir)
  }
}

/**
 * is file like
 * @param filePath `string`
 * @returns `boolean`
 */
function isFileLike(filePath) {
  if (typeof filePath === 'string') {
    return /.+\.\w+$/.test(filePath)
  }
  return false
}

function isObject(o) {
  return !!o && typeof o === 'object'
}

function isValidArray(i) {
  return Array.isArray(i) && i.length > 0
}

/**
 * input `['str1', 'str2', '...', 'strN']`
 * output `str1 str2 ... strN`
 * input `[]`
 * output `-`
 * @param arr
 * @param spliceSymbol
 * @param defaultReturnValue
 * @returns
 */
function toStrForStrArray(arr, spliceSymbol = ' ', defaultReturnValue = '-') {
  const newArr = arr.filter((str) => !!str)
  return newArr.length ? newArr.join(spliceSymbol) : defaultReturnValue
}

/**
 * Find the N occurrence of a string
 * @param {*} str `string`
 * @param {*} char `string`
 * @param {*} times `number`
 * @returns
 */
function findCharIndex(str, char, times) {
  let index = -1
  for (let i = 0; i < times; i++) {
    index = str.indexOf(char, index + 1)
    if (index === -1) break
  }
  return index
}

/**
 * formatAsArray
 * @param input `string | string[]`
 * @returns `string[]`
 */
function formatAsArray(input) {
  return Array.isArray(input) ? input : [input]
}

/**
 * format as types
 * @param input
 * @returns `string[]`
 */
function formatAsTypes(input) {
  input = input.trim()

  // only one type
  if (
    !input.includes('|') ||
    /^(\w+<([^<]|\([^(]+\)\[\]|\w+<[^<]+>)+>|\([^(]+\)\[\])$/.test(input)
  ) {
    return [input]
  }

  // if (!/(\w+<.+>|\(.+\)\[\])/.test(input))
  return input.split(/\s*\|\s*/)

  // Record<'document' | 'method' | 'type', string | string[]> | OtherType
  // Record<string, Array<AnyType | OtherType> | Record<string, AnyType>>
  // Array<string | number> or
  // (string | number)[] | keyof type SomeObject | OtherType
  // Array<string> | Array<number> or string[] | number[]
}

/**
 * Replace vertical bars in tables so they don't affect table rendering in Markdown.
 * @param input
 * @returns
 */
function replaceVerticalBarsInTables(input) {
  return input.replace(/\|/g, '\\|')
}

module.exports = {
  mkdirSync,
  isFileLike,
  isObject,
  isValidArray,
  toStrForStrArray,
  findCharIndex,
  formatAsArray,
  formatAsTypes,
  replaceVerticalBarsInTables,
}
