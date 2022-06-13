/**!
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 09:58:54 (GMT+0900)
 */
import { toTwoDigits } from 'date-utils-2020'
import { isObject } from './check'

export { toTwoDigits }

/**
 * @method createUrlForGetRequest(url, params)
 * @description Create full URL for GET request
 * @param url `string`
 * @param params `Record<string, unknown>`
 * @returns `string`
 */
export function createUrlForGetRequest(
  url: string,
  params: Record<string, unknown> = {}
): string {
  const [prefixUrl, search] = url.split('?')
  const queryParams: string[] = []
  if (search) queryParams.push(search)
  for (const [key, val] of Object.entries(params)) {
    queryParams.push(`${key}=${isObject(val) ? JSON.stringify(val) : val}`)
  }
  return prefixUrl + (queryParams.length ? `?${queryParams.join('&')}` : '')
}

/**
 * @method toSnakeCase(input, connectSymbol?)
 * Format string as snake case
 * ```js
 * toSnakeCase('helloWorld') // hello-world
 * toSnakeCase('HelloWorld') // hello-world
 * toSnakeCase('helloWorld', '_') // hello_world
 * toSnakeCase('helloWorld', ' ') // hello world
 * ```
 * @param input `string`
 * @param connectSymbol `string` word connect symbol, default `-`
 * @returns `string`
 */
export function toSnakeCase(input = '', connectSymbol = '-'): string {
  return input
    .replace(/[A-Z]/g, (s) => `${connectSymbol}${s.toLowerCase()}`)
    .replace(new RegExp(`^${connectSymbol}`), '')
}

/**
 * @method toCamelCase(input, isFirstCapitalLetter?)
 * Format string as camel case
 * ```js
 * toCamelCase('hello_world') // helloWorld
 * toCamelCase('hello-world') // helloWorld
 * toCamelCase('hello world') // helloWorld
 * toCamelCase('hello-world', true) // HelloWorld
 * ```
 * @param input `string`
 * @param isFirstCapitalLetter `boolean` whether to capitalize the first letter, default `false`
 * @returns `string`
 */
export function toCamelCase(input = '', isFirstCapitalLetter = false): string {
  const result = input.replace(/[-_\s](\w)/g, (_, s) => s.toUpperCase())
  return isFirstCapitalLetter
    ? result.replace(/^\w/, (s) => s.toUpperCase())
    : result
}

/**
 * @method toNumber(input, isStrictMode?)
 * @description Convert any type to number.
 * ```js
 * toNumber('1.3rem') // 1.3
 * toNumber('1.3rem', true) // 0
 * toNumber('-12px') // -12
 * toNumber('-12px', true) // 0
 * toNumber('1,000,999Yan') // 1000999
 * toNumber('1,000,999', true) // 0
 * ```
 * @param input `any`
 * @param isStrictMode `boolean` Whether it is strict mode, default `false`
 * @returns `number`
 */
export function toNumber<T>(input: T, isStrictMode = false): number {
  if (typeof input === 'number') return input
  if (typeof input === 'string') {
    if (
      !isStrictMode &&
      /^(-?\d+(?:\.\d+)?)\D*/.test(input.replace(/(\d),/g, '$1'))
    ) {
      return toNumber(RegExp.$1, true)
    }
    const n = Number(input)
    return isNaN(n) ? 0 : n
  }
  return 0
}

/**
 * @method splitValue(input)
 * Split an attribute value into number and suffix unit.
 * ```js
 * splitValue('100px') // [100, 'px']
 * splitValue(100) // [100, '']
 * splitValue('2.5rem') // [2.5, 'rem']
 * splitValue('-2.5rem') // [-2.5, 'rem']
 * splitValue('50%') // [50, '%']
 * ```
 * @param input `string | number`
 * @returns `[number, string]`
 */
export function splitValue(input: string | number): [number, string] {
  if (typeof input === 'number') {
    return [input, '']
  }
  const result = input.match(/^(-?\d+(?:\.\d+)?)([a-zA-Z%]*)$/)
  return result ? [toNumber(result[1], true), result[2]] : [0, '']
}

/**!
 * to string that className
 * @param input `any`
 * @returns `string`
 */
function toString(input: unknown): string {
  if (typeof input === 'string') return input
  if (input === null || typeof input === 'undefined') return ''
  if (Array.isArray(input)) return input.map(toString).join(' ')
  // { className1: true, className2: false } => 'className1'
  if (typeof input === 'object') {
    return Object.keys(input)
      .filter((key) => input[key as keyof typeof input])
      .join(' ')
  }
  return String(input)
}

/**
 * @method classNames(...args)
 * handle className
 * @param args `string | [string] | { className1: true, className2: false }`
 * @returns `string`
 */
export function classNames(...args: unknown[]): string {
  return args
    .map(toString)
    .filter((item) => !!item)
    .join(' ')
}

/**
 * @method joinUrl(...args)
 * format url,
 * ```js
 * joinUrl('https://a.com/', '/news', 'detail/100001/?x=9')
 * // https://a.com/news/detail/100001?x=9
 * ```
 * @param args `string[]`
 * @returns `string`
 */
export function joinUrl(...args: string[]): string {
  const url = args
    .join('/')
    // `http://`の`//`が対象外
    .replace(/(\w(?!:))(\/+)/g, '$1/')
    // 新URLの末尾の'/'を削除する
    .replace(/\/$/, '')
  // http://a.com/?x=1 => http://a.com?x=1
  return url.replace(/\/([?#])/, '$1')
}

/**
 * @method slice(arrayLike, offset?)
 * Convert pseudo-array to array
 * @param arrayLike `pseudo-array`
 * @param offset `number` default `0`
 * @returns `array T[]`
 */
export function slice<T, P>(arrayLike: P, offset = 0): T[] {
  return Array.prototype.slice.call(arrayLike, offset)
}
