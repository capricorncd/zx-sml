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
  toStrForStrArray,
  findCharIndex,
  formatAsArray,
  formatAsTypes,
  replaceVerticalBarsInTables,
} = require('./helpers')
const { log } = require('./log')

// blank line
const BLANK_LINE = ''

// method|type|class|document
const TYPES = {
  METHOD: 'method',
  TYPE: 'type',
  CLASS: 'class',
  DOCUMENT: 'document',
}

/**
 * When the parameter description cannot be obtained using regular expressions
 * @param {*} input
 * @returns
 */
function getSpDescription(input) {
  const index = findCharIndex(input, '`', 2)
  return index === -1 ? '' : input.substr(index + 1)
}

/**
 * handleParam
 * @param input `string`
 * @returns `CommentInfoItemParam`
 */
function handleParam(input) {
  input = input.replace('@param', '').trim()
  const data = {
    raw: input,
  }
  // paramName? `type` param description
  // paramName `type1 | type2` param description
  if (/(\w+\??)\s+`([^`]+)`(.*)/.test(input)) {
    const name = RegExp.$1
    data.name = name.replace('?', '')

    data.required = !name.includes('?')
    // no support for `Array<string | number>` or `(string | number)[]`
    data.types = formatAsTypes(RegExp.$2)
    // desc
    const desc = RegExp.$3 || getSpDescription(input)
    data.desc = [desc.trim()]
  }
  return data
}

/**
 * handleReturn
 * @param input `string`
 * @returns `CommentInfoItemReturn`
 */
function handleReturn(input) {
  input = input.replace(/@returns?/, '').trim()
  const data = {
    raw: input,
  }
  // `type` Return's description
  // `type1 | type2` Return's description
  if (/`([^`]+)`\s*(.*)/.test(input)) {
    // no support for `Array<string | number>` or `(string | number)[]`
    // please use `Array<string> | Array<number>` or `string[] | number[]`
    data.types = formatAsTypes(RegExp.$1)

    data.desc = [RegExp.$2]
  }
  return data
}

/**
 * Get type name:
 * setContents(box, newContents)  -> setContents
 * InterfaceName<Type1, Type2>    -> InterfaceName
 * classInstance.someMethod(param)-> classInstance.someMethod
 * @param fullName `string`
 * @returns
 */
function getTypeName(fullName) {
  // only words and '.'
  return fullName.replace(/^([\w.]+).*/, '$1')
}

/**
 * handle file
 * get `method|type|class|document` annotations in file.
 * @param filePath `string` absolute file path.
 * @param data `object`
 * @returns `Record<string, CommentInfoItem>`
 */
function handleFile(filePath, data) {
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
      // Start with method|type|class|document annotations
      if (/^\*\s*@(method|type|class|document)\s*(.+)/.test(line)) {
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
        if (typeName && type === TYPES.TYPE && line) {
          data[dataKey].codes.push(
            originalLine.replace(/^export( default)?\s*/, '')
          )
        }
        return
      }

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
    })
  return data
}

/**
 * createPropsTable
 * @param props `CommentInfoItemParam[] | CommentInfoItemProp[]`
 * @param typeName
 * @returns `string[]`
 */
