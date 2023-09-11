import MtsStartButton from '@/components/memo-test-session/mts-start-button'
import MtsBestScoreText from '@/components/memo-test-session/mts-best-score-text'
import { queryMemoTestsServer } from '@/services'

export default async function HomePage() {
  const { data } = await queryMemoTestsServer()

  return (
    <>
      <header className="pb-4 my-8 border-b border-gray-600">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white text-center">
          A friendly memo game
        </h1>

        <p className="mb-2 text-lg text-gray-400 text-center">
          Start o continue a memo game, test your memory and enjoy beating your
          onw record
        </p>
      </header>

      <main className="flex flex-col justify-between">
        <section className="max-w-[1024px] w-full mx-auto min-h-screen">
          <ul className="text-sm font-medium border rounded-lg bg-gray-700 border-gray-600 text-white overflow-hidden">
            {data.map((memoTest) => (
              <li
                key={memoTest.id}
                className="px-4 py-4 border-b border-gray-600 hover:bg-gray-600 flex flex-col">
                <p className="flex mb-4 w-full overflow-hidden">
                  {memoTest.name}
                </p>

                <section className="flex justify-between items-center">
                  <MtsBestScoreText memoTestID={memoTest.id} />
                  <MtsStartButton memoTestID={memoTest.id} />
                </section>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
