import { test, describe, expect } from 'vitest'
import { handleProps } from './helpers'

describe('helpers', () => {
  test('handleProps', () => {
    expect(
      handleProps(
        {
          codes: [
            'export interface ITest {',
            '// userId',
            `'data-user-id': string`,
            `'data-user-id2'?: string // userId2`,
            '}',
          ],
        },
        []
      )
    ).toStrictEqual([
      {
        desc: ['userId'],
        name: 'data-user-id',
        required: true,
        types: ['string'],
      },
      {
        desc: ['userId2'],
        name: 'data-user-id2',
        required: false,
        types: ['string'],
      },
    ])
  })
})
