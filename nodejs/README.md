# zx-sml/nodejs

Some tool functions used in the Nodejs environment.

```js
const { mkdirSync } = require('zx-sml/nodejs')

mkdirSync('./a/b/c')
```

## Methods

### error(...args)

Output 😡 red color log in console

Param|Types|Required|Description
:--|:--:|:--:|:--
args|`Array<string>`|yes|-

- @returns `void`

### getCommentsData(input, needArray, data)

Get comments from the `input` file or directory. Supported keywords are `type`, `document`, `method` and `class`.
Format is not supported for `Array<string | number>` or `(string | number)[]`,
please use `Array<string> | Array<number>` or `string[] | number[]`

Param|Types|Required|Description
:--|:--:|:--:|:--
input|`string`|yes|The target file or directory.
needArray|`boolean`|no|It's true will be returned an array. default `false`.
data|`object`|no|default `{}`

- @returns `Record<filePath, Record<commentTypeName, CommentInfoItem>> | CommentInfoItem[]` It's an array if `needArray` is true. What's [CommentInfoItem](#commentinfoitem).

#### for example

A source file `./src/index.js`, or a directory `./src`.

```js
/**
 * @method someMethod(param)
 * someMethod description 1 ...
 * someMethod description 2 ...
 * @param param `any` param's description
 * @returns `object` return's description
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

getCommentsData(path.resolve(__dirname, './src'));
// {
//   '/usr/.../src/index.js': {
//     method_someMethod: {
//       type: 'method',
//       name: 'someMethod',
//       fullName: 'someMethod(param)',
//       desc: [
//         'someMethod description 1 ...',
//         'someMethod description 2 ...',
//       ],
//       params: [
//         {
//           name: 'param',
//           required: true,
//           desc: ['param\'s description'],
//           types: ['any'],
//           raw: 'param `any` param\'s description',
//         },
//       ],
//       returns: [
//         {
//           types: ['object'],
//           desc: ['return\'s description'],
//           raw: '`object` return\'s description',
//         },
//       ],
//       codes: [],
//       private: false,
//       path: '/usr/.../src/index.js',
//     },
//     method_someMethod2: { ... },
//     document_someDocument: { ... },
//     type_someTypeName: { ... },
//   }
// }
```

### log(...args)

Output 😎 green color log in console

Param|Types|Required|Description
:--|:--:|:--:|:--
args|`Array<string>`|yes|-

- @returns `void`

### mkdirSync(dir)

make a directory synchronously

Param|Types|Required|Description
:--|:--:|:--:|:--
dir|`string`|yes|directory path

- @returns `void`

### outputFile(input, outputDirOrFile, options)

Output the obtained annotation content as a document.

Param|Types|Required|Description
:--|:--:|:--:|:--
input|`CommentInfoItem`/`CommentInfoItem[]`/`string`|yes|-
outputDirOrFile|`string`|no|Optional parameter. The file or directory where the output will be written. When `outputDirOrFile` is `undefined`, no file will be output.
options|`OutputFileOptions`|no|[OutputFileOptions](#OutputFileOptions)

- @returns `OutputFileReturns | OutputFileReturns[]` What's [OutputFileReturns](#outputfilereturns)

### warn(...args)

Output 😕 yellow color log in console

Param|Types|Required|Description
:--|:--:|:--:|:--
args|`Array<string>`|yes|-

- @returns `void`

## Types

### CommentInfoItem

CommentInfoItem is the comment information read with the [getCommentsData](#getcommentsdatainput-needarray-data) function.

Prop|Types|Required|Description
:--|:--:|:--:|:--
type|`string`|yes|method/type/class/document
name|`string`|yes|@method name(...args)'s `name`
fullName|`string`|yes|@method name(...args)'s `name(...args)`
desc|`string[]`|yes|description
params|`CommentInfoItemParam[]`|yes|method's params
returns|`CommentInfoItemReturn[]`|yes|method's returns
codes|`string[]`|yes|for example codes
private|`boolean`|yes|Whether the member method of the class is private
path|`string`|yes|file path
props|``|no|-

<details><summary>Source Code</summary>
```ts
interface CommentInfoItem {
  // method/type/class/document
  type: string
  // @method name(...args)'s `name`
  name: string
  // @method name(...args)'s `name(...args)`
  fullName: string
  // description
  desc: string[]
  // method's params
  params: CommentInfoItemParam[]
  // method's returns
  returns: CommentInfoItemReturn[]
  // for example codes
  codes: string[]
  // Whether the member method of the class is private
  private: boolean
  // file path
  path: string
  props?: CommentInfoItemProp[]
}
```
</details>

### CommentInfoItemParam

[CommentInfoItem](#CommentInfoItem)'s `params`.

Prop|Types|Required|Description
:--|:--:|:--:|:--
name|`string`|yes|-
required|`boolean`|yes|-
desc|`string[]`|yes|-
types|`string[]`|yes|-

<details><summary>Source Code</summary>
```ts
interface CommentInfoItemParam {
  name: string
  required: boolean
  desc: string[]
  types: string[]
}
```
</details>

### CommentInfoItemProp

The properties of [CommentInfoItem](#CommentInfoItem), only exists when the type is `type` or `interface`.

Prop|Types|Required|Description
:--|:--:|:--:|:--
raw|`string`|yes|-

<details><summary>Source Code</summary>
```ts
interface CommentInfoItemProp extends CommentInfoItemParam {
  raw: string
}
```
</details>

### CommentInfoItemReturn

[CommentInfoItem](#CommentInfoItem)'s `return`.

Prop|Types|Required|Description
:--|:--:|:--:|:--
desc|`string[]`|yes|-
types|`string[]`|yes|-
raw|`string`|yes|-

<details><summary>Source Code</summary>
```ts
interface CommentInfoItemReturn {
  desc: string[]
  types: string[]
  raw: string
}
```
</details>

### OutputFileOptions

Prop|Types|Required|Description
:--|:--:|:--:|:--
methodWithRaw|``|no|Display `methods` using raw string, not table. default `false`
startLines|``|no|Lines that need to be added at the start.
endLines|``|no|Lines that need to be added at the end, such as adding some license information. `['## License', 'BLANK_LINE', 'MIT License © 2018-Present [Capricorncd](https://github.com/capricorncd).']`
afterDocumentLines|``|no|This `afterDocumentLines` will be appended to the `@document`, before the `## Methods`

<details><summary>Source Code</summary>
```ts
interface OutputFileOptions {
  // Display `methods` using raw string, not table. default `false`
  methodWithRaw?: boolean
  // Lines that need to be added at the start.
  startLines?: string[]
  // Lines that need to be added at the end, such as adding some license information. `['## License', 'BLANK_LINE', 'MIT License © 2018-Present [Capricorncd](https://github.com/capricorncd).']`
  endLines?: string[]
  // This `afterDocumentLines` will be appended to the `@document`, before the `## Methods`
  afterDocumentLines?: string[]
}
```
</details>

### OutputFileReturns

`OutputFileReturns` returned by the [outputFile](#outputfileinput-outputdirorfile) function.

Prop|Types|Required|Description
:--|:--:|:--:|:--
outputFileName|`string`/`null`|yes|outputted filename
lines|`string[]`|yes|line array in the output file
data|`CommentInfoItem[]`|yes|comments data read from code

<details><summary>Source Code</summary>
```ts
interface OutputFileReturns {
  // outputted filename
  outputFileName: string | null
  // line array in the output file
  lines: string[]
  // comments data read from code
  data: CommentInfoItem[]
}
```
</details>

## License

MIT License © 2022-Present [Capricorncd](https://github.com/capricorncd).