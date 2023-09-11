import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import Page from '@/app/memo-test-session/[id]/page'
import { renderApp } from '@/__tests__/utils'
import { setupServer } from 'msw/node'
import {
  MOCK_MUTATION_COMPLETE_MEMO_TEST_SESSION_SUCCESS,
  MOCK_MUTATION_CREATE_MEMO_TEST_SESSION_SUCCESS,
  MOCK_MUTATION_UPDATE_MEMO_TEST_SESSION_RETRIES_SUCCESS,
  MOCK_QUERY_MEMO_TEST_ERROR,
  MOCK_QUERY_MEMO_TEST_SUCCESS,
} from '@/__mocks__/server-responses/graphql'
import {
  MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY,
  MEMO_TESTS_SESSION_ACTIVE_UNCOVERED_QUERY_KEY,
} from '@/config/memo-tests-session'
import { mutateMemoTestSessionData } from '@/services'

const server = setupServer(
  MOCK_QUERY_MEMO_TEST_SUCCESS(),
  MOCK_MUTATION_CREATE_MEMO_TEST_SESSION_SUCCESS(),
  MOCK_MUTATION_UPDATE_MEMO_TEST_SESSION_RETRIES_SUCCESS(),
  MOCK_MUTATION_COMPLETE_MEMO_TEST_SESSION_SUCCESS()
)
const defPageParams = {
  params: {
    id: '00000000-0000-0000-0000-000000000000',
  },
}

describe('game page', () => {
  beforeAll(() => server.listen())

  afterEach(() => {
    localStorage.clear()

    server.resetHandlers()
  })

  afterAll(() => server.close())

  it('should return 404 if invalid memo test id', async () => {
    server.use(MOCK_QUERY_MEMO_TEST_ERROR())

    try {
      await renderApp(
        Page({
          params: {
            id: 'invalid',
          },
        })
      )
    } catch (e: any) {
      expect(e.message).toBe('NEXT_NOT_FOUND')
    }
  })

  it('should render with cards pairs', async () => {
    await renderApp(Page(defPageParams))

    expect(
      screen.getByText(`Name ${defPageParams.params.id}`)
    ).toBeInTheDocument()
    expect(screen.getByText('Retries: Loading')).toBeInTheDocument()

    const cards = screen.getAllByRole('card-flippable')
    expect(cards).toHaveLength(8)

    cards.forEach((card) => expect(card).not.toHaveClass('is-flipped'))

    await waitForElementToBeRemoved(() =>
      expect(screen.getByText('Retries: Loading'))
    )
    expect(screen.getByText('Retries: 0')).toBeInTheDocument()
  })

  it('should show the image when clicked and increment retries count', async () => {
    await renderApp(Page(defPageParams))

    await waitFor(() => expect(screen.getByText('Retries: 0')))

    const [first] = screen.getAllByRole('card-flippable-face')

    fireEvent.click(first)

    await waitFor(() => expect(screen.getByText('Retries: 1')))

    const [firstF] = screen.getAllByRole('card-flippable')

    await waitFor(() => expect(firstF).toHaveClass('is-flipped'))
  })

  it('should keep flipped if the pair match', async () => {
    await renderApp(Page(defPageParams))

    await waitFor(() => expect(screen.getByText('Retries: 0')))

    let [first, , , , fifth] = screen.getAllByRole('card-flippable-face')

    fireEvent.click(first)

    await waitFor(() => expect(screen.getByText('Retries: 1')))

    fireEvent.click(fifth)

    await waitFor(() => expect(screen.getByText('Retries: 2')))

    const [firstF, , , , fifthF] = screen.getAllByRole('card-flippable')

    expect(firstF).toHaveClass('is-flipped')
    expect(fifthF).toHaveClass('is-flipped')
  })

  it('should un-flip if the pair does not match', async () => {
    await renderApp(Page(defPageParams))

    await waitFor(() => expect(screen.getByText('Retries: 0')))

    let [first, second] = screen.getAllByRole('card-flippable-face')

    fireEvent.click(first)

    await waitFor(() => expect(screen.getByText('Retries: 1')))

    fireEvent.click(second)

    await waitFor(() => expect(screen.getByText('Retries: 2')))

    const [firstF, secondF] = screen.getAllByRole('card-flippable')

    await Promise.all([
      waitFor(() => expect(firstF).not.toHaveClass('is-flipped'), {
        timeout: 2000,
      }),
      waitFor(() => expect(secondF).not.toHaveClass('is-flipped'), {
        timeout: 2000,
      }),
    ])
  })

  it('should show completion modal when all pairs are uncovered', async () => {
    await Promise.all([
      mutateMemoTestSessionData({
        memoTestID: '00000000-0000-0000-0000-000000000000',
        key: MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY,
        data: {
          id: '00000000-0000-0000-0000-00000SESSION',
          numberOfPairs: 4,
          retries: 6,
        },
      }),
      mutateMemoTestSessionData({
        memoTestID: '00000000-0000-0000-0000-000000000000',
        key: MEMO_TESTS_SESSION_ACTIVE_UNCOVERED_QUERY_KEY,
        data: {
          total: 3,
          '00000000-0000-0000-0000-000000IMAGE1': true,
          '00000000-0000-0000-0000-000000IMAGE2': true,
          '00000000-0000-0000-0000-000000IMAGE3': true,
        },
      }),
    ])

    await renderApp(Page(defPageParams))

    await waitFor(() => expect(screen.getByText('Retries: 6')))

    let [first, , , , fifth] = screen.getAllByRole('card-flippable-face')

    fireEvent.click(first)

    await waitFor(() => expect(screen.getByText('Retries: 7')))

    fireEvent.click(fifth)

    await waitFor(() => expect(screen.getByText('Retries: 8')))

    await screen.findByText(/Congratulations, you did it!/, undefined, {
      timeout: 5000,
    })

    expect(screen.getByText('Play again')).toBeInTheDocument()
    expect(screen.getByText('Go home')).toBeInTheDocument()
  })

  it('should be able to play again', async () => {
    await Promise.all([
      mutateMemoTestSessionData({
        memoTestID: '00000000-0000-0000-0000-000000000000',
        key: MEMO_TESTS_SESSION_ACTIVE_QUERY_KEY,
        data: {
          id: '00000000-0000-0000-0000-00000SESSION',
          numberOfPairs: 4,
          retries: 8,
        },
      }),
      mutateMemoTestSessionData({
        memoTestID: '00000000-0000-0000-0000-000000000000',
        key: MEMO_TESTS_SESSION_ACTIVE_UNCOVERED_QUERY_KEY,
        data: {
          total: 4,
          '00000000-0000-0000-0000-000000IMAGE0': true,
          '00000000-0000-0000-0000-000000IMAGE1': true,
          '00000000-0000-0000-0000-000000IMAGE2': true,
          '00000000-0000-0000-0000-000000IMAGE3': true,
        },
      }),
    ])

    await renderApp(Page(defPageParams))

    await screen.findByText(/Congratulations, you did it!/, undefined, {
      timeout: 5000,
    })

    fireEvent.click(screen.getByText('Play again'))

    await waitFor(() => expect(screen.getByText('Retries: 0')))
  })
})
