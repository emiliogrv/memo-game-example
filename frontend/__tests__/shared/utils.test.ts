const { shuffleArray } = jest.requireActual('@/shared/utils')

describe('game page', () => {
  it('should shuffle array', async () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    const shuffledArr = shuffleArray(arr)

    expect(JSON.stringify(arr)).not.toEqual(JSON.stringify(shuffledArr))
  })
})
