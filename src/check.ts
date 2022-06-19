/**!
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 09:58:54 (GMT+0900)
 */

/**
 * @method isArray(input)
 * @description determines whether the passed value is an Array
 * @param input `T`
 * @returns `boolean`
 */
export function isArray<T>(input: T): boolean {
  return Array.isArray(input)
}

/**
 * @method isObject(input)
 * @description determines whether the passed value is an object
 * @param input `T`
 * @returns `boolean`
 */
export function isObject<T>(input: T): boolean {
  return input !== null && !isArray(input) && typeof input === 'object'
}

/**
 * @method isElement(el)
 * determines whether the el is an Element
 * @param el `Element`
 * @returns boolean
 */
export function isElement<T extends Node>(el: T): boolean {
  return el && el.nodeType === 1
}
