import path from 'node:path'
import { describe, test, expect } from 'vitest'
import { handleFile } from './docs-input'

describe('docs-input', () => {
  test('handleFile', () => {
    const filePath = path.resolve(__dirname, '../__test__/docs-input.comment')

    expect(handleFile(filePath, {})).toStrictEqual({
      document_X: {
        type: 'document',
        sort: 0,
        name: 'X',
        fullName: 'X',
        desc: [
          '',
          'XXXX',
          '',
          'description 1111',
          '',
          'Usage',
          '',
          '```bash',
          '  const x = new X();',
          '```',
          'description 2222',
        ],
        params: [],
        returns: [],
        codes: [],
        private: false,
        path: filePath,
      },
      property_el: {
        codes: [],
        desc: [
          'Use `el` to get the HTML element of the current class',
          'property 3333',
          '```ts',
          'x.el',
          '```',
          'last line text',
        ],
        fullName: 'el',
        name: 'el',
        params: [],
        path: filePath,
        private: false,
        returns: [],
        sort: 0,
        type: 'property',
      },
    })

    expect(
      handleFile(filePath, {}, { isExtractCodeFromComments: true })
    ).toStrictEqual({
      document_X: {
        type: 'document',
        sort: 0,
        name: 'X',
        fullName: 'X',
        desc: ['', 'XXXX', '', 'description 1111', '', 'description 2222'],
        params: [],
        returns: [],
        codes: ['', 'Usage', '', '```bash', '  const x = new X();', '```'],
        private: false,
        path: filePath,
      },
      property_el: {
        codes: ['```ts', 'x.el', '```'],
        desc: [
          'Use `el` to get the HTML element of the current class',
          'property 3333',
          'last line text',
        ],
        fullName: 'el',
        name: 'el',
        params: [],
        path: filePath,
        private: false,
        returns: [],
        sort: 0,
        type: 'property',
      },
    })
  })
})
