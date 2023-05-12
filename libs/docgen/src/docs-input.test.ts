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
    })
  })
})
