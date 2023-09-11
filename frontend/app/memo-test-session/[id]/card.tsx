'use client'
import Image from 'next/image'
import { MemoTestImage } from '@/types'
import { KeyboardEvent, useEffect, useState } from 'react'
import { useQueryMemoTestsSessionActiveUncovered } from '@/services/hooks'
import ClickIcon from '@/icons/click-icon'

export function Card({
  memoTestID,
  image,
  lastFlipped,
  isFlippable,
  onFlipped,
  position,
}: {
  memoTestID: string
  image: MemoTestImage
  lastFlipped: string
  isFlippable: boolean
  onFlipped: (imageID: string) => void
  position: number
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const { data, isLoading } = useQueryMemoTestsSessionActiveUncovered({
    memoTestID,
  })
  const isUncovered = Boolean(data?.[image.id])

  useEffect(() => {
    if (!isLoading) {
      setIsFlipped(() => isUncovered)
    }
  }, [memoTestID, isUncovered, image.id, isLoading])

  useEffect(() => {
    if (!lastFlipped) {
      setIsFlipped(isUncovered)
    }
  }, [memoTestID, isUncovered, image.id, lastFlipped])

  const handleOnClick = () => {
    if (isLoading || !isFlippable) {
      return
    }

    setIsFlipped(true)

    onFlipped(image.id)
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Space' || event.code === 'Enter') {
      event.stopPropagation()

      handleOnClick()
    }
  }

  return (
    <div
      className="card-group-flippable w-[150px] sm:w-[175px] lg:w-[200px] h-[150px] sm:h-[175px] lg:h-[200px]"
      aria-posinset={position}>
      <div
        role="card-flippable"
        aria-roledescription="Card flippable"
        className={
          (isFlipped ? 'is-flipped ' : '') +
          'card-flippable w-full h-full relative'
        }>
        <div
          role="card-flippable-face"
          aria-roledescription="Card flippable face"
          tabIndex={position}
          className="card-flippable-face w-full h-full absolute flex items-center justify-center border rounded-lg bg-gray-700 cursor-pointer"
          onClick={handleOnClick}
          onKeyUp={handleKeyPress}>
          <ClickIcon />
        </div>
        <Image
          className={
            (isUncovered ? 'bg-teal-700 ' : 'bg-gray-500 ') +
            'card-flippable-face card-flippable-face-back w-full h-full absolute border rounded-lg transition-colors duration-[1500ms]'
          }
          src={image.url}
          alt={`Card flippable ${position}`}
          width={200}
          height={200}
        />
      </div>
    </div>
  )
}
