import {
  MemoTestSessionActive,
  MemoTestSessionRecords,
  MemoTestSessionUncoveredRecord,
  SessionActiveProps,
} from '@/types'

import {
  MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY,
  MEMO_TESTS_SESSION_ACTIVE_UNCOVERED_QUERY_KEY,
  MEMO_TESTS_SESSION_RECORDS_QUERY_KEY,
} from '@/config/memo-tests-session'
import {
  mutationCompleteMemoTestSessionServer,
  mutationCreateMemoTestSessionServer,
  mutationUpdateMemoTestSessionRetriesServer,
} from '@/services/memo-tests-session-server'

const queryLocalStorage = <T>(key: string) => {
  const data = localStorage.getItem(key) || '{}'

  return JSON.parse(data) as Record<string, T>
}

const mutationLocalStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const queryMemoTestSessionData = async <T>({
  key,
  memoTestID,
  defVal,
}: {
  key: string
  memoTestID: string
  defVal: T
}) => {
  return queryLocalStorage<T>(key)[memoTestID] || defVal
}

export const mutateMemoTestSessionData = async <T>({
  key,
  memoTestID,
  data,
}: {
  key: string
  memoTestID: string
  data: T
}) => {
  const storage = queryLocalStorage<T>(key)

  storage[memoTestID] = data

  mutationLocalStorage<T>(key, storage as T)
}

export const queryMemoTestsSessionActive = async ({
  memoTestID,
}: {
  memoTestID: string
}) =>
  await queryMemoTestSessionData<MemoTestSessionActive>({
    key: MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY,
    memoTestID,
    defVal: {} as MemoTestSessionActive,
  })

export const queryMemoTestsSessionActiveUncovered = async ({
  memoTestID,
}: {
  memoTestID: string
}) =>
  await queryMemoTestSessionData<MemoTestSessionUncoveredRecord>({
    key: MEMO_TESTS_SESSION_ACTIVE_UNCOVERED_QUERY_KEY,
    memoTestID,
    defVal: { total: 0 },
  })

export const queryMemoTestsSessionRecords = async ({
  memoTestID,
}: {
  memoTestID: string
}) =>
  await queryMemoTestSessionData<MemoTestSessionRecords>({
    key: MEMO_TESTS_SESSION_RECORDS_QUERY_KEY,
    memoTestID,
    defVal: { bestScore: 0, lastScore: 0 },
  })

export const mutationCreateMemoTestSession = async ({
  memoTestID,
}: {
  memoTestID: string
}) => {
  const { record: data } = await mutationCreateMemoTestSessionServer({
    memoTestID,
  })

  await mutateMemoTestSessionData({
    key: MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY,
    memoTestID,
    data,
  })

  return data
}

export const mutationUpdateMemoTestSessionRetries = async ({
  memoTestID,
  retries,
}: {
  memoTestID: string
  retries: number
}) => {
  const data = await queryMemoTestsSessionActive({ memoTestID })

  if (data?.id) {
    await mutationUpdateMemoTestSessionRetriesServer({
      id: data.id,
      retries,
    })

    data.retries = retries
  }

  await mutateMemoTestSessionData({
    key: MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY,
    memoTestID,
    data,
  })

  return data
}

export const mutationUpdateMemoTestsSessionActiveUncovered = async ({
  memoTestID,
  imageID,
}: SessionActiveProps) => {
  const data = await queryMemoTestsSessionActiveUncovered({ memoTestID })

  data.total += 1
  data[imageID] = 1

  await mutateMemoTestSessionData({
    key: MEMO_TESTS_SESSION_ACTIVE_UNCOVERED_QUERY_KEY,
    memoTestID,
    data,
  })

  return data
}

export const mutationCompleteMemoTestSession = async ({
  memoTestID,
}: {
  memoTestID: string
}) => {
  const activeData = await queryMemoTestsSessionActive({ memoTestID })
  const recordsData = await queryMemoTestsSessionRecords({ memoTestID })

  if (activeData) {
    await mutationCompleteMemoTestSessionServer({
      id: activeData.id,
    })

    const bestScore = recordsData.bestScore

    const score = parseFloat(
      ((activeData.numberOfPairs / activeData.retries) * 100).toFixed(2)
    )

    recordsData.lastScore = score
    recordsData.bestScore = score > bestScore ? score : bestScore
  }

  await Promise.all([
    mutateMemoTestSessionData({
      key: MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY,
      memoTestID,
      data: {},
    }),
    mutateMemoTestSessionData({
      key: MEMO_TESTS_SESSION_ACTIVE_UNCOVERED_QUERY_KEY,
      memoTestID,
      data: { total: 0 },
    }),
    mutateMemoTestSessionData({
      key: MEMO_TESTS_SESSION_RECORDS_QUERY_KEY,
      memoTestID,
      data: recordsData,
    }),
  ])

  return {
    activeData: undefined,
    uncoveredData: { total: 0 },
    recordsData,
  }
}
