import { useRef, useState } from 'react'

export function PuzzleSection({ state, actions }) {
  const boardRef = useRef(null)
  const puzzleLayoutRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { image, imageAspectRatio, size, pile, art, board, groups, dragged, moves, solved } = state
  const { setDragged, drop, returnToPile, closeSolved, start, upload, setSize, fileInput } = actions
  const piecePaddingRatio = 28 / 240
  const pieceWidth = (100 / size.columns) * (1 + piecePaddingRatio * 2)
  const pieceHeight = (100 / size.rows) * (1 + piecePaddingRatio * 2)
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await puzzleLayoutRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }
  return <section className="puzzle-section">
    <div className="section-heading"><div><span className="kicker">Your birthday gift</span><h2>Piece together a gift.</h2></div><p>Choose a memory, set the difficulty,<br />then reveal the picture piece by piece.</p></div>
    <div className={`puzzle-layout ${isFullscreen ? 'puzzle-fullscreen' : ''}`} ref={puzzleLayoutRef}><div className="puzzle-panel">
      <button className="fullscreen-button" onClick={toggleFullscreen}>{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} <span>{isFullscreen ? '↙' : '↗'}</span></button>
      <div className="puzzle-meta"><span>{image.title}</span><span>{moves} {moves === 1 ? 'piece' : 'pieces'} snapped</span></div>
      <div className="puzzle-board" ref={boardRef} style={{ '--board-ratio': imageAspectRatio }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, boardRef.current)} aria-label="Free-form jigsaw puzzle table">
        <div className="board-hint">drag pieces here</div>
        {solved ? <div className="completed-image"><img src={image.image} alt={`Completed ${image.title} puzzle`} /></div>
          : Object.entries(board).map(([pieceId, position]) => <div className={`free-piece ${position.snapped ? 'snapped' : ''}`} key={`${image.id}-board-piece-${pieceId}`} draggable={!position.snapped} onDragStart={() => setDragged(Number(pieceId))} onDragEnd={() => setDragged(null)} style={{ '--piece-width': `${pieceWidth}%`, '--piece-height': `${pieceHeight}%`, left: `${position.x}%`, top: `${position.y}%`, backgroundImage: art[Number(pieceId)] ? `url("${art[Number(pieceId)].src}")` : 'none', backgroundSize: '100% 100%' }} aria-label={`Placed puzzle piece ${Number(pieceId) + 1}`} />)}
      </div>
      <div className="puzzle-help">{solved ? 'You found every place for every piece.' : 'Misses stay wherever you drop them. Close is close enough.'}<button onClick={() => start(image)}>Shuffle again ↻</button></div>
    </div><aside className="chooser">
      <div className="size-picker"><span className="choose-title">Puzzle dimensions</span><div className="row-column-input"><label htmlFor="puzzle-rows">Rows<input id="puzzle-rows" type="number" min={actions.minDimension} max={actions.maxDimension} value={size.rows} onChange={(event) => setSize(Number(event.target.value) || actions.minDimension, size.columns)} /></label><span>×</span><label htmlFor="puzzle-columns">Columns<input id="puzzle-columns" type="number" min={actions.minDimension} max={actions.maxDimension} value={size.columns} onChange={(event) => setSize(size.rows, Number(event.target.value) || actions.minDimension)} /></label></div><p className="piece-count-help">{size.rows * size.columns} pieces total · {actions.minDimension}–{actions.maxDimension} per dimension</p></div>
      <div className="piece-pile"><div className="choose-title">Piece pile <span>{pile.length} remaining</span></div><div className="pile-grid" onDragOver={(event) => event.preventDefault()} onDrop={returnToPile} style={{ '--columns': size.columns }}>{pile.map((piece) => <button className="pile-piece" draggable={!solved && art.length > 0} key={`${image.id}-piece-${piece}`} onDragStart={() => setDragged(piece)} onDragEnd={() => setDragged(null)} aria-label={`Puzzle piece ${piece + 1}`} style={{ backgroundImage: art[piece] ? `url("${art[piece].src}")` : 'none', backgroundSize: '100% 100%' }} />)}{pile.length === 0 && <span className="pile-empty">Drop pieces here to return them to the pile</span>}</div><p className="pile-tip">Unsnapped pieces can be returned here.</p></div>
      <div className="upload-box"><span className="upload-icon">＋</span><strong>Add a personal surprise</strong><p>Choose a picture from your device and wrap it into a birthday puzzle.</p><button onClick={() => fileInput.current?.click()}>Choose a picture <span>↗</span></button><input ref={fileInput} type="file" accept="image/*" onChange={upload} hidden /></div>
      <div className="choose-title"><span>Or choose from the gallery</span></div><div className="mini-gallery">{actions.gallery.map((item) => <button key={item.id} className={image.id === item.id ? 'mini-card selected-mini' : 'mini-card'} onClick={() => start(item)}><img src={item.image} alt="" /><span>{item.title}</span></button>)}</div>
    </aside></div>
  </section>
}
