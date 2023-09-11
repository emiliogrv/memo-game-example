import { graphql } from 'msw'
import { merge } from 'lodash'

export const MOCK_MUTATION_CREATE_MEMO_TEST_SESSION_SUCCESS = ({
  data = {},
  mergeData = true,
} = {}) =>
  graphql.mutation('createMemoTestSession', (_req, res, ctx) => {
    return res(
      ctx.data(
        mergeData
          ? merge(
              {
                createMemoTestSession: {
                  record: {
                    id: '00000000-0000-0000-0000-00000SESSION',
                    numberOfPairs: 4,
                    retries: 0,
                  },
                },
              },
              data
            )
          : data
      )
    )
  })

export const MOCK_MUTATION_UPDATE_MEMO_TEST_SESSION_RETRIES_SUCCESS = ({
  data = {},
  mergeData = true,
} = {}) =>
  graphql.mutation('updateMemoTestSessionRetries', (req, res, ctx) => {
    const { id } = req.variables as { id: string }

    return res(
      ctx.data(
        mergeData
          ? merge(
              {
                updateMemoTestSessionRetries: {
                  recordID: id,
                },
              },
              data
            )
          : data
      )
    )
  })

export const MOCK_MUTATION_COMPLETE_MEMO_TEST_SESSION_SUCCESS = ({
  data = {},
  mergeData = true,
} = {}) =>
  graphql.mutation('completeMemoTestSession', (req, res, ctx) => {
    const { id } = req.variables as { id: string }

    return res(
      ctx.data(
        mergeData
          ? merge(
              {
                completeMemoTestSession: {
                  recordID: id,
                },
              },
              data
            )
          : data
      )
    )
  })
