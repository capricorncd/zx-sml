/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const { EOL } = require('os')
const path = require('path')
const { isObject } = require('../dist/zx-sml.umd')
const { BLANK_LINE, DOC_TYPES } = require('./const')
const { getCommentsData } = require('./docs-input')
const {
  mkdirSync,
  isFileLike,
  isValidArray,
  formatAsArray,
  createPropsTable,
  mergeIntoArray,
} = require('./helpers')
const { log } = require('./log')

/**
 * create method docs
 * @param item `CommentInfoItem`
 * @param lines `string[]`
 */
function createMethodsDoc(item, lines, options = {}) {
  if (!item.returns.length) {
    item.returns.push({
      raw: '`void`',
      types: ['void'],
      desc: [],
    })
  }

  lines.push(
    `### ${item.fullName}`,
    BLANK_LINE,
    ...item.desc,
    BLANK_LINE,
    // '*' will be replaced by 'npx pretty-quick --staged' with '-'
    // item.params.map((param) => `* @param ${param}`),
    ...(options.methodWithRaw
      ? item.params.map((param) => `- @param ${param.raw}`)
      : createPropsTable(item.params, DOC_TYPES.method, 'Param', options)),
    BLANK_LINE,
    ...item.returns.map((ret) => `- @returns ${ret.raw}`),
    BLANK_LINE,
    ...item.codes,
    BLANK_LINE
  )
}

/**
 * create types docs
 * @param item `CommentInfoItem`
 * @param lines `string[]`
 * @param options `{typeWithTable: false, typeWithSourceCode: false}`
 */
function createTypesDoc(item, lines, options = {}) {
  lines.push(`### ${item.fullName}`, BLANK_LINE, ...item.desc, BLANK_LINE)
  // table
  const typeTable = createPropsTable(
    item.props,
    DOC_TYPES.type,
    'Prop',
    options
  )
  // codes
  const codes = ['```ts', ...item.codes, '```', BLANK_LINE]
  // source code alias
  const sourceCodeSummary = options.alias?.sourceCodeSummary

  const details = [
    '<details>',
    `<summary>${sourceCodeSummary || 'Source Code'}</summary>`,
    BLANK_LINE,
    ...codes,
    BLANK_LINE,
    '</details>',
    BLANK_LINE,
  ]

  const { typeWithSourceCode, typeWithTable, typeWithAuto } = options

  if (typeWithSourceCode && typeWithTable) {
    lines.push(...typeTable, ...codes)
  } else if (typeWithSourceCode) {
    // only source code
    lines.push(...codes)
  } else if (typeWithTable) {
    // only table
    lines.push(...typeTable)
  } else {
    // table and source code
    if (typeTable.length) {
      lines.push(...typeTable, ...details)
    } else {
      if (typeWithAuto) {
        // When typeWithAuto is true and typeTable is not, display only code.
        lines.push(...codes)
      } else {
        // default `<details>...</details>`
        lines.push(...details)
      }
    }
  }
}

/**
 * remove consecutive blank lines
 * @param lines `string[]`
 * @returns `string[]`
 */
function removeConsecutiveBlankLine(lines) {
  let blankLineCount = 0
  const outputLines = []
  lines.forEach((line) => {
    if (line === BLANK_LINE) {
      blankLineCount++
    } else {
      blankLineCount = 0
    }
    if (blankLineCount > 1) return
    outputLines.push(line)
  })
  return outputLines
}

// # Documents
function handleDocumentLines(arr, options, lines) {
  if (!isValidArray(arr)) return
  // types alias
  const typesAlias = options.alias?.types || {}
  const linesAfterTitles = formatAsArray(
    options.lines?.afterTitle?.[DOC_TYPES.document]
  )

  let outputFileName = null

  arr.forEach((item, i) => {
    if (i === 0) {
      outputFileName = item.name + '.md'
      lines.push(
        `# ${typesAlias[DOC_TYPES.document] || item.fullName}`,
        BLANK_LINE
      )
      // insert lines after method title
      if (isValidArray(linesAfterTitles)) {
        lines.push(...linesAfterTitles, BLANK_LINE)
      }
    } else {
      lines.push(`### ${item.fullName}`, BLANK_LINE)
    }
    lines.push(...item.desc, BLANK_LINE, ...item.codes, BLANK_LINE)
  })

  return outputFileName
}

// ## Methods
function handleMethodLines(arr, options, lines) {
  if (!isValidArray(arr)) return

  handleMarkdownTitle(DOC_TYPES.method, options, lines)

  arr.forEach((item) => {
    createMethodsDoc(item, lines, options)
  })
}

// ## Types
function handleTypesLines(arr, options, lines) {
  if (!isValidArray(arr)) return

  handleMarkdownTitle(DOC_TYPES.type, options, lines)

  arr.forEach((item) => {
    createTypesDoc(item, lines, options)
  })
}

function handleMarkdownTitle(type, options, lines) {
  const typesAlias = options.alias?.types || {}

  const mdTitles = {
    document: 'Document',
    method: 'Methods',
    type: 'Types',
    constant: 'Constants',
  }

  lines.push(`## ${typesAlias[type] || mdTitles[type] || type}`, BLANK_LINE)

  const linesAfterTitles = formatAsArray(options.lines?.afterTitle?.[type])

  // insert lines after type title
  if (isValidArray(linesAfterTitles)) {
    lines.push(...linesAfterTitles, BLANK_LINE)
  }
}

function handleConstLines(arr, options, lines) {
  if (!isValidArray(arr)) return

  handleMarkdownTitle(DOC_TYPES.constant, options, lines)

  arr.forEach((item) => {
    lines.push(`### ${item.fullName}`, BLANK_LINE, ...item.desc, BLANK_LINE)
    if (isValidArray(item.codes)) {
      lines.push('```ts', ...item.codes, '```', BLANK_LINE)
    }
  })
}

