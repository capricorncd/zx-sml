/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 11:40:27 (GMT+0900)
 */
import { describe, it, expect } from 'vitest'
import { toCssValue } from './css'

describe('css', () => {
  it('toCssValue', () => {
    expect(toCssValue(25)).toBe('25px')
    expect(toCssValue(25, 'em')).toBe('25em')
    expect(toCssValue(25, '%')).toBe('25%')
    expect(toCssValue('25')).toBe('25px')
    expect(toCssValue('10 20')).toBe('10px 20px')
    expect(toCssValue('10 -20')).toBe('10px -20px')
    expect(toCssValue(' 25 10 0 8')).toBe('25px 10px 0px 8px')
    expect(toCssValue(' 25 10    0 8')).toBe('25px 10px 0px 8px')
    expect(toCssValue('     0 8  ')).toBe('0px 8px')
    expect(toCssValue('     ')).toBe('')
    expect(toCssValue('')).toBe('')
  })
})