/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 11:40:27 (GMT+0900)
 */
import { JSDOM } from 'jsdom'
import { describe, it, expect, vi } from 'vitest'
import {
  createElement,
  $,
  $$,
  toStrStyles,
  getMaxZIndex,
  getStyleValue,
  getScrollParents,
} from '@core/dom'

describe('dom', () => {
  it('$', () => {
    const el = createElement(
      'div',
      { id: 'test', dataName: 20 },
      '<p>1</p><span>2</span>'
    )
    expect($('p', el)?.textContent).toBe('1')
    expect($('span', el)?.textContent).toBe('2')
    expect(el.getAttribute('data-name')).toBe('20')
    expect(el.getAttribute('dataName')).toBeNull()
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
    expect(
      toStrStyles({ lineHeight: 1.5, width: '50%' }, { 'line-height': '24px' })
    ).toBe(`line-height:24px;width:50%`)
  })

  it('getMaxZIndex', () => {
    const { window } = new JSDOM(
      '<!doctype html><html><body><div style="position: absolute;z-index: 3"><p style="position: absolute;z-index: 10">1</p><span>2</span></div></body></html>'
    )
    vi.stubGlobal('document', window.document)
    expect(getMaxZIndex()).toBe(10)
  })

  it('getStyleValue', () => {
    const { window } = new JSDOM(
      '<!doctype html><html><body><div style="position: absolute;z-index: 3;height:200px;"><p style="position: absolute;z-index: 10">1</p><span>2</span></div></body></html>'
    )
    vi.stubGlobal('document', window.document)
    const el = $('div')
    expect(getStyleValue(el!, 'z-index')).toBe('3')
    expect(getStyleValue(el!, 'zIndex')).toBe('3')
    expect(getStyleValue(el!, 'z-index', true)).toBe(3)
    expect(getStyleValue(el!, 'height')).toBe('200px')
    expect(getStyleValue($('p')!, 'z-index', true)).toBe(10)
  })

  it('getScrollParents', () => {
    const { window } = new JSDOM(
      '<!doctype html><html><body><div style="width: 100px;height: 100px;overflow: auto"><p style="height: 500px">1</p><span>2</span></div></body></html>'
    )
    vi.stubGlobal('document', window.document)
    const el = $('p')
    expect(getScrollParents(el!).length).toBe(1)
  })
})
