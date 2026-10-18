export const DEFAULT_ROWS = 6
export const DEFAULT_COLUMNS = 6
export const MIN_DIMENSION = 1
export const MAX_DIMENSION = 10

export function createPuzzleSize(rows, columns) {
  const safeRows = Math.max(MIN_DIMENSION, Math.min(MAX_DIMENSION, rows))
  const safeColumns = Math.max(MIN_DIMENSION, Math.min(MAX_DIMENSION, columns))
  return {
    label: `${safeRows} × ${safeColumns}`,
    columns: safeColumns,
    rows: safeRows,
    count: safeRows * safeColumns,
  }
}

export function createShuffledPieces(pieceCount, previous = []) {
  const pieces = Array.from({ length: pieceCount }, (_, index) => index)
  let shuffled = [...pieces]
  do {
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1))
      ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
    }
  } while (shuffled.every((piece, index) => piece === index) || shuffled.every((piece, index) => piece === previous[index]))
  return shuffled
}
