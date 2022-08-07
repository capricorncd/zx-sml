/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const { EOL } = require('os')
const path = require('path')
const { mkdirSync, isFileLike } = require('./helpers')
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
        const fullName = RegExp.$2
        isTargetComment = true
        type = RegExp.$1
        typeName = fullName.replace(/^([\w.]+).*/, '$1')
        dataKey = `${type}_${typeName}`
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

      if (/^\*\s*```\w+/.test(line)) {
        isCode = true
      }

      if (/^\*(.*)/.test(line)) {
        tempStr = RegExp.$1
        const temp = tempStr.trim()
        if (temp.startsWith('@param')) {
          data[dataKey].params.push(temp.replace('@param', '').trim())
        } else if (temp.startsWith('@return')) {
          data[dataKey].returns.push(temp.replace(/@returns?/, '').trim())
        } else if (temp.startsWith('@private')) {
          data[dataKey].private = true
        } else if (isCode) {
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
 * create method docs
 * @param item `CommentInfoItem`
 * @param lines `string[]`
 */
function createMethodsDoc(item, lines) {
  if (!item.returns.length) item.returns.push('`void`')
  lines.push(
    BLANK_LINE,
    `### ${item.fullName}`,
    BLANK_LINE,
    ...item.desc,
    BLANK_LINE,
    // '*' will be replaced by 'npx pretty-quick --staged' with '-'
    // item.params.map((param) => `* @param ${param}`),
    ...item.params.map((param) => `- @param ${param}`),
    BLANK_LINE,
    ...item.returns.map((ret) => `- @returns ${ret}`),
    ...item.codes
  )
}

/**
 * create types docs
 * @param item `CommentInfoItem`
 * @param lines `string[]`
 */
function createTypesDoc(item, lines) {
  lines.push(
    BLANK_LINE,
    `### ${item.fullName}`,
    BLANK_LINE,
    ...item.desc,
    BLANK_LINE,
    '```ts',
    ...item.codes,
    '```',
    BLANK_LINE
  )
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
 * @returns `{ outputFileName: string | null, lines: string[], data: CommentInfoItem[] }`
 */
function handleOutput(arr, outputDir) {
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
  documents.forEach((item) => {
    lines.push(
      `# ${item.fullName}`,
      BLANK_LINE,
      ...item.desc,
      BLANK_LINE,
      ...item.codes
    )
  })

  if (methods.length) {
    lines.push(BLANK_LINE, '## Methods')
    methods.forEach((item) => {
      createMethodsDoc(item, lines)
    })
  }

  // ## types
  if (types.length) {
    lines.push(BLANK_LINE, '## Types', BLANK_LINE)
    types.forEach((item) => {
      createTypesDoc(item, lines)
    })
  }

  if (outputDir) {
    // ## License
    lines.push(
      BLANK_LINE,
      '## License',
      BLANK_LINE,
      'MIT License © 2018-Present [Capricorncd](https://github.com/capricorncd).'
    )

    // file check
    if (isFileLike(outputDir)) {
      outputFileName = outputDir
    } else if (outputFileName) {
      outputFileName = path.join(outputDir, outputFileName)
    }

    // output file
    if (outputFileName)
      fs.writeFileSync(
        outputFileName,
        removeConsecutiveBlankLine(lines).join(EOL),
        'utf8'
      )
  }

  log(outputFileName)
  console.log('Output file is ended.')
  return {
    outputFileName,
    lines: removeConsecutiveBlankLine(lines),
    data: arr,
  }
}

/**
 * @method outputFile(input, outputDirOrFile?)
 * Output the obtained annotation content as a document.
 * @param data `CommentInfoItem | CommentInfoItem[] | string` Comment obtained from the source. When `string` it's a file path, and the [getCommentsData](#getcommentsdatainput-needarray-data) will be called.
 * @param outputDirOrFile `string` Optional parameter. The file or directory where the output will be written. When `outputDirOrFile` is `undefined`, no file will be output.
 * @returns `OutputFileReturns | OutputFileReturns[]`
 */
function outputFile(input, outputDirOrFile) {
  if (typeof input === 'string') {
    input = getCommentsData(input, true)
  }
  if (
    outputDirOrFile &&
    !fs.existsSync(outputDirOrFile) &&
    !isFileLike(outputDirOrFile)
  ) {
    mkdirSync(outputDirOrFile)
  }
  if (Array.isArray(input)) {
    return handleOutput(input, outputDirOrFile)
  } else {
    return Object.keys(input).map((key) => {
      return handleOutput(toArray(input[key]), outputDirOrFile)
    })
  }
}

/**
 * @method getCommentsData(input, needArray?, data?)
 * Get comments from the `input` file or directory. Supported keywords are `type`, `document`, `method` and `class`.
 *
 * ```js
 * // for example
 * // ./src/index.js
 *
 * /**
 *  * @method someMethod(param)
 *  * someMethod description 1 ...
 *  * someMethod description 2 ...
 *  * @param param `any` param description
 *  * @returns `object` return description
 *  *\/
 * function someMethod(param) {
 *   // do something ...
 *   return {...};
 * }
 *
 * // get comment form `./src` or `./src/index.js`
 * // ./create-docs.js
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
 * //       params: ['param `any` param description'],
 * //       returns: ['`object` return description'],
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
 * @param input `string` The target file or directory.
 * @param needArray `boolean` It's true will be returned an array. default `false`.
 * @param data `object` default `{}`
 * @returns `Record<filePath, Record<commentTypeName, CommentInfoItem>> | CommentInfoItem[]` It's an array if `needArray` is true.
 */
function getCommentsData(input, needArray = false, data = {}) {
  const stat = fs.statSync(input)
  if (stat.isDirectory()) {
    fs.readdirSync(input).forEach((file) => {
      getCommentsData(path.join(input, file), needArray, data)
    })
  } else if (stat.isFile() && /\.(ts|js)$/.test(input)) {
    data[input] = {}
    handleFile(input, data[input])
  }
  return needArray ? mergeIntoArray(data) : data
}

function mergeIntoArray(data) {
  const mergeData = Object.keys(data).reduce((prev, filePath) => {
    Object.keys(data[filePath]).forEach((key) => {
      prev[key] = data[filePath][key]
    })
    return prev
  }, {})
  return toArray(mergeData)
}

function toArray(data) {
  const arr = []
  // sort and push into arr
  Object.keys(data)
    .sort()
    .forEach((key) => arr.push(data[key]))
  return arr
}

module.exports = {
  getCommentsData,
  outputFile,
}
