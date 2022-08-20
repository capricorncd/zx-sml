/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const { EOL } = require('os')
const path = require('path')
const {
  mkdirSync,
  isFileLike,
  isObject,
  isValidArray,
  formatAsArray,
  handleProps,
  getTypeName,
  handleReturn,
  handleParam,
  createPropsTable,
  mergeIntoArray,
  toArray,
} = require('./helpers')
const { log } = require('./log')

// blank line
const BLANK_LINE = ''

/**
 * DOC_TYPES
 */
const DOC_TYPES = {
  method: 'method',
  type: 'type',
  document: 'document',
  constant: 'constant',
}

/**
 * handle file
 * get `method|type|class|document` annotations in file.
 * @param filePath `string` absolute file path.
 * @param data `object`
 * @param options `GetCommentsDataOptions`
 * @returns `Record<string, CommentInfoItem>`
 */
function handleFile(filePath, data, options = {}) {
  // target types
  const targetTypes = Object.keys(DOC_TYPES)
  if (isValidArray(options.expendTypes)) {
    options.expendTypes.forEach((t) => {
      if (t && !targetTypes.includes(t)) {
        targetTypes.push(t)
      }
    })
  }

  const typesRegExp = new RegExp(`^\\*\\s*@(${targetTypes.join('|')})\\s*(.+)`)

  // types of source code
  const codeTypes = [DOC_TYPES.type, DOC_TYPES.constant]
  if (isValidArray(options.codeTypes)) {
    options.codeTypes.forEach((t) => {
      codeTypes.push(t)
    })
  }

  let isTargetComment = false
  let isCode = false
  let type = null
  let typeName = null
  // dataKey = type_typeName
  // Avoid the problem of type naming the same being overwritten
  let dataKey
  let tempStr
  fs.readFileSync(filePath, 'utf8')
    .toString()
    .split(new RegExp(EOL))
    .forEach((line) => {
      const originalLine = line
      line = line.trim()
      // Start with method|type|document annotations
      if (typesRegExp.test(line)) {
        isTargetComment = true

        type = RegExp.$1

        // setContents(box, newContents)
        // InterfaceName<Type1, Type2>
        // classInstance.someMethod(param)
        const fullName = RegExp.$2.trim()

        // setContents
        // InterfaceName
        // classInstance.someMethod
        typeName = getTypeName(fullName)

        // Avoid duplicate names being overwritten
        dataKey = `${type}_${typeName}`

        // data
        data[dataKey] = {
          type,
          name: typeName,
          fullName,
          desc: [],
          params: [],
          returns: [],
          codes: [],
          private: false,
          path: filePath,
        }
        return
      } else if (line === '*/' && isTargetComment) {
        isTargetComment = false
        // typeName = null;
        return
      }
      if (line === '/**') {
        typeName = null
      }
      if (!isTargetComment || !typeName) {
        // type codes
        if (typeName && codeTypes.includes(type) && line) {
          data[dataKey].codes.push(
            originalLine.replace(/^export(\s+default)?\s*/, '')
          )
        }
        return
      }

      // custom handler
      if (typeof options.expendTypesHandlers?.[type] === 'function') {
        options.expendTypesHandlers[type](data[dataKey], line)
      } else {
        // default handler
        if (/^\*\s*(```\w+|@code)/.test(line)) {
          isCode = true
        }

        if (/^\*(.*)/.test(line)) {
          tempStr = RegExp.$1

          const temp = tempStr.trim()
          if (temp.startsWith('@param')) {
            data[dataKey].params.push(handleParam(temp))
          } else if (temp.startsWith('@return')) {
            data[dataKey].returns.push(handleReturn(temp))
          } else if (temp.startsWith('@private')) {
            data[dataKey].private = true
          } else if (isCode) {
            if (temp.startsWith('@code')) {
              // push a blank line.
              data[dataKey].codes.push('')
              tempStr = tempStr.replace(/@code\w*/, '').trim()
            }
            // push `tempStr` to `codes`
            data[dataKey].codes.push(
              tempStr
                // Remove first null character of `tempStr`
                .replace(/^\s/, '')
                // Restore escaped strings in comments
                .replace('*\\/', '*/')
            )
          } else {
            data[dataKey].desc.push(temp.replace('@description', '').trim())
          }
        }

        if (isCode && /^\*\s*```$/.test(line)) {
          isCode = false
        }
      }
    })
  return data
}

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
  const typesAlias = options.alias?.types || {}
  const linesAfterTitles = formatAsArray(
    options.lines?.afterTitle?.[DOC_TYPES.method]
  )

  lines.push(`## ${typesAlias[DOC_TYPES.method] || 'Methods'}`, BLANK_LINE)

  // insert lines after method title
  if (isValidArray(linesAfterTitles)) {
    lines.push(...linesAfterTitles, BLANK_LINE)
  }

  arr.forEach((item) => {
    createMethodsDoc(item, lines, options)
  })
}

// ## Types
function handleTypesLines(arr, options, lines) {
  if (!isValidArray(arr)) return
  const typesAlias = options.alias?.types || {}
  const linesAfterTitles = formatAsArray(
    options.lines?.afterTitle?.[DOC_TYPES.type]
  )

  lines.push(`## ${typesAlias[DOC_TYPES.type] || 'Types'}`, BLANK_LINE)

  // insert lines after type title
  if (isValidArray(linesAfterTitles)) {
    lines.push(...linesAfterTitles, BLANK_LINE)
  }

  arr.forEach((item) => {
    createTypesDoc(item, lines, options)
  })
}

