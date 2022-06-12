/**!
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 09:58:54 (GMT+0900)
 */

/**
 * isArray(input)
 * @description determines whether the passed value is an Array
 * @param input `T`
 * @returns `boolean`
 */
export function isArray<T>(input: T): boolean {
  return Array.isArray(input)
}

/**
 * isObject(input)
 * @description determines whether the passed value is an object
 * @param input `T`
 * @returns `boolean`
 */
export function isObject<T>(input: T): boolean {
  return input !== null && !isArray(input) && typeof input === 'object'
}