function createPropsTable(props, typeName = 'Name') {
  if (!isValidArray(props)) return []
  const arr = [`${typeName}|Types|Required|Description`, ':--|:--|:--|:--']
  props.forEach((item) => {
    const tdItems = [
      item.name,
      '`' + replaceVerticalBarsInTables(item.types.join('`/`')) + '`',
      item.required ? 'yes' : 'no',
      replaceVerticalBarsInTables(toStrForStrArray(item.desc)),
    ]
    arr.push(tdItems.join('|'))
  })
  arr.push(BLANK_LINE)
  return arr
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
      : createPropsTable(item.params, 'Param')),
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
  const typeTable = createPropsTable(item.props, 'Prop')
  const codes = ['```ts', ...item.codes, '```', BLANK_LINE]
  const details = [
    '<details>',
    `<summary>${options.sourceCodeSummary || 'Source Code'}</summary>`,
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

/**
 * handle output
 * @param arr `CommentInfoItem[]`
 * @param outputDir `string` optional parameter.
 * @param options `OutputFileOptions`
 * @returns `{ outputFileName: string | null, lines: string[], data: CommentInfoItem[] }`
 */
function handleOutput(arr, outputDir, options = {}) {
  console.log('Output file is start ...')
  // method|type|class|document
  const documents = []
  const types = []
  const methods = []

  let outputFileName = null

  arr.forEach((item) => {
    if (item.type === TYPES.DOCUMENT) {
      outputFileName = item.name + '.md'
      documents.push(item)
    } else if (item.type === TYPES.TYPE) {
      types.push(item)
    } else if (item.type === TYPES.METHOD && !item.private) {
      methods.push(item)
    }
  })

  const lines = []

  // start lines
  if (isValidArray(options.startLines)) {
    lines.push(...options.startLines, BLANK_LINE)
  }

  // linesAfterType
  const linesAfterType = options.linesAfterType || {}
  // linesAfterTitle
  const linesAfterTitle = options.linesAfterTitle || {}

  documents.forEach((item) => {
    lines.push(
      `# ${item.fullName}`,
      BLANK_LINE,
      ...item.desc,
      BLANK_LINE,
      ...item.codes,
      BLANK_LINE
    )
  })

  // lines after document
  if (linesAfterType[TYPES.DOCUMENT]) {
    lines.push(...formatAsArray(linesAfterType[TYPES.DOCUMENT]), BLANK_LINE)
  }

  if (methods.length) {
    lines.push('## Methods', BLANK_LINE)

    // insert lines after method title
    if (linesAfterTitle[TYPES.METHOD]) {
      lines.push(...formatAsArray(linesAfterTitle[TYPES.METHOD]), BLANK_LINE)
    }

    methods.forEach((item) => {
      createMethodsDoc(item, lines, options)
    })
  }

  // lines after method
  if (linesAfterType[TYPES.METHOD]) {
    lines.push(...formatAsArray(linesAfterType[TYPES.METHOD]), BLANK_LINE)
  }

  // ## types
  if (types.length) {
    lines.push('## Types', BLANK_LINE)

    // insert lines after type title
    if (linesAfterTitle[TYPES.TYPE]) {
      lines.push(...formatAsArray(linesAfterTitle[TYPES.TYPE]), BLANK_LINE)
    }

    types.forEach((item) => {
      createTypesDoc(item, lines, options)
    })
  }

  // lines after types
  if (linesAfterType[TYPES.TYPE]) {
    lines.push(...formatAsArray(linesAfterType[TYPES.TYPE]), BLANK_LINE)
  }

  // end lines
  if (isValidArray(options.endLines)) {
    lines.push(...options.endLines, BLANK_LINE)
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
function outputFile(input, outputDirOrFile, options) {
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
 * Get comments from the `input` file or directory. Supported keywords are `type`, `document`, `method` and `class`.
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
      handleFile(input, data[input])
    }
  }
}

function mergeIntoArray(data, options) {
  const mergeData = Object.keys(data).reduce((prev, filePath) => {
    Object.keys(data[filePath]).forEach((key) => {
      prev[key] = data[filePath][key]
    })
    return prev
  }, {})
  return toArray(mergeData, options)
}

function toArray(data, options = {}) {
  const arr = []
  const keys = Object.keys(data)
  if (!options.disableKeySorting) {
    keys.sort()
  }

  keys.forEach((key) => arr.push(data[key]))
  return arr
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
    return data.filter((item) => item.type === TYPES.TYPE)
  }

  // Record<filePath, Record<commentTypeName, CommentInfoItem>>
  const types = []
  // get types from `data`
  let item
  Object.keys(data).forEach((filePath) => {
    Object.keys(data[filePath]).forEach((typeName) => {
      item = data[filePath][typeName]

      if (item.type === TYPES.TYPE) {
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

/**
 * handleProps
 * @param item `CommentInfoItem`
 * @param types `CommentInfoItem[]`
 * @returns
 */
function handleProps(item, types) {
  // props has been processed
  if (item.props) return item.props

  const arr = []

  const firstCodeLine = item.codes[0] || ''
  // handle extends, get extends interface or class's props
  // interface ColorfulCircle<T> extends Colorful<T>, Circle {}
  if (/\sextends\s+(.+)\s*\{/.test(firstCodeLine)) {
    const extendTypes = RegExp.$1
      .split(/\s*,\s*/)
      // Colorful<T> -> Colorful
      .map((name) => getTypeName(name.trim()))
    extendTypes.forEach((extendName) => {
      // find extendName from types
      const typeItem = types.find((item) => item.name === extendName)

      if (typeItem) {
        // props of extends type object has not been processed
        if (!typeItem.props) {
          typeItem.props = handleProps(typeItem, types)
        }
        arr.push(...typeItem.props)
      }
    })
  }

  let isCodeStart = false
  let description = []

  item.codes.forEach((line) => {
    // type A = {
    //   prop: type
    // }
    if (!isCodeStart && /\{\s*$/.test(line)) {
      return (isCodeStart = true)
    }

    // desc?: string[] | OtherType // description ...
    // install: (e: Editor, parent?: HTMLElement) => void // description ...
    // [key]: any, or [key: string]: OtherType // description ...
    // interface ReadonlyStringArray {
    //   readonly [index: number]: string;
    // }
    if (
      /^\s*(?:(?:readonly|static|public)\s*)?((?:\w|\[.+\])+\??)\s*:\s*([^/]*)(?:\/\/(.*))?/.test(
        line
      )
    ) {
      // $1~$3
      const name = RegExp.$1
      const types = formatAsTypes(RegExp.$2)
      description.push(RegExp.$3.trim())

      const data = {
        name: name.replace(/\?/g, ''),
        required: !name.includes('?'),
        desc: description,
        types,
      }

      // Has extends, a property with the same name may already exist
      const index = arr.findIndex((item) => item.name === data.name)
      if (index >= 0) {
        arr.splice(index, 1)
      }
      arr.push(data)

      // reset
      description = []
    } else if (/^\s*\/\/(.+)/.test(line)) {
      if (!description) description = []
      description.push(RegExp.$1.trim())
    }
  })
  return arr
}

module.exports = {
  getCommentsData,
  outputFile,
  getTypes,
}
