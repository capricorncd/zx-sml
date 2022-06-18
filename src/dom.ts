/**!
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 10:44:51 (GMT+0900)
 */
import { slice } from './format'

/**
 * @method $(selector, doc?)
 * @description Get the DOM element that matches selector
 * @param selector `string | HTMLElement`
 * @param doc `Document | HTMLElement`
 * @returns `HTMLElement | null`
 */
export function $<T extends HTMLElement>(
  selector: string | T,
  doc: Document | HTMLElement = document
): T | null {
  if (selector instanceof HTMLElement) return selector
  return doc.querySelector(selector)
}

/**
 * @method $$(selector, doc?)
 * @description Get the DOM elements that matches selector
 * @param selector `string`
 * @param doc `Document | HTMLElement`
 * @returns `HTMLElement[]`
 */
export function $$<T extends HTMLElement>(
  selector: string,
  doc: Document | HTMLElement = document
): T[] {
  return slice(doc.querySelectorAll(selector), 0)
}

/**
 * @method createElement(tag, attrs?, children?)
 * create an element
 * @param tag `string`
 * @param attrs `Record<string, string>`
 * @param children `string | HTMLElement | Node`
 * @returns `HTMLElement`
 */
export function createElement<T extends HTMLElement>(
  tag: string,
  attrs: Record<string, string> = {},
  children?: string | HTMLElement | Node
): T {
  const el = document.createElement(tag) as T
  for (const [key, val] of Object.entries(attrs)) {
    el.setAttribute(key, val)
  }
  if (children) {
    if (typeof children === 'string') {
      el.innerHTML = children
    } else {
      el.append(children)
    }
  }
  return el
}
