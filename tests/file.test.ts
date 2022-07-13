/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 11:40:27 (GMT+0900)
 */
import { describe, it, expect } from 'vitest'
import { fileToBase64, createBlobURL, splitBase64 } from '@core/file'

describe('dom', () => {
  it('fileToBase64', async () => {
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
    })
    expect(await fileToBase64(file)).toMatch(/^data:text\/plain;base64,.+/)
  })

  it.skip('createBlobURL', () => {
    // https://github.com/jsdom/jsdom/issues/1721
    // The "obj" argument must be an instance of Blob. Received an instance of Blob
    // const obj = { hello: 'world' }
    // const blob = new Blob([JSON.stringify(obj, null, 2)], {
    //   type: 'application/json',
    // })
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
    })
    expect(createBlobURL(file)).toMatch(/^blob:/)

    // const bytes = new Uint8Array(59)
    // for (let i = 0; i < 59; i++) {
    //   bytes[i] = 32 + i
    // }
    // const blob2 = new Blob([bytes.buffer], { type: 'text/plain' })
    // expect(createBlobURL(blob2)).toMatch(/^blob:/)
  })

  it('splitBase64', () => {
    const base64 =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAkGB+wgHBgkIBwgKCgkLDRYPDQw//9k='
    expect(splitBase64(base64)).toStrictEqual({
      type: 'image/jpeg',
      data: '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAkGB+wgHBgkIBwgKCgkLDRYPDQw//9k=',
    })
  })
})
