import { screen } from '@testing-library/react'
import Page from '@/app/page'
import { renderApp } from '@/__tests__/utils'
import { setupServer } from 'msw/node'
import { MOCK_QUERY_MEMO_TESTS_SUCCESS } from '@/__mocks__/server-responses/graphql'
import {
  MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY,
  MEMO_TESTS_SESSION_RECORDS_QUERY_KEY,
} from '@/config/memo-tests-session'
import { mutateMemoTestSessionData } from '@/services'

const server = setupServer(MOCK_QUERY_MEMO_TESTS_SUCCESS())

describe('Pagepage', () => {
  beforeAll(() => server.listen())

  afterEach(() => {
    localStorage.clear()

    server.resetHandlers()
  })

  afterAll(() => server.close())

  it('should render with games name and score in 0', async () => {
    await renderApp(Page())

    expect(screen.getAllByText(/from memo-tests/)).toHaveLength(2)
    expect(screen.getAllByText('Best score: 0.00')).toHaveLength(2)

    const buttons = screen.getAllByText<HTMLAnchorElement>('Loading')
    expect(buttons).toHaveLength(2)

    buttons.forEach((button, key) =>
      expect(
        button.href.endsWith(
          `/memo-test-session/00000000-0000-0000-0000-00000000000${key}`
        )
      )
    )
  })

  it('should show the best scores for each game and start buttons', async () => {
    await Promise.all([
      mutateMemoTestSessionData({
        memoTestID: '00000000-0000-0000-0000-000000000000',
        key: MEMO_TESTS_SESSION_RECORDS_QUERY_KEY,
        data: {
          bestScore: 50,
          lastScore: 20,
        },
      }),
      mutateMemoTestSessionData({
        memoTestID: '00000000-0000-0000-0000-000000000001',
        key: MEMO_TESTS_SESSION_RECORDS_QUERY_KEY,
        data: {
          bestScore: 28.576,
          lastScore: 28.576,
        },
      }),
    ])

    await renderApp(Page())

    await screen.findByText('Best score: 50.00')
    expect(screen.getByText('Best score: 28.58')).toBeInTheDocument()
    expect(screen.getAllByText('Start')).toHaveLength(2)
  })

  it('should show the continue button when retries gte 1', async () => {
    await mutateMemoTestSessionData({
      memoTestID: '00000000-0000-0000-0000-000000000000',
      key: MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY,
      data: {
        id: '00000000-0000-0000-0000-00000SESSION',
        numberOfPairs: 4,
        retries: 1,
      },
    })

    await renderApp(Page())

    await screen.findByText('Continue')
    expect(screen.getAllByText('Start')).toHaveLength(1)
  })
})
