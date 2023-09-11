'use client'

import { useQueryMemoTestsSessionActive } from '@/services/hooks'

export default function MtsRetriesText({ memoTestID }: { memoTestID: string }) {
  const { data } = useQueryMemoTestsSessionActive({ memoTestID })

  return (
    <span className="mx-4">
      Retries: {data ? data.retries || 0 : 'Loading'}
    </span>
  )
}
