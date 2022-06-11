/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 11:40:27 (GMT+0900)
 */
import { describe, it, expect } from 'vitest'
import { toTwoDigits } from '@core/format'

describe('format', () => {
  it('toTwoDigits', () => {
    expect(toTwoDigits('1')).toBe('01')
  })
})
