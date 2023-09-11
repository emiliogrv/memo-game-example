export function shuffleArray(array: any[]) {
  const tempArray = structuredClone(array)

  for (let i = tempArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]]
  }

  return tempArray
}
