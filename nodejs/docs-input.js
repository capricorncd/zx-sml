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
const { DOC_TYPES } = require('./const')
const {
  isValidArray,
  handleProps,
  getTypeName,
  handleReturn,
  handleParam,
  mergeIntoArray,
} = require('./helpers')

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
 * @method getCommentsData(input, needArray, options)
 * Get comments from the `input` file or directory. Supported keywords are `type`, `document`, `method`, `code` and more.
 *
 * @code #### For example
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
 * @param data `Record<filePath, Record<commentTypeName, CommentInfoItem>> | CommentInfoItem[]` The data obtained using the [getCommentsData](#getcommentsdatainput-needarray-options) method
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
  getTypes,
}
