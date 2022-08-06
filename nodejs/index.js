/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/07/10 16:01:17 (GMT+0900)
 *
 * @document zx-sml/nodejs
 *
 * Some tool functions used in the Nodejs environment
 *
 * ```js
 * const { mkdirSync } = require('zx-sml/nodejs')
 *
 * mkdirSync('./a/b/c')
 * ```
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getCommentsData, outputFile } = require('./create-docs')
const { mkdirSync } = require('./helpers')
const { log, warn, error } = require('./log')

module.exports = {
  getCommentsData,
  outputFile,
  mkdirSync,
  log,
  warn,
  error,
}
