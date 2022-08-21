/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/07/10 16:01:17 (GMT+0900)
 *
 * @document zx-sml/nodejs
 *
 * Some tool functions used in the Nodejs environment.
 * see [DEMO](https://github.com/capricorncd/zx-sml/blob/main/scripts/create-docs.js)
 *
 * ```js
 * const { mkdirSync } = require('zx-sml/nodejs')
 *
 * mkdirSync('./a/b/c')
 * ```
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getCommentsData, outputFile, getTypes } = require('./create-docs')
const {
  mkdirSync,
  isFileLike,
  isValidArray,
  toStrForStrArray,
  findCharIndex,
  formatAsArray,
  formatAsTypes,
  replaceVerticalBarsInTables,
  getTypeName,
  handleReturn,
  handleParam,
  handleProps,
  createPropsTable,
  mergeIntoArray,
  toArray,
  toTableLines,
} = require('./helpers')
const { log, warn, error } = require('./log')

module.exports = {
  getCommentsData,
  getTypes,
  outputFile,
  log,
  warn,
  error,
  mkdirSync,
  isFileLike,
  isValidArray,
  toStrForStrArray,
  findCharIndex,
  formatAsArray,
  formatAsTypes,
  replaceVerticalBarsInTables,
  getTypeName,
  handleReturn,
  handleParam,
  handleProps,
  createPropsTable,
  mergeIntoArray,
  toArray,
  toTableLines,
}
