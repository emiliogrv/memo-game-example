import { merge } from 'lodash'
import { graphql } from 'msw'

export const MOCK_QUERY_MEMO_TESTS_SUCCESS = ({
  data = {},
  mergeData = true,
} = {}) =>
  graphql.query('memoTests', (_req, res, ctx) => {
    return res(
      ctx.data(
        mergeData
          ? merge(
              {
                memoTests: {
                  data: [
                    {
                      id: '00000000-0000-0000-0000-000000000000',
                      name: 'Test 0 from memo-tests',
                    },
                    {
                      id: '00000000-0000-0000-0000-000000000001',
                      name: 'Test 1 from memo-tests',
                    },
                  ],
                  paginatorInfo: {
                    currentPage: 1,
                    hasMorePages: false,
                    lastPage: 1,
                    total: 2,
                  },
                },
              },
              data
            )
          : data
      )
    )
  })

export const MOCK_QUERY_MEMO_TEST_SUCCESS = ({
  data = {},
  mergeData = true,
} = {}) =>
  graphql.query('memoTest', (req, res, ctx) => {
    const { id } = req.variables as { id: string }

    return res(
      ctx.data(
        mergeData
          ? merge(
              {
                memoTest: {
                  id,
                  name: `Name ${id}`,
                  images: [
                    {
                      id: '00000000-0000-0000-0000-000000IMAGE0',
                      url: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
                    },
                    {
                      id: '00000000-0000-0000-0000-000000IMAGE1',
                      url: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/026.png',
                    },
                    {
                      id: '00000000-0000-0000-0000-000000IMAGE2',
                      url: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/037.png',
                    },
                    {
                      id: '00000000-0000-0000-0000-000000IMAGE3',
                      url: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/038.png',
                    },
                  ],
                },
              },
              data
            )
          : data
      )
    )
  })

export const MOCK_QUERY_MEMO_TEST_ERROR = ({
  data = {},
  mergeData = true,
} = {}) =>
  graphql.query('memoTest', (_req, res, ctx) => {
    return res(
      ctx.data(
        mergeData
          ? merge(
              {
                errors: [],
              },
              data
            )
          : data
      )
    )
  })
