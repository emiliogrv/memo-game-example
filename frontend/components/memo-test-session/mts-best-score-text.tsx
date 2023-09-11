'use client'

import { useQueryMemoTestsSessionRecords } from '@/services/hooks'

export default function MtsBestScoreText({
  memoTestID,
}: {
  memoTestID: string
}) {
  const { data } = useQueryMemoTestsSessionRecords({ memoTestID })

  return <span>Best score: {(data?.bestScore || 0).toFixed(2)}</span>
}