/**
 * handle output
 * @param arr `CommentInfoItem[]`
 * @param outputDir `string` optional parameter.
 * @param options `OutputFileOptions`
 * @returns `{ outputFileName: string | null, lines: string[], data: CommentInfoItem[] }`
 */
function handleOutput(arr, outputDir, options = {}) {
  console.log('Output file is start ...')
  // method|type|constant|document|component|...
  const originalData = {}

  let outputFileName = null

  arr.forEach((item) => {
    if (!originalData[item.type]) {
      originalData[item.type] = []
    }
    originalData[item.type].push(item)
  })

  const lines = []

  // start lines
  const startLines = formatAsArray(options.lines?.start)
  if (isValidArray(startLines)) {
    lines.push(...startLines, BLANK_LINE)
  }

  // linesAfterType
  const linesAfterType = options.lines?.afterType || {}

  // Output types and their order
  const outputDocTypesAndOrder = isValidArray(options.outputDocTypesAndOrder)
    ? options.outputDocTypesAndOrder
    : ['document', 'method', 'type', 'constant']

  outputDocTypesAndOrder.forEach((type) => {
    const handler = options.handlers?.[type]
    if (typeof handler === 'function') {
      handler(originalData[type], options, lines)
    } else {
      // # document
      if (type === DOC_TYPES.document) {
        outputFileName = handleDocumentLines(originalData[type], options, lines)
      } else if (type === DOC_TYPES.method) {
        handleMethodLines(originalData[type], options, lines)
      } else if (type === DOC_TYPES.type) {
        handleTypesLines(originalData[type], options, lines)
      } else if (type === DOC_TYPES.constant) {
        handleConstLines(originalData[type], options, lines)
      }
    }

    // lines after docTypes
    if (linesAfterType[type]) {
      lines.push(...formatAsArray(linesAfterType[type]), BLANK_LINE)
    }
  })

  // end lines
  const endLines = formatAsArray(options.lines?.end)
  if (isValidArray(endLines)) {
    lines.push(...endLines, BLANK_LINE)
  }

  const outputLines = removeConsecutiveBlankLine(lines)

  if (outputDir) {
    // file check
    if (isFileLike(outputDir)) {
      outputFileName = outputDir
    } else if (outputFileName) {
      outputFileName = path.join(outputDir, outputFileName)
    }

    // output file
    if (outputFileName) writeFileSync(outputFileName, outputLines)
  }

  log(outputFileName)
  console.log('Output file is ended.')
  return {
    outputFileName,
    lines: outputLines,
    data: arr,
  }
}

/**
 * @method writeFileSync(outputFileName, outputLines)
 * Synchronized file write function.
 * @param outputFileName `string` Output filename, absolute path.
 * @param outputLines `string[] | NodeJS.ArrayBufferView | string` The output file content, an array of strings.
 */
function writeFileSync(outputFileName, outputLines) {
  if (Array.isArray(outputLines)) {
    outputLines = outputLines.join(EOL)
  }
  fs.writeFileSync(outputFileName, outputLines, 'utf8')
}

/**
 * @method outputFile(input, outputDirOrFile, options)
 * Output the obtained annotation content as a document.
 * @param input `{[filePath]: {[key]: CommentInfoItem}} | CommentInfoItem[] | string` Comment obtained from the source. When `string` it's a file path, and the [getCommentsData](#getcommentsdatainput-needarray-options) will be called. What's [CommentInfoItem](#commentinfoitem).
 * @param outputDirOrFile? `string` Optional parameter. The file or directory where the output will be written. When `outputDirOrFile` is `undefined`, no file will be output.
 * @param options? `OutputFileOptions` [OutputFileOptions](#OutputFileOptions)
 * @returns `OutputFileReturns | OutputFileReturns[]` What's [OutputFileReturns](#outputfilereturns)
 */
function outputFile(input, outputDirOrFile, options = {}) {
  // file or directory's path, or an array of paths
  if (
    // file or directory's path
    typeof input === 'string' ||
    // or an array of paths
    (isValidArray(input) && input.every((str) => typeof str === 'string'))
  ) {
    input = getCommentsData(input, true, options)
  }

  // check other parameters
  if (isObject(outputDirOrFile)) {
    options = outputDirOrFile
    outputDirOrFile = undefined
  }

  // Options Compatibility Handling, which will be removed in a later version.
  const optionsLines = options.lines || {
    start: options.startLines,
    end: options.endLines,
    afterType: options.linesAfterType,
    afterTitle: options.linesAfterTitle,
  }

  const optionsAlias = options.alias || {
    tableHead: options.tableHeadAlias,
  }

  options = {
    ...options,
    lines: optionsLines,
    alias: optionsAlias,
  }

  if (outputDirOrFile && !fs.existsSync(outputDirOrFile)) {
    if (isFileLike(outputDirOrFile)) {
      const outputDir = outputDirOrFile.split('/')
      outputDir.pop()
      mkdirSync(outputDir.join('/'))
    } else {
      mkdirSync(outputDirOrFile)
    }
  }
  if (Array.isArray(input)) {
    return handleOutput(input, outputDirOrFile, options)
  } else {
    // Combine output into one file
    return handleOutput(
      mergeIntoArray(input, options),
      outputDirOrFile,
      options
    )
    // // Separate output of different files, provided that outputDirOrFile is a file directory, and each file contains `@document`.
    // return Object.keys(input).map((key) => {
    //   return handleOutput(
    //     toArray(input[key], options),
    //     outputDirOrFile,
    //     options
    //   )
    // })
  }
}

module.exports = {
  outputFile,
  writeFileSync,
}
