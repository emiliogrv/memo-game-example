'use server'

import request from 'graphql-request'
import { API_GRAPHQL_URL } from '@/config/env'
import {
  MUTATION_COMPLETE_MEMO_TEST_SESSION,
  MUTATION_CREATE_MEMO_TEST_SESSION,
  MUTATION_UPDATE_MEMO_TEST_SESSION_RETRIES,
} from '@/graphql'
import { MemoTestSession } from '@/types'

export const mutationCreateMemoTestSessionServer = async (props: {
  memoTestID: string
}) => {
  const { createMemoTestSession: data } = await request<{
    createMemoTestSession: {
      record: Pick<MemoTestSession, 'id' | 'numberOfPairs' | 'retries'>
    }
  }>(API_GRAPHQL_URL, MUTATION_CREATE_MEMO_TEST_SESSION, props)

  return data
}

export const mutationUpdateMemoTestSessionRetriesServer = async (props: {
  id: string
  retries: number
}) => {
  await request(
    API_GRAPHQL_URL,
    MUTATION_UPDATE_MEMO_TEST_SESSION_RETRIES,
    props
  )
}

export const mutationCompleteMemoTestSessionServer = async (props: {
  id: string
}) => {
  await request(API_GRAPHQL_URL, MUTATION_COMPLETE_MEMO_TEST_SESSION, props)
}
