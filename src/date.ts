/**!
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 09:57:51 (GMT+0900)
 */
// https://github.com/capricorncd/date-utils-2020
import { formatDate, toDate } from 'date-utils-2020'
/**
 * @method formatDate(date, format, langPackage?)
 * @description Date format,
 * @description please click [date-utils-2020](https://github.com/capricorncd/date-utils-2020) for details
 * @param date `any`
 * @param format `string`
 * @param langPackage `ILangPackage`
 * @returns `string`
 * ```js
 * // timestamp
 * formatDate( 20210101 , 'yyyy-MM-dd hh:mm:ss') // 1970-01-01 14:36:50
 * // yyyyMMdd
 * formatDate('20210101', 'yyyy-MM-dd hh:mm:ss') // 2021-01-01 00:00:00
 * ```
 */

/**
 * @method toDate(input)
 * @description Convert input to Date,
 * @description please click [date-utils-2020](https://github.com/capricorncd/date-utils-2020) for details
 * @param input `any`
 * @returns `Date | null`
 */

export { formatDate, toDate }
