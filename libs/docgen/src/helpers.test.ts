import { test, describe, expect } from 'vitest'
import { handleProps, handleParam } from './helpers'

describe('helpers', () => {
  test('handleProps', () => {
    expect(
      handleProps(
        {
          name: '',
          fullName: '',
          type: '',
          desc: [],
          params: [],
          returns: [],
          private: false,
          path: '',
          sort: 0,
          codes: [
            'export interface ITest {',
            '// userId',
            `'data-user-id': string`,
            `'data-user-id2'?: string // userId2`,
            'disabled?: boolean',
            '}',
          ],
        },
        []
      )
    ).toStrictEqual([
      {
        desc: ['userId'],
        name: 'data-user-id',
        raw: "'data-user-id': string",
        required: true,
        types: ['string'],
      },
      {
        desc: ['userId2'],
        name: 'data-user-id2',
        raw: "'data-user-id2'?: string // userId2",
        required: false,
        types: ['string'],
      },
      {
        desc: [],
        name: 'disabled',
        raw: 'disabled?: boolean',
        required: false,
        types: ['boolean'],
      },
    ])
  })

  test('handleParam', () => {
    expect(handleParam('paramName? `type` param description')).toStrictEqual({
      raw: 'paramName? `type` param description',
      name: 'paramName',
      required: false,
      types: ['type'],
      desc: ['param description'],
    })

    expect(
      handleParam('paramName `type1 | type2` param description2')
    ).toStrictEqual({
      raw: 'paramName `type1 | type2` param description2',
      name: 'paramName',
      required: true,
      types: ['type1', 'type2'],
      desc: ['param description2'],
    })
  })
})
