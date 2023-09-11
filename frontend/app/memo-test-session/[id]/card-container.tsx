'use client'
import { MemoTestImage } from '@/types'
import { Card } from '@/app/memo-test-session/[id]/card'
import { useEffect, useState } from 'react'
import {
  useMutationCompleteMemoTestSession,
  useMutationCreateMemoTestSession,
  useMutationMemoTestsSessionActiveUncovered,
  useMutationUpdateMemoTestSessionRetries,
  useQueryMemoTestsSessionActive,
  useQueryMemoTestsSessionActiveUncovered,
} from '@/services/hooks'
import { Modal } from 'flowbite-react'
import Link from 'next/link'
import { shuffleArray } from '@/shared'
import AwardIcon from '@/icons/award-icon'

const CSS_FLIP_TRANSITION_DURATION = 1000
let lastFlippedIndex: number | undefined

export function CardContainer({
  memoTestID,
  images = [],
}: {
  memoTestID: string
  images?: MemoTestImage[]
}) {
  const [imagesData, setImagesData] = useState(images)
  const [lastFlipped, setLastFlipped] = useState('')
  const [isFlippable, setIsFlippable] = useState(true)

  const { data: activeData, isLoading: dataIsLoading } =
    useQueryMemoTestsSessionActive({ memoTestID })
  const { data: uncoveredData } = useQueryMemoTestsSessionActiveUncovered({
    memoTestID,
  })

  const mutationCreate = useMutationCreateMemoTestSession()
  const mutationUncovered = useMutationMemoTestsSessionActiveUncovered()
  const mutationRetries = useMutationUpdateMemoTestSessionRetries()
  const mutationComplete = useMutationCompleteMemoTestSession()

  useEffect(
    () => () => {
      lastFlippedIndex = undefined
    },
    []
  )

  useEffect(() => {
    if (!dataIsLoading && !activeData?.id && !mutationCreate.isLoading) {
      mutationCreate.mutate({
        memoTestID,
      })
    }
  }, [memoTestID, activeData?.id, dataIsLoading, mutationCreate])

  useEffect(() => {
    if (
      !activeData ||
      !uncoveredData ||
      mutationUncovered.isLoading ||
      mutationRetries.isLoading ||
      mutationComplete.isLoading
    ) {
      return
    }

    if (activeData.numberOfPairs === uncoveredData.total) {
      setShowModal(true)
    }
  }, [
    memoTestID,
    mutationComplete,
    mutationRetries.isLoading,
    mutationUncovered.isLoading,
    activeData,
    uncoveredData,
  ])

  const handleFlipped = (imageID: string, index: number) => {
    if (lastFlippedIndex === index) {
      return
    }

    mutationRetries.mutate({
      memoTestID,
      retries: (activeData?.retries || 0) + 1,
    })

    if (!lastFlipped) {
      lastFlippedIndex = index
      setLastFlipped(imageID)

      return
    } else if (lastFlippedIndex !== index) {
      setIsFlippable(false)
    }

    if (lastFlipped === imageID) {
      mutationUncovered.mutate({
        memoTestID,
        imageID,
      })
    }

    setTimeout(() => {
      setIsFlippable(true)
      setLastFlipped('')
      lastFlippedIndex = undefined
    }, CSS_FLIP_TRANSITION_DURATION)
  }

  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Modal show={showModal}>
        <Modal.Body className="bg-slate-800">
          <h1 className="flex text-3xl font-extrabold tracking-tight text-white text-center">
            <AwardIcon /> Congratulations, you did it!
          </h1>
        </Modal.Body>

        <Modal.Footer className="bg-slate-800">
          <button
            role="button-play-again"
            onClick={() => {
              mutationComplete.mutate({ memoTestID })
              setShowModal(false)
              setTimeout(setImagesData, 1000, shuffleArray(images))
            }}
            className="px-2 py-1 rounded w-28 text-center font-semibold outline-none bg-green-400 text-gray-100 hover:bg-green-700 focus-within:bg-green-700">
            Play again
          </button>
          <Link
            role="button-go-home"
            href="/"
            onClick={() => mutationComplete.mutate({ memoTestID })}
            className="px-2 py-1 rounded w-28 text-center font-semibold outline-none border border-gray-600">
            Go home
          </Link>
        </Modal.Footer>
      </Modal>

      {imagesData.map((image, index) => (
        <Card
          position={index + 1}
          key={`${image.id}.${index}`}
          memoTestID={memoTestID}
          image={image}
          isFlippable={isFlippable}
          lastFlipped={lastFlipped}
          onFlipped={(id) => handleFlipped(id, index)}
        />
      ))}
    </>
  )
}
