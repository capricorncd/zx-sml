/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/05/08 16:37:46 (GMT+0900)
 */

/**
 * @type CommentInfoItem
 * CommentInfoItem is the comment information read with the [getCommentsData](#getcommentsdatainput-needarray-data) function.
 */
export interface CommentInfoItem {
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

/**
 * @type CommentInfoItemParam
 * [CommentInfoItem](#CommentInfoItem)'s `params`.
 */
export interface CommentInfoItemParam {
  name: string
  required: boolean
  desc: string[]
  types: string[]
}

/**
 * @type CommentInfoItemProp
 * The properties of [CommentInfoItem](#CommentInfoItem), only exists when the type is `type` or `interface`.
 */
export interface CommentInfoItemProp extends CommentInfoItemParam {
  raw: string
}

/**
 * @type CommentInfoItemReturn
 * [CommentInfoItem](#CommentInfoItem)'s `return`.
 */
export interface CommentInfoItemReturn {
  desc: string[]
  types: string[]
  raw: string
}

/**
 * @type OutputFileReturns
 * `OutputFileReturns` returned by the [outputFile](#outputfileinput-outputdirorfile-options) function.
 */
export interface OutputFileReturns {
  // outputted filename
  outputFileName: string | null
  // line array in the output file
  lines: string[]
  // comments data read from code
  data: CommentInfoItem[]
}

/**
 * OutputFileInput
 * outputFile's `input` parameter
 */
type OutputFileInput =
  | Record<string, CommentInfoItem>
  | CommentInfoItem[]
  | string

/**
 * OutputFileReturnData<T>
 * outputFile's `input` return data
 */
type OutputFileReturnData<T> = T extends string | CommentInfoItem[]
  ? OutputFileReturns[]
  : OutputFileReturns

/**
 * getCommentsData
 * @param input
 * @param needArray
 * @param data
 */
export function getCommentsData(
  input: string,
  needArray?: boolean,
  data?: Record<string, any> = {}
): CommentInfoItem[] | Record<string, CommentInfoItem>

export function getCommentsData(
  input: string,
  data?: Record<string, any> = {}
): CommentInfoItem[] | Record<string, CommentInfoItem>

/**
 * @type OutputFileOptions
 */
export interface OutputFileOptions {
  // Display `methods` using raw string, not table. default `false`
  methodWithRaw?: boolean
  // Display `types` using only table, not Source Code. default `false`
  typeWithTable?: boolean
  // Display `types` using only Source Code, not table. default `false`
  typeWithSourceCode?: boolean
  // Lines that need to be added at the start.
  startLines?: string[]
  // Lines that need to be added at the end, such as adding some license information. `['## License', 'BLANK_LINE', 'MIT License © 2018-Present [Capricorncd](https://github.com/capricorncd).']`
  endLines?: string[]
  // This `afterDocumentLines` will be appended to the `@document`, before the `## Methods`
  afterDocumentLines?: string[]
}

/**
 * outputFile
 * @param input
 * @param outputDirOrFile
 * @param options
 */
export function outputFile<T extends OutputFileInput>(
  input: T,
  outputDirOrFile?: string,
  options?: OutputFileOptions
): OutputFileReturnData<T>

export function outputFile<T extends OutputFileInput>(
  input: T,
  options?: OutputFileOptions
): OutputFileReturnData<T>

export function mkdirSync(dir: string): void

export function log(...args: Array<any>): void

export function warn(...args: Array<any>): void

export function error(...args: Array<any>): void