# zx-sml/docgen

Some tool functions used in the Nodejs environment.
see [DEMO](https://github.com/capricorncd/zx-sml/blob/main/scripts/create-docs.js)

```js
const { mkdirSync } = require('zx-sml/docgen')

mkdirSync('./a/b/c')
```

## Methods

### error(...args)

Output 😡 red color log in console

Param|Types|Required|Description
:--|:--|:--|:--
args|`Array<string>`|yes|-

- @returns `void`

### getCommentsData(input, needArray, options)

Get comments from the `input` file or directory. Supported keywords are `type`, `document`, `method`, `code` and more.

Param|Types|Required|Description
:--|:--|:--|:--
input|`string`/`string[]`|yes|The target file or directory.
needArray|`boolean`|no|It's true will be returned an array. default `false`.
options|`GetCommentsDataOptions`|no|[GetCommentsDataOptions](#GetCommentsDataOptions), default `{}`

- @returns `Record<filePath, Record<commentTypeName, CommentInfoItem>> | CommentInfoItem[]` It's an array if `needArray` is true. What's [CommentInfoItem](#commentinfoitem).

#### For example

A source file `./src/index.js`, or a directory `./src`.

```js
/**
 * @method someMethod(param)
 * someMethod description 1 ...
 * someMethod description 2 ...
 * @param param `any` param's description
 * @returns `object` return's description
 * @sort 192
 */
function someMethod(param) {
  // do something ...
  return {...};
}
```

Get comments info form `./src` or `./src/index.js`

nodejs file `./scripts/create-docs.js`.

```js
const path = require('path')
const { getCommentsData } = require('zx-sml/nodejs')

const result = getCommentsData(path.resolve(__dirname, './src'));
console.log(result);
```

result

```js
{
  '/usr/.../src/index.js': {
    method_someMethod: {
      type: 'method',
      sort: 192,
      name: 'someMethod',
      fullName: 'someMethod(param)',
      desc: [
        'someMethod description 1 ...',
        'someMethod description 2 ...',
      ],
      params: [
        {
          name: 'param',
          required: true,
          desc: ['param\'s description'],
          types: ['any'],
          raw: 'param `any` param\'s description',
        },
      ],
      returns: [
        {
          types: ['object'],
          desc: ['return\'s description'],
          raw: '`object` return\'s description',
        },
      ],
      codes: [],
      private: false,
      path: '/usr/.../src/index.js',
    },
    method_someMethod2: { ... },
    document_someDocument: { ... },
    type_someTypeName: { ... },
    ...
  }
}
```

Parameter `needArray` is `true`, or `const { data } = outputFile(path.resolve(__dirname, './src'))`, result/data:

```js
[
  {
    type: 'method',
    sort: 192,
    name: 'someMethod',
    fullName: 'someMethod(param)',
    desc: [
      'someMethod description 1 ...',
      'someMethod description 2 ...',
    ],
    params: [
      {
        name: 'param',
        required: true,
        desc: ['param\'s description'],
        types: ['any'],
        raw: 'param `any` param\'s description',
      },
    ],
    returns: [
      {
        types: ['object'],
        desc: ['return\'s description'],
        raw: '`object` return\'s description',
      },
    ],
    codes: [],
    private: false,
    path: '/usr/.../src/index.js',
  },
  ...
]
```

### getTypes(data)

Get types from getCommentsData's returned data.

Param|Types|Required|Description
:--|:--|:--|:--
data|`Record<filePath, Record<commentTypeName, CommentInfoItem>>`/`CommentInfoItem[]`|yes|The data obtained using the [getCommentsData](#getcommentsdatainput-needarray-options) method

- @returns `CommentInfoItem[]` Returned is only `type` [CommentInfoItem](#CommentInfoItem).

### isFileLike(filePath)

is file like, `*.ext`.

Param|Types|Required|Description
:--|:--|:--|:--
filePath|`string`|yes|-

- @returns `boolean`

### isValidArray<T>(arr)

Determine whether `arr` is an array and it has some elements.

Param|Types|Required|Description
:--|:--|:--|:--
arr|`T[]`|yes|-

- @returns `boolean`

### log(...args)

Output 😎 green color log in console

Param|Types|Required|Description
:--|:--|:--|:--
args|`Array<string>`|yes|-

- @returns `void`

### mkdirSync(dir)

make a directory synchronously

Param|Types|Required|Description
:--|:--|:--|:--
dir|`string`|yes|directory path

- @returns `void`

### outputFile(input, outputDirOrFile, options)

Output the obtained annotation content as a document.

Param|Types|Required|Description
:--|:--|:--|:--
input|`{[filePath]: {[key]: CommentInfoItem}}`/`CommentInfoItem[]`/`string`|yes|Comment obtained from the source. When `string` it's a file path, and the [getCommentsData](#getcommentsdatainput-needarray-options) will be called. What's [CommentInfoItem](#commentinfoitem).
outputDirOrFile|`string`|no|Optional parameter. The file or directory where the output will be written. When `outputDirOrFile` is `undefined`, no file will be output.
options|`OutputFileOptions`|no|[OutputFileOptions](#OutputFileOptions)

- @returns `OutputFileReturns | OutputFileReturns[]` What's [OutputFileReturns](#outputfilereturns)

### toTableLines(data)

Convert `data` to a table in Markdown format.

Param|Types|Required|Description
:--|:--|:--|:--
data|`ToTableLinesParamData`|yes|see type [ToTableLinesParamData](#ToTableLinesParamData).

- @returns `string[]`

### warn(...args)

Output 😕 yellow color log in console

Param|Types|Required|Description
:--|:--|:--|:--
args|`Array<string>`|yes|-

- @returns `void`

### writeFileSync(outputFileName, outputLines)

Synchronized file write function.

Param|Types|Required|Description
:--|:--|:--|:--
outputFileName|`string`|yes|Output filename, absolute path.
outputLines|`string[]`/`NodeJS.ArrayBufferView`/`string`|yes|The output file content, an array of strings.

- @returns `void`

## Constants

### BLANK_LINE

blank line.

```ts
const BLANK_LINE = ''
```

### DOC_TYPES

Supported annotation types.

```ts
const DOC_TYPES = {
  method: 'method',
  type: 'type',
  document: 'document',
  constant: 'constant',
}
```

## License

MIT License © 2022-Present [Capricorncd](https://github.com/capricorncd).
