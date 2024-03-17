/**!
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 09:58:54 (GMT+0900)
 */
import { isNumberLike } from './check'

/**
 * @method toCssValue(value, unit)
 *
 * @param value `any` css properties value
 * @param unit `string` px, em...
 * @returns `string`
 */
export function toCssValue(value: unknown, unit = 'px'): string {
  if (isNumberLike(value)) return `${value}${unit}`
  if (typeof value === 'string') {
    const str = value.trim()
    return /\d+\s+/.test(str)
      ? str
          .trim()
          .split(/\s+/)
          .map((s) => toCssValue(s, unit))
          .join(' ')
      : str
  }
  return ''
}
