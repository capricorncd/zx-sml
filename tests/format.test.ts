/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 11:40:27 (GMT+0900)
 */
import { describe, it, expect } from 'vitest'
import {
  toTwoDigits,
  slice,
  toCamelCase,
  toSnakeCase,
  joinUrl,
  createUrlForGetRequest,
  splitValue,
  classNames,
  toNumber,
} from '@core/format'

describe('format', () => {
  it('toTwoDigits', () => {
    expect(toTwoDigits('1')).toBe('01')
    expect(toTwoDigits('0')).toBe('00')
    expect(toTwoDigits('11')).toBe('11')
    expect(toTwoDigits('111')).toBe('111')
  })

  it('slice', () => {
    expect(slice([1, 3], 1)).toStrictEqual([3])
    expect(slice({ length: 2, 0: 100, 1: 100 })).toStrictEqual([100, 100])
  })

  it('toCamelCase', () => {
    expect(toCamelCase('line-height')).toBe('lineHeight')
    expect(toCamelCase('line-height', true)).toBe('LineHeight')
  })

  it('toSnakeCase', () => {
    expect(toSnakeCase('lineHeight')).toBe('line-height')
    expect(toSnakeCase('LineHeight')).toBe('line-height')
    expect(toSnakeCase('LineHeight', '_')).toBe('line_height')
  })

  it('joinUrl', () => {
    expect(joinUrl('https://a.com/', '/api/user/', '?age=18')).toBe(
      'https://a.com/api/user?age=18'
    )
  })

  it('createUrlForGetRequest', () => {
    expect(createUrlForGetRequest('api/user', { age: 18 })).toBe(
      'api/user?age=18'
    )
    expect(createUrlForGetRequest('api/user?class=a', { age: 18 })).toBe(
      'api/user?class=a&age=18'
    )
  })

  it('splitValue', () => {
    expect(splitValue('12.321.23rem')).toStrictEqual([12.321, '.23rem'])
    expect(splitValue('12.321rem')).toStrictEqual([12.321, 'rem'])
    expect(splitValue('16px')).toStrictEqual([16, 'px'])
    expect(splitValue('-16px')).toStrictEqual([-16, 'px'])
    expect(splitValue('16%')).toStrictEqual([16, '%'])
    expect(splitValue('16')).toStrictEqual([16, ''])
    expect(splitValue(16)).toStrictEqual([16, ''])
    expect(splitValue('1,600円')).toStrictEqual([1600, '円'])
    expect(splitValue('-1,600円')).toStrictEqual([-1600, '円'])
    expect(splitValue(',1,600円')).toStrictEqual([0, ''])
    expect(splitValue('0000,600円')).toStrictEqual([0, ',600円'])
    expect(splitValue('rem')).toStrictEqual([0, ''])
  })

  it('classNames', () => {
    expect(classNames('active', 'text-center', 'flex')).toBe(
      'active text-center flex'
    )
    expect(classNames({ active: true }, ['text-center'], 'flex')).toBe(
      'active text-center flex'
    )
    expect(classNames({ active: true }, { 'text-center': false }, 'flex')).toBe(
      'active flex'
    )
    expect(classNames([1, 2], 1)).toBe('1 2 1')
  })

  it('toNumber', () => {
    expect(toNumber([1, 3])).toBe(0)
    expect(toNumber([1])).toBe(0)
    expect(toNumber('13')).toBe(13)
    expect(toNumber('1.3rem')).toBe(1.3)
    expect(toNumber('10px')).toBe(10)
    expect(toNumber('10px', true)).toBe(0)
    expect(toNumber('1,000', true)).toBe(0)
    expect(toNumber('1,000$')).toBe(1000)
    expect(toNumber('1,000,999')).toBe(1000999)
    expect(toNumber('1,000,999', true)).toBe(0)
    expect(toNumber('-12px')).toBe(-12)
    expect(toNumber('-12px', true)).toBe(0)
    expect(toNumber(null)).toBe(0)
    expect(toNumber(undefined)).toBe(0)
    expect(toNumber({})).toBe(0)
  })
})
