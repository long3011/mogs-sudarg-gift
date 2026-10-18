import { useEffect, useRef, useState } from 'react'
import { gallery, puzzleImage } from './data/gallery'
import { createPuzzleSize, createShuffledPieces, DEFAULT_COLUMNS, DEFAULT_ROWS, MAX_DIMENSION, MIN_DIMENSION } from './data/puzzle'
import { cutPuzzlePieces } from './puzzle/cutPuzzlePieces'
import { Header } from './components/Header'
import { GallerySection } from './components/GallerySection'
import { PuzzleSection } from './components/PuzzleSection'

export function App() {
  const piecePaddingRatio = 28 / 240
  const [activeTab, setActiveTab] = useState('gallery')
  const [image, setImage] = useState(puzzleImage)
  const [imageAspectRatio, setImageAspectRatio] = useState(1.5)
  const [size, setSize] = useState(() => createPuzzleSize(DEFAULT_ROWS, DEFAULT_COLUMNS))
  const [pile, setPile] = useState(() => createShuffledPieces(DEFAULT_ROWS * DEFAULT_COLUMNS))
  const [art, setArt] = useState([])
  const [board, setBoard] = useState({})
  const [groups, setGroups] = useState({})
  const [dragged, setDragged] = useState(null)
  const [moves, setMoves] = useState(0)
  const [solved, setSolved] = useState(false)
  const fileInput = useRef(null)

  useEffect(() => {
    let cancelled = false
    setArt([])
    const sourceImage = new Image()
    sourceImage.onload = () => {
      if (!cancelled) setImageAspectRatio(sourceImage.naturalWidth / sourceImage.naturalHeight)
    }
    sourceImage.src = image.image
    cutPuzzlePieces(image.image, size.rows, size.columns).then((pieces) => { if (!cancelled) setArt(pieces) }).catch(() => { if (!cancelled) setArt([]) })
    return () => { cancelled = true }
  }, [image.image, size])

  const start = (nextImage, nextSize = size) => {
    setImage(nextImage); setSize(nextSize); setPile(createShuffledPieces(nextSize.count, pile)); setBoard({}); setGroups({}); setMoves(0); setSolved(false); setActiveTab('puzzle')
  }

  const drop = (event, boardElement) => {
    event.preventDefault()
    if (dragged === null || !boardElement || art.length === 0) return
    const bounds = boardElement.getBoundingClientRect()
    const cellWidth = 100 / size.columns
    const cellHeight = 100 / size.rows
    const width = cellWidth * (1 + piecePaddingRatio * 2)
    const height = cellHeight * (1 + piecePaddingRatio * 2)
    const rawX = ((event.clientX - bounds.left) / bounds.width) * 100 - width / 2
    const rawY = ((event.clientY - bounds.top) / bounds.height) * 100 - height / 2
    const targetX = (dragged % size.columns) * cellWidth - cellWidth * piecePaddingRatio
    const targetY = Math.floor(dragged / size.columns) * cellHeight - cellHeight * piecePaddingRatio
    const snapped = Math.abs(rawX - targetX) < width * .35 && Math.abs(rawY - targetY) < height * .35
    const minX = -cellWidth * piecePaddingRatio
    const minY = -cellHeight * piecePaddingRatio
    const maxX = 100 - width + cellWidth * piecePaddingRatio
    const maxY = 100 - height + cellHeight * piecePaddingRatio
    const position = { x: Math.max(minX, Math.min(maxX, snapped ? targetX : rawX)), y: Math.max(minY, Math.min(maxY, snapped ? targetY : rawY)), snapped }
    const currentGroup = groups[dragged] || [dragged]
    const old = board[dragged]
    const delta = old ? { x: position.x - old.x, y: position.y - old.y } : { x: 0, y: 0 }
    const nextBoard = { ...board }
    currentGroup.forEach((piece) => { nextBoard[piece] = piece === dragged ? position : { ...board[piece], x: board[piece].x + delta.x, y: board[piece].y + delta.y } })
    const nextGroups = { ...groups }
    if (snapped) {
      const neighbors = Object.keys(board).map(Number).filter((piece) => !currentGroup.includes(piece) && board[piece].snapped && ((Math.floor(piece / size.columns) === Math.floor(dragged / size.columns) && Math.abs(piece - dragged) === 1) || (piece % size.columns === dragged % size.columns && Math.abs(piece - dragged) === size.columns)))
      const merged = [...new Set([...currentGroup, ...neighbors, ...neighbors.flatMap((piece) => groups[piece] || [])])]
      merged.forEach((piece) => { nextGroups[piece] = merged })
    }

    setBoard(nextBoard); setGroups(nextGroups); setPile((current) => current.filter((piece) => piece !== dragged)); if (snapped) setMoves((count) => count + 1); setDragged(null)
    if (snapped && Object.values(nextBoard).filter((piece) => piece.snapped).length === size.columns * size.rows) setSolved(true)
  }

  const returnToPile = (event) => {
    event.preventDefault()
    if (dragged === null) return
    const currentGroup = groups[dragged] || [dragged]
    const canReturn = currentGroup.every((piece) => board[piece] && !board[piece].snapped)
    if (!canReturn) {
      setDragged(null)
      return
    }
    setBoard((current) => {
      const next = { ...current }
      currentGroup.forEach((piece) => { delete next[piece] })
      return next
    })
    setGroups((current) => {
      const next = { ...current }
      currentGroup.forEach((piece) => { delete next[piece] })
      return next
    })
    setPile((current) => [...new Set([...current, ...currentGroup])])
    setDragged(null)
  }

  const upload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    start({ id: `upload-${Date.now()}`, title: file.name.replace(/\.[^/.]+$/, '') || 'Your picture', message: 'A puzzle made from a memory on your device.', image: URL.createObjectURL(file) })
    event.target.value = ''
  }

  const closeSolved = () => setSolved(false)

  return <main className="app-shell">
    <Header activeTab={activeTab} onTabChange={setActiveTab} />
    {activeTab === 'gallery' ? <GallerySection gallery={gallery} onMakePuzzle={start} />
     : <PuzzleSection state={{ image, imageAspectRatio, size, pile, art, board, groups, dragged, moves, solved }} actions={{ start, drop, returnToPile, closeSolved, setDragged, upload, setSize: (rows, columns) => start(image, createPuzzleSize(rows, columns)), fileInput, minDimension: MIN_DIMENSION, maxDimension: MAX_DIMENSION, gallery }} />}
      </main>
}