function handleConstLines(arr, options, lines) {
  if (!isValidArray(arr)) return
  lines.push('## Constant', BLANK_LINE)

  const linesAfterType = options.lines?.afterType?.[DOC_TYPES.constant]

  if (isValidArray(linesAfterType)) {
    lines.push(...linesAfterType, BLANK_LINE)
  }

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
    if (outputFileName)
      fs.writeFileSync(outputFileName, outputLines.join(EOL), 'utf8')
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
  if (isObject(outputDirOrFile) && !options) {
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

  options = {
    ...options,
    lines: {
      ...optionsLines,
    },
  }

  if (
    outputDirOrFile &&
    !fs.existsSync(outputDirOrFile) &&
    !isFileLike(outputDirOrFile)
  ) {
    mkdirSync(outputDirOrFile)
  }
  if (Array.isArray(input)) {
    return handleOutput(input, outputDirOrFile, options)
  } else {
    return Object.keys(input).map((key) => {
      return handleOutput(
        toArray(input[key], options),
        outputDirOrFile,
        options
      )
    })
  }
}

/**
 * @method getCommentsData(input, needArray, options)
 * Get comments from the `input` file or directory. Supported keywords are `type`, `document`, `method`, `code` and more.
 *
 * @code #### for example
 *
 * A source file `./src/index.js`, or a directory `./src`.
 *
 * ```js
 * /**
 *  * @method someMethod(param)
 *  * someMethod description 1 ...
 *  * someMethod description 2 ...
 *  * @param param `any` param's description
 *  * @returns `object` return's description
 *  *\/
 * function someMethod(param) {
 *   // do something ...
 *   return {...};
 * }
 *```
 * @code Get comments info form `./src` or `./src/index.js`
 *
 * nodejs file `./scripts/create-docs.js`.
 *
 *```js
 * const path = require('path')
 * const { getCommentsData } = require('zx-sml/nodejs')
 *
 * getCommentsData(path.resolve(__dirname, './src'));
 * // {
 * //   '/usr/.../src/index.js': {
 * //     method_someMethod: {
 * //       type: 'method',
 * //       name: 'someMethod',
 * //       fullName: 'someMethod(param)',
 * //       desc: [
 * //         'someMethod description 1 ...',
 * //         'someMethod description 2 ...',
 * //       ],
 * //       params: [
 * //         {
 * //           name: 'param',
 * //           required: true,
 * //           desc: ['param\'s description'],
 * //           types: ['any'],
 * //           raw: 'param `any` param\'s description',
 * //         },
 * //       ],
 * //       returns: [
 * //         {
 * //           types: ['object'],
 * //           desc: ['return\'s description'],
 * //           raw: '`object` return\'s description',
 * //         },
 * //       ],
 * //       codes: [],
 * //       private: false,
 * //       path: '/usr/.../src/index.js',
 * //     },
 * //     method_someMethod2: { ... },
 * //     document_someDocument: { ... },
 * //     type_someTypeName: { ... },
 * //   }
 * // }
 * ```
 *
 * @param input `string | string[]` The target file or directory.
 * @param needArray? `boolean` It's true will be returned an array. default `false`.
 * @param options? `GetCommentsDataOptions` [GetCommentsDataOptions](#GetCommentsDataOptions), default `{}`
 * @returns `Record<filePath, Record<commentTypeName, CommentInfoItem>> | CommentInfoItem[]` It's an array if `needArray` is true. What's [CommentInfoItem](#commentinfoitem).
 */
function getCommentsData(input, needArray, options = {}) {
  const data = {}
  if (isObject(needArray)) {
    options = needArray
    needArray = false
  }

  _getCommentsData(input, data, options)

  handleTypes(data, options)
  return needArray ? mergeIntoArray(data, options) : data
}

/**
 * _getCommentsData
 * @param input
 * @param data
 * @param options
 */
function _getCommentsData(input, data, options) {
  const { fileType = /\.(ts|js)$/ } = options

  if (Array.isArray(input)) {
    input.forEach((str) => {
      _getCommentsData(str, data, options)
    })
  } else {
    const stat = fs.statSync(input)
    if (stat.isDirectory()) {
      fs.readdirSync(input).forEach((file) => {
        _getCommentsData(path.join(input, file), data, options)
      })
    } else if (stat.isFile() && fileType.test(input)) {
      data[input] = {}
      handleFile(input, data[input], options)
    }
  }
}

/**
 * @method getTypes(data)
 * Get types from getCommentsData's returned data.
 * @param data `Record<filePath, Record<commentTypeName, CommentInfoItem>> | CommentInfoItem[]`
 * @returns `CommentInfoItem[]` Returned is only `type` [CommentInfoItem](#CommentInfoItem).
 */
function getTypes(data) {
  // CommentInfoItem[]
  if (Array.isArray(data)) {
    return data.filter((item) => item.type === DOC_TYPES.type)
  }

  // Record<filePath, Record<commentTypeName, CommentInfoItem>>
  const types = []
  // get types from `data`
  let item
  Object.keys(data).forEach((filePath) => {
    Object.keys(data[filePath]).forEach((typeName) => {
      item = data[filePath][typeName]

      if (item.type === DOC_TYPES.type) {
        types.push(item)
      }
    })
  })
  return types
}

/**
 * handleTypes
 * @param data ``Record<filePath, Record<commentTypeName, CommentInfoItem>> | CommentInfoItem[]``
 * @param options `GetCommentsDataOptions`
 */
function handleTypes(data, options) {
  const types = getTypes(data)

  // `options.types` obtained from other files or directories
  if (isValidArray(options.types)) {
    types.push(...options.types)
  }

  types.forEach((item) => {
    item.props = handleProps(item, types)
  })
}

module.exports = {
  getCommentsData,
  outputFile,
  getTypes,
}
