import { describe, test, expect } from 'vitest'
import { handlePropertyLines } from '../src/docs-output'

describe('docs-output', () => {
  test('handlePropertyLines', () => {
    const inputItems = [
      {
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
        path: 'filePath',
        private: false,
        returns: [{ raw: '`string` rrrrrrr', desc: [], types: [] }],
        sort: 0,
        type: 'property',
      },
    ]

    const lines: string[] = []

    handlePropertyLines(inputItems, {}, lines)
    expect(lines).toStrictEqual([
      '## Property',
      '',
      '### el',
      '',
      'Use `el` to get the HTML element of the current class',
      'property 3333',
      '```ts',
      'x.el',
      '```',
      'last line text',
      '',
      '- @returns `string` rrrrrrr',
      '',
    ])

    const lines2: string[] = []

    handlePropertyLines(
      [
        {
          codes: ['```ts', 'x.el', '```'],
          desc: [
            'Use `el` to get the HTML element of the current class',
            'property 3333',
            'last line text',
          ],
          fullName: 'el',
          name: 'el',
          params: [],
          path: 'filePath',
          private: false,
          returns: [{ raw: '`string` rrrrrrr', desc: [], types: [] }],
          sort: 0,
          type: 'property',
        },
      ],
      {},
      lines2
    )
    expect(lines2).toStrictEqual([
      '## Property',
      '',
      '### el',
      '',
      'Use `el` to get the HTML element of the current class',
      'property 3333',
      'last line text',
      '',
      '- @returns `string` rrrrrrr',
      '',
      '```ts',
      'x.el',
      '```',
      '',
    ])
  })
})
