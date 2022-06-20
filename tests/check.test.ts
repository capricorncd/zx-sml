/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 11:40:27 (GMT+0900)
 */
import { describe, it, expect } from 'vitest'
import { isArray, isObject, isNumberLike } from '@core/check'

describe('check', () => {
  it('isArray', () => {
    expect(isArray('')).toBeFalsy()
    expect(isArray(isObject)).toBeFalsy()
    expect(isArray(null)).toBeFalsy()
    expect(isArray(new Map())).toBeFalsy()
    expect(isArray(new Set())).toBeFalsy()
    expect(isArray([])).toBeTruthy()
    expect(isArray([1, 2])).toBeTruthy()
    expect(isArray(['str', 2])).toBeTruthy()
  })

  it('isObject', () => {
    expect(isObject([])).toBeFalsy()
    expect(isObject(isArray)).toBeFalsy()
    expect(isObject(null)).toBeFalsy()
    expect(isObject(undefined)).toBeFalsy()
    expect(isObject('undefined')).toBeFalsy()
    expect(isObject({})).toBeTruthy()
    expect(isObject(new Map())).toBeTruthy()
    expect(isObject(new Set())).toBeTruthy()
  })

  it('isNumberLike', () => {
    expect(isNumberLike('-123.000')).toBeTruthy()
    expect(isNumberLike('12.01')).toBeTruthy()
    expect(isNumberLike('12px')).toBeFalsy()
  })
})
