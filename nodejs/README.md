# zx-sml/nodejs

Some tool functions used in the Nodejs environment.
see [DEMO](https://github.com/capricorncd/zx-sml/blob/main/scripts/create-docs.js)

```js
const { mkdirSync } = require('zx-sml/nodejs')

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

Get comments from the `input` file or directory. Supported keywords are `type`, `document`, `method` and `class`.
Format is not supported for `Array<string | number>` or `(string | number)[]`,
please use `Array<string> | Array<number>` or `string[] | number[]`

Param|Types|Required|Description
:--|:--|:--|:--
input|`string`/`string[]`|yes|The target file or directory.
needArray|`boolean`|no|It's true will be returned an array. default `false`.
options|`GetCommentsDataOptions`|no|[GetCommentsDataOptions](#GetCommentsDataOptions), default `{}`

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

### getTypes(data)

Get types from getCommentsData's returned data.

Param|Types|Required|Description
:--|:--|:--|:--
data|`Record<filePath, Record<commentTypeName, CommentInfoItem>>`/`CommentInfoItem[]`|yes|-

- @returns `CommentInfoItem[]` Returned is only `type` [CommentInfoItem](#CommentInfoItem).

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

### warn(...args)

Output 😕 yellow color log in console

Param|Types|Required|Description
:--|:--|:--|:--
args|`Array<string>`|yes|-

- @returns `void`

## Types

### CommentInfoItem

CommentInfoItem is the comment information read with the [getCommentsData](#getcommentsdatainput-needarray-options) function.

Prop|Types|Required|Description
:--|:--|:--|:--
type|`string`|yes|method/type/class/document
name|`string`|yes|@method name(...args)'s `name`
fullName|`string`|yes|@method name(...args)'s `name(...args)`
desc|`string[]`|yes|description
params|`CommentInfoItemParam[]`|yes|method's params
returns|`CommentInfoItemReturn[]`|yes|method's returns
codes|`string[]`|yes|for example codes
private|`boolean`|yes|Whether the member method of the class is private
path|`string`|yes|file path
props|`CommentInfoItemProp[]`|no|[CommentInfoItemProp](#CommentInfoItemProp)

<details>
<summary>Source Code</summary>

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
  // [CommentInfoItemProp](#CommentInfoItemProp)
  props?: CommentInfoItemProp[]
}
```

</details>

### CommentInfoItemParam

[CommentInfoItem](#CommentInfoItem)'s `params`.

Prop|Types|Required|Description
:--|:--|:--|:--
name|`string`|yes|parameter name or property name
required|`boolean`|yes|Whether the parameter is required, or the field must exist in the returned data.
desc|`string[]`|yes|parameter or property's descriptions
types|`string[]`|yes|parameter or property's types

<details>
<summary>Source Code</summary>

```ts
interface CommentInfoItemParam {
  // parameter name or property name
  name: string
  // Whether the parameter is required, or the field must exist in the returned data.
  required: boolean
  // parameter or property's descriptions
  desc: string[]
  // parameter or property's types
  types: string[]
}
```

</details>

### CommentInfoItemProp

The properties of [CommentInfoItem](#CommentInfoItem), only exists when the type is `type` or `interface`.

Prop|Types|Required|Description
:--|:--|:--|:--
name|`string`|yes|parameter name or property name
required|`boolean`|yes|Whether the parameter is required, or the field must exist in the returned data.
desc|`string[]`|yes|parameter or property's descriptions
types|`string[]`|yes|parameter or property's types
raw|`string`|yes|raw annotation string

<details>
<summary>Source Code</summary>

```ts
interface CommentInfoItemProp extends CommentInfoItemParam {
  raw: string // raw annotation string
}
```

</details>

### CommentInfoItemReturn

[CommentInfoItem](#CommentInfoItem)'s `return`.

Prop|Types|Required|Description
:--|:--|:--|:--
desc|`string[]`|yes|returned's descriptions.
types|`string[]`|yes|returned's types
raw|`string`|yes|raw annotation string

<details>
<summary>Source Code</summary>

```ts
interface CommentInfoItemReturn {
  // returned's descriptions.
  desc: string[]
  // returned's types
  types: string[]
  // raw annotation string
  raw: string
}
```

</details>

### GetCommentsDataOptions

Parameter `options` of function [getCommentsData](#getcommentsdatainput-needarray-options)

Prop|Types|Required|Description
:--|:--|:--|:--
fileType|`RegExp`|no|Regular expression for the type of file to be read, defaults to `/\.[tj]s$/`.
disableKeySorting|`boolean`|no|Disables key sorting, defaults to `false`, and sorts alphabetically.
types|`CommentInfoItem[]`|no|This `types` array is obtained from other files or directories for `extends` related processing.

<details>
<summary>Source Code</summary>

```ts
interface GetCommentsDataOptions {
  // Regular expression for the type of file to be read, defaults to `/\.[tj]s$/`.
  fileType?: RegExp
  // Disables key sorting, defaults to `false`, and sorts alphabetically.
  disableKeySorting?: boolean
  // This `types` array is obtained from other files or directories for `extends` related processing.
  types?: CommentInfoItem[]
}
```

</details>

### OutputFileInput

A parameter `input` of function [outputFile](#outputfileinput-outputdirorfile-options).

<details>
<summary>Source Code</summary>

```ts
type OutputFileInput =
  | Record<string, CommentInfoItem>
  | CommentInfoItem[]
  | string
  | string[]
```

</details>

### OutputFileOptions

Options of the function [outputFile](#outputfileinput-outputdirorfile-options), extends [GetCommentsDataOptions](#GetCommentsDataOptions)

Prop|Types|Required|Description
:--|:--|:--|:--
fileType|`RegExp`|no|Regular expression for the type of file to be read, defaults to `/\.[tj]s$/`.
disableKeySorting|`boolean`|no|Disables key sorting, defaults to `false`, and sorts alphabetically.
types|`CommentInfoItem[]`|no|This `types` array is obtained from other files or directories for `extends` related processing.
methodWithRaw|`boolean`|no|Display `methods` using raw string, not table. default `false`
typeWithTable|`boolean`|no|Display `types` using only table, not Source Code. default `false`
typeWithSourceCode|`boolean`|no|Display `types` using only Source Code, not table. default `false`
typeWithAuto|`boolean`|no|By default, `table` and `<details><summary>Source Code</summary></details>` are displayed, but sometimes `table`'s data may not exist, only `Source Code` can be displayed and `<details>` not using.
startLines|`string[]`|no|Lines that need to be added at the start.
endLines|`string[]`|no|Lines that need to be added at the end, such as adding some license information. `['## License', 'BLANK_LINE', 'MIT License © 2018-Present [Capricorncd](https://github.com/capricorncd).']`
linesAfterType|`Record<'document'`/`'method'`/`'type', string`/`string[]>`|no|This `linesAfterType` will be appended to the `[type]`, before the `## [other type]`
linesAfterTitle|`Record<'method'`/`'type', string`/`string[]>`|no|It's will be insert after `type` title line. For example, `{method: ['some type description content']}`, It's will to insert after `method` line, like this's `['## Methods', 'some type description content', '...']`
sourceCodeSummary|`string`|no|`<details><summary>Source Code</summary></details>`'s summary, default `Source Code`

<details>
<summary>Source Code</summary>

```ts
interface OutputFileOptions extends GetCommentsDataOptions {
  // Display `methods` using raw string, not table. default `false`
  methodWithRaw?: boolean
  // Display `types` using only table, not Source Code. default `false`
  typeWithTable?: boolean
  // Display `types` using only Source Code, not table. default `false`
  typeWithSourceCode?: boolean
  // By default, `table` and `<details><summary>Source Code</summary></details>` are displayed,
  // but sometimes `table`'s data may not exist, only `Source Code` can be displayed and `<details>` not using.
  typeWithAuto?: boolean
  // Lines that need to be added at the start.
  startLines?: string[]
  // Lines that need to be added at the end, such as adding some license information. `['## License', 'BLANK_LINE', 'MIT License © 2018-Present [Capricorncd](https://github.com/capricorncd).']`
  endLines?: string[]
  // This `linesAfterType` will be appended to the `[type]`, before the `## [other type]`
  linesAfterType?: Record<'document' | 'method' | 'type', string | string[]>
  // It's will be insert after `type` title line.
  // For example, `{method: ['some type description content']}`,
  // It's will to insert after `method` line, like this's `['## Methods', 'some type description content', '...']`
  linesAfterTitle?: Record<'method' | 'type', string | string[]>
  // `<details><summary>Source Code</summary></details>`'s summary, default `Source Code`
  sourceCodeSummary?: string
}
```

</details>

### OutputFileReturns

Returned data of function [outputFile](#outputfileinput-outputdirorfile-options).

Prop|Types|Required|Description
:--|:--|:--|:--
outputFileName|`string`/`null`|yes|outputted filename
lines|`string[]`|yes|line array in the output file
data|`CommentInfoItem[]`|yes|comments data read from code

<details>
<summary>Source Code</summary>

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
