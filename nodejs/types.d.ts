/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/05/08 16:37:46 (GMT+0900)
 */

/**
 * @type CommentInfoItem
 * CommentInfoItem is the comment information read with the [getCommentsData](#getcommentsdatainput-needarray-options) function.
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
  // [CommentInfoItemProp](#CommentInfoItemProp)
  props?: CommentInfoItemProp[]
}

/**
 * @type CommentInfoItemParam
 * [CommentInfoItem](#CommentInfoItem)'s `params`.
 */
export interface CommentInfoItemParam {
  // parameter name or property name
  name: string
  // Whether the parameter is required, or the field must exist in the returned data.
  required: boolean
  // parameter or property's descriptions
  desc: string[]
  // parameter or property's types
  types: string[]
}

/**
 * @type CommentInfoItemProp
 * The properties of [CommentInfoItem](#CommentInfoItem), only exists when the type is `type` or `interface`.
 */
export interface CommentInfoItemProp extends CommentInfoItemParam {
  raw: string // raw annotation string
}

/**
 * @type CommentInfoItemReturn
 * [CommentInfoItem](#CommentInfoItem)'s `return`.
 */
export interface CommentInfoItemReturn {
  // returned's descriptions.
  desc: string[]
  // returned's types
  types: string[]
  // raw annotation string
  raw: string
}

/**
 * @type OutputFileReturns
 * Returned data of function [outputFile](#outputfileinput-outputdirorfile-options).
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
 * @type OutputFileInput
 * A parameter `input` of function [outputFile](#outputfileinput-outputdirorfile-options).
 */
type OutputFileInput =
  | Record<string, CommentInfoItem>
  | CommentInfoItem[]
  | string
  | string[]

/**
 * OutputFileReturnData<T>
 * Returned data of function outputFile.
 */
type OutputFileReturnData<T> = T extends string | string[] | CommentInfoItem[]
  ? OutputFileReturns[]
  : OutputFileReturns

/**
 * getCommentsData
 * @param input
 * @param needArray
 * @param data
 */
export function getCommentsData(
  input: string | string[],
  needArray?: boolean,
  data?: Record<string, any>
): CommentInfoItem[] | Record<string, CommentInfoItem>

export function getCommentsData(
  input: string | string[],
  data?: Record<string, any>
): CommentInfoItem[] | Record<string, CommentInfoItem>

/**
 * @type DocTypes
 */
export type DocTypes = 'document' | 'method' | 'type' | 'code'

/**
 * @type OutputFileOptionLines
 */
export interface OutputFileOptionLines {
  // The `start` that need to be added at the start.
  start: string | string[]
  // The 'end' that need to be added at the end, such as adding some license information. `['## License', 'BLANK_LINE', 'MIT License © 2018-Present [Capricorncd](https://github.com/capricorncd).']`.
  end: string | string[]
  // It's will be appended to the `[type]`, before the `## [other type]`
  afterType: Record<Omit<DocTypes, 'code'>, string | string[]>
  // It's will be insert after `type` title line.
  // For example, `{method: ['some type description content']}`,
  // It's will to insert after `method` line, like this's `['## Methods', 'some type description content', '...']`
  afterTitle: Record<Omit<DocTypes, 'code'>, string | string[]>
}

/**
 * @type TableHeadInnerText
 * Table head th inner text of the output file.
 */
export type TableHeadInnerText =
  | 'Name'
  | 'Param'
  | 'Prop'
  | 'Types'
  | 'Required'
  | 'Description'

/**
 * @type OutputFileOptionAlias
 */
export interface OutputFileOptionAlias {
  // Alias of table head th inner text.
  tableHead: Record<TableHeadInnerText, string>
  // Summary of details, `<details><summary>Source Code</summary></details>`'s summary, default `Source Code`.
  sourceCodeSummary: string
  // Required values, `{requiredValues: {0: 'no', 1: 'yes'}}`.
  requiredValues: Record<0 | 1, string>
}

/**
 * @type OutputFileOptions
 * Options of the function [outputFile](#outputfileinput-outputdirorfile-options), extends [GetCommentsDataOptions](#GetCommentsDataOptions)
 */
export interface OutputFileOptions extends GetCommentsDataOptions {
  // Display `methods` using raw string, not table. default `false`
  methodWithRaw?: boolean
  // Display `types` using only table, not Source Code. default `false`
  typeWithTable?: boolean
  // Display `types` using only Source Code, not table. default `false`
  typeWithSourceCode?: boolean
  // By default, `table` and `<details><summary>Source Code</summary></details>` are displayed,
  // but sometimes `table`'s data may not exist, only `Source Code` can be displayed and `<details>` not using.
  typeWithAuto?: boolean
  // lines. [OutputFileOptionLines](#OutputFileOptionLines)
  lines: OutputFileOptionLines
  // alias. [OutputFileOptionAlias](#OutputFileOptionAlias)
  alias: OutputFileOptionAlias
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

/**
 * @type GetCommentsDataOptions
 * Parameter `options` of function [getCommentsData](#getcommentsdatainput-needarray-options)
 */
export interface GetCommentsDataOptions {
  // Regular expression for the type of file to be read, defaults to `/\.[tj]s$/`.
  fileType?: RegExp
  // Disables key sorting, defaults to `false`, and sorts alphabetically.
  disableKeySorting?: boolean
  // This `types` array is obtained from other files or directories for `extends` related processing.
  types?: CommentInfoItem[]
}
