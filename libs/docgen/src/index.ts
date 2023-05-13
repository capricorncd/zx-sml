/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/07/10 16:01:17 (GMT+0900)
 *
 * @document zx-sml/docgen
 *
 * A document generator that read the comments in the code and automatically generate MarkDown documents.
 *
 * ```js
 * const { mkdirSync } = require('zx-sml/docgen')
 * // import { mkdirSync } from 'zx-sml/docgen'
 *
 * mkdirSync('./a/b/c')
 * ```
 *
 * see [DEMO](https://github.com/capricorncd/zx-sml/blob/main/scripts/create-docs.js)
 */
export * from './const'
export { getCommentsData, getTypes } from './docs-input'
export { outputFile } from './docs-output'
export * from './helpers'
export * from './log'
