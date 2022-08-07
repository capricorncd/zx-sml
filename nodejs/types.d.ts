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

/**
 * @type OutputFileReturns
 * `OutputFileReturns` returned by the [outputFile](#outputfileinput-outputdirorfile) function.
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
  needArray?: boolean = false,
  data?: Record<string, any> = {}
): CommentInfoItem[] | Record<string, CommentInfoItem>

/**
 * outputFile
 * @param input
 * @param outputDirOrFile
 */
export function outputFile<T extends OutputFileInput>(
  input: T,
  outputDirOrFile?: string
): OutputFileReturnData<T>

export function mkdirSync(dir: string): void

export function log(...args: Array<any>): void

export function warn(...args: Array<any>): void

export function error(...args: Array<any>): void
