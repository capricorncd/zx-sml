/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 11:40:27 (GMT+0900)
 */
import { describe, it, expect } from 'vitest'
import { createElement, $, $$, toStrStyles } from '@core/dom'

describe('dom', () => {
  it('$', () => {
    const el = createElement('div', {}, '<p>1</p><span>2</span>')
    expect($('p', el)?.textContent).toBe('1')
    expect($('span', el)?.textContent).toBe('2')
  })

  it('$$', () => {
    const el = createElement('div', {}, '<p>1</p><span>2</span><p>3</p>')
    expect($$('p', el).length).toBe(2)
    expect($$('div', el).length).toBe(0)
    expect($$('span', el).length).toBe(1)
  })

  it('toStrStyles', () => {
    expect(toStrStyles({ 'line-height': 1.5, width: '50%' })).toBe(
      `line-height:1.5;width:50%`
    )
    expect(toStrStyles({ lineHeight: 1.5, width: '50%' })).toBe(
      `line-height:1.5;width:50%`
    )
  })
})
