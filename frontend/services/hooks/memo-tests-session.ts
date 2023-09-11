import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY,
  MEMO_TESTS_SESSION_ACTIVE_UNCOVERED_QUERY_KEY,
  MEMO_TESTS_SESSION_RECORDS_QUERY_KEY,
} from '@/config/memo-tests-session'
import {
  mutationCompleteMemoTestSession,
  mutationCreateMemoTestSession,
  mutationUpdateMemoTestSessionRetries,
  mutationUpdateMemoTestsSessionActiveUncovered,
  queryMemoTestsSessionActive,
  queryMemoTestsSessionActiveUncovered,
  queryMemoTestsSessionRecords,
} from '@/services'
import {
  MemoTestSessionActive,
  MemoTestSessionRecords,
  MemoTestSessionUncoveredRecord,
} from '@/types'

export const useQueryMemoTestsSessionActive = ({
  memoTestID,
}: {
  memoTestID: string
}) => {
  return useQuery<MemoTestSessionActive>({
    queryKey: [MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY, { memoTestID }],
    queryFn: () => queryMemoTestsSessionActive({ memoTestID }),
  })
}

export const useQueryMemoTestsSessionActiveUncovered = ({
  memoTestID,
}: {
  memoTestID: string
}) => {
  return useQuery<MemoTestSessionUncoveredRecord>({
    queryKey: [MEMO_TESTS_SESSION_ACTIVE_UNCOVERED_QUERY_KEY, { memoTestID }],
    queryFn: () => queryMemoTestsSessionActiveUncovered({ memoTestID }),
  })
}

export const useQueryMemoTestsSessionRecords = ({
  memoTestID,
}: {
  memoTestID: string
}) => {
  return useQuery<MemoTestSessionRecords>({
    queryKey: [MEMO_TESTS_SESSION_RECORDS_QUERY_KEY, { memoTestID }],
    queryFn: () => queryMemoTestsSessionRecords({ memoTestID }),
  })
}

export const useMutationCreateMemoTestSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mutationCreateMemoTestSession,
    onSuccess: (data, { memoTestID }) => {
      queryClient.setQueryData(
        [MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY, { memoTestID }],
        data
      )
    },
  })
}

export const useMutationMemoTestsSessionActiveUncovered = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mutationUpdateMemoTestsSessionActiveUncovered,
    onSuccess: (data, { memoTestID }) => {
      queryClient.setQueryData(
        [MEMO_TESTS_SESSION_ACTIVE_UNCOVERED_QUERY_KEY, { memoTestID }],
        data
      )
    },
  })
}

export const useMutationUpdateMemoTestSessionRetries = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mutationUpdateMemoTestSessionRetries,
    onSuccess: (data, { memoTestID }) => {
      queryClient.setQueryData(
        [MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY, { memoTestID }],
        data
      )
    },
  })
}

export const useMutationCompleteMemoTestSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mutationCompleteMemoTestSession,
    onSuccess: async ({ uncoveredData, recordsData }, { memoTestID }) => {
      queryClient.setQueryData(
        [MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY, { memoTestID }],
        await mutationCreateMemoTestSession({ memoTestID })
      )

      queryClient.setQueryData(
        [MEMO_TESTS_SESSION_ACTIVE_UNCOVERED_QUERY_KEY, { memoTestID }],
        uncoveredData
      )

      queryClient.setQueryData(
        [MEMO_TESTS_SESSION_RECORDS_QUERY_KEY, { memoTestID }],
        recordsData
      )
    },
  })
}
