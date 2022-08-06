# zx-sml/nodejs

Some tool functions used in the Nodejs environment

```js
const { mkdirSync } = require('zx-sml/nodejs')

mkdirSync('./a/b/c')
```

## Methods

### error(...args)

Output 😡 red color log in console

- @param args `Array<string>`

- @returns `void`

### getCommentsData(input, needArray?, data?)

or `getCommentsData(input, needArray?, data?)`
Get comments from the `input` file or directory.

- @param input `string` The target file or directory.
- @param needArray `boolean` It's true will be returned an array. default `false`.
- @param data `object` default `{}`

- @returns `Record<string, CommentInfoItem> | CommentInfoItem[]` It's an array if `needArray` is true.

### log(...args)

Output 😎 green color log in console

- @param args `Array<string>`

- @returns `void`

### mkdirSync(dir)

make a directory synchronously

- @param dir `string` directory path

- @returns `void`

### outputFile(input, outputDirOrFile?)

Output the obtained annotation content as a document.

- @param data `CommentInfoItem | CommentInfoItem[] | string` Comment obtained from the source. When `string` it's a file path.
- @param outputDirOrFile `string` Optional parameter. The file or directory where the output will be written. When `outputDirOrFile` is `undefined`, no file will be output.

- @returns `OutputFileReturns | OutputFileReturns[]`

### warn(...args)

Output 😕 yellow color log in console

- @param args `Array<string>`

- @returns `void`

## Types

### CommentInfoItem

CommentInfoItem is the comment information read with the getCommentsData function.

```ts
interface CommentInfoItem {
  // method | type | class | document
  type: string
  // @method name(...args)'s `name`
  name: string
  // @method name(...args)'s `name(...args)`
  fullName: string
  // description
  desc: string[]
  // method's params
  params: string[]
  // method's returns
  returns: string[]
  // for example codes
  codes: string[]
  // Whether the member method of the class is private
  private: boolean
  // file path
  path: string
}
```

### OutputFileInput

outputFile's `input` parameter

```ts
type OutputFileInput =
  | Record<string, CommentInfoItem>
  | CommentInfoItem[]
  | string
```

### OutputFileReturnData<T>

outputFile's `input` return data

```ts
type OutputFileReturnData<T> = T extends string | CommentInfoItem[]
  ? OutputFileReturns[]
  : OutputFileReturns
```

### OutputFileReturns

`OutputFileReturns` returned by the `outputFile` function.

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

## License

MIT License © 2018-Present [Capricorncd](https://github.com/capricorncd).