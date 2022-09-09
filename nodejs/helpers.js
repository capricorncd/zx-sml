/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const { isObject } = require('../dist/zx-sml.umd')
const { BLANK_LINE } = require('./const')
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
 * @method isFileLike(filePath)
 * is file like, `*.ext`.
 * @param filePath `string`
 * @returns `boolean`
 */
function isFileLike(filePath) {
  if (typeof filePath === 'string') {
    return /.+\.\w+$/.test(filePath)
  }
  return false
}

/**
 * @method isValidArray<T>(arr)
 * Determine whether `arr` is an array and it has some elements.
 * @param arr `T[]`
 * @returns `boolean`
 */
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
 * @returns `string`
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
 * @returns `number`
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
  if (typeof input === 'undefined') return []
  return Array.isArray(input) ? input : [input]
}

/**
 * format as types
 * @param input `string` Type string data of members of `interface` etc.
 * @returns `string[]`
 *
 * @code For example `interface IF`
 *
 * ```ts
 * interface IF {
 *   fieldA: string | number;
 * }
 * ```
 *
 * ```ts
 * formatAsTypes(' string | number;') // ['string', 'number']
 * ```
 */
function formatAsTypes(input) {
  input = input.trim()

  // remove last ';' of type string
  // e.g. `Array<string>;` => `Array<string>`
  if (input.endsWith(';')) {
    input = input.substr(0, input.length - 1)
  }

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
 * @returns `string`
 */
function replaceVerticalBarsInTables(input) {
  return input.replace(/\|/g, '\\|')
}

/**
 * getSpDescription(input)
 * When the parameter description cannot be obtained using regular expressions.
 * @param input `string`
 * @returns `string`
 */
function getSpDescription(input) {
  const index = findCharIndex(input, '`', 2)
  return index === -1 ? '' : input.substr(index + 1)
}

/**
 * handleParam
 * Convert function's parameter raw string to [CommentInfoItemParam](#CommentInfoItemParam) object.
 * @param input `string` raw string.
 * @returns `CommentInfoItemParam` [CommentInfoItemParam](#CommentInfoItemParam).
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
    // Convert type string to array
    data.types = formatAsTypes(RegExp.$2)
    // desc
    const desc = RegExp.$3 || getSpDescription(input)
    data.desc = [desc.trim()]
  }
  return data
}

/**
 * handleReturn
 * Convert function's returns raw string to [CommentInfoItemReturn](#CommentInfoItemReturn) object.
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
 * `setContents(box, newContents)`  -> `setContents`.
 * `InterfaceName<Type1, Type2>`    -> `InterfaceName`.
 * `classInstance.someMethod(param)`-> `classInstance.someMethod`.
 * @param fullName `string`
 * @returns `string`
 */
function getTypeName(fullName) {
  // only words and '.'
  return fullName.replace(/^([\w.]+).*/, '$1')
}

/**
 * createPropsTable
 * @param props `CommentInfoItemParam[] | CommentInfoItemProp[]`
 * @param docType `DocTypes`
 * @param typeName
 * @param options `{alias: tableHead?: {...}}`
 * @returns `string[]`
 */
function createPropsTable(props, docType, typeName = 'Name', options = {}) {
  if (!isValidArray(props)) return []
  // alias
  const alias = options.alias || {}
  const tableHeadAlias = alias.tableHead || {}
  // requiredValues
  let requiredValues = { 0: 'no', 1: 'yes' }
  if (alias.requiredValues) {
    if (alias.requiredValues[docType]) {
      requiredValues = alias.requiredValues[docType]
    } else if (alias.requiredValues[0] && alias.requiredValues[1]) {
      requiredValues = alias.requiredValues
    }
  }
  const tableData = {
    // table head
    thead: [
      tableHeadAlias[typeName] || typeName,
      tableHeadAlias['Types'] || 'Types',
      tableHeadAlias['Required'] || 'Required',
      tableHeadAlias['Description'] || 'Description',
    ],
    // table body
    tbody: props.map((item) => {
      return [
        item.name,
        '`' + replaceVerticalBarsInTables(item.types?.join('`/`')) + '`',
        requiredValues[+item.required],
        replaceVerticalBarsInTables(toStrForStrArray(item.desc)),
      ]
    }),
  }

  const lines = toTableLines(tableData)
  // BLANK_LINE
  lines.push(BLANK_LINE)

  return lines
}

/**
 * mergeIntoArray
 * @param data `Record<filePath, Record<commentTypeName, CommentInfoItem>>`
 * @param options `GetCommentsDataOptions` [GetCommentsDataOptions](#getcommentsdataoptions)
 * @returns `CommentInfoItem[]`
 */
function mergeIntoArray(data, options) {
  const mergeData = Object.keys(data).reduce((prev, filePath) => {
    Object.keys(data[filePath]).forEach((key) => {
      prev[key] = data[filePath][key]
    })
    return prev
  }, {})
  return toArray(mergeData, options)
}

/**
 * to array
 * @param data `Record<filePath, Record<typeAndName, CommentInfoItem>>`
 * @param options `GetCommentsDataOptions`
 * @returns `CommentInfoItem[]`
 */
function toArray(data, options = {}) {
  const arr = []
  const keys = Object.keys(data)
  // sort keys
  if (!options.disableKeySorting) {
    keys.sort()
  }

  keys.forEach((key) => arr.push(data[key]))
  return arr
}

/**
 * handleProps
 * @param item `CommentInfoItem`
 * @param types `CommentInfoItem[]`
 * @returns `CommentInfoItemProp[]` [CommentInfoItemProp](#CommentInfoItemProp)
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

const DEF_TABLE_ALIGN = ':--'

/**
 * TABLE_ALIGNS
 */
const TABLE_ALIGNS = {
  left: DEF_TABLE_ALIGN,
  center: ':--:',
  right: '--:',
}

/**
 * @method toTableLines(data)
 * Convert `data` to a table in Markdown format.
 * @param data `ToTableLinesParamData` see type [ToTableLinesParamData](#ToTableLinesParamData).
 * @returns `string[]`
 */
function toTableLines(data) {
  if (!isObject(data) || !isValidArray(data.tbody)) return []
  let { align, thead, tbody } = data
  const lines = []

  let i = 0
  // thead
  if (isValidArray(thead)) {
    lines.push(thead.join('|'))
    if (align) {
      if (typeof align === 'string') {
        align = thead.reduce((prev, field) => {
          prev[field] = align
          return prev
        }, {})
      }
      lines.push(
        thead
          .map((field) => TABLE_ALIGNS[align[field]] || DEF_TABLE_ALIGN)
          .join('|')
      )
    } else {
      lines.push(thead.map(() => DEF_TABLE_ALIGN).join('|'))
    }
  } else {
    lines.push(
      tbody[0].join('|'),
      tbody[0].map(() => DEF_TABLE_ALIGN).join('|')
    )
    i = 1
  }

  for (; i < tbody.length; i++) {
    lines.push(tbody[i].join('|'))
  }

  return lines
}

module.exports = {
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
