'use client'

import Link from 'next/link'
import { useQueryMemoTestsSessionActive } from '@/services/hooks'

export default function MtsStartButton({ memoTestID }: { memoTestID: string }) {
  const { data, isLoading } = useQueryMemoTestsSessionActive({ memoTestID })

  const isActive = Boolean(data?.retries)

  return (
    <Link
      role="button-start-game"
      href={`/memo-test-session/${memoTestID}`}
      className={
        (isLoading
          ? 'bg-slate-300 text-gray-700 '
          : isActive
          ? 'bg-amber-400 text-gray-700 hover:bg-amber-700 focus-within:bg-amber-700 '
          : 'bg-green-400 text-gray-100 hover:bg-green-700 focus-within:bg-green-700') +
        'px-2 py-1 rounded w-28 text-center font-semibold outline-none'
      }>
      {isLoading ? 'Loading' : isActive ? 'Continue' : 'Start'}
    </Link>
  )
}
