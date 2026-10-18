function edgeValue(row, column, side, rows, columns) {
  if ((side === 'top' && row === 0) || 
  (side === 'left' && column === 0) || 
  (side === 'right' && column === columns - 1) || 
  (side === 'bottom' && row === rows - 1)) return 0
  const boundary = side === 'top' || side === 'bottom' ? row : column
  return (row + column + boundary + (side === 'left' || side === 'right' ? 1 : 0)) % 2 === 0 ? 1 : -1
}

function drawEdge(path, x, y, length, direction, tab, radius) {
  const middle = length / 2
  const bump = tab * radius
  if (!tab) return direction === 'horizontal' ? path.lineTo(x + length, y) : path.lineTo(x, y + length)
  if (direction === 'horizontal') {
    path.lineTo(x + middle - radius, y)
    path.quadraticCurveTo(x + middle - radius * .75, y, x + middle - radius * .5, y - bump * .35)
    path.bezierCurveTo(x + middle - radius * .55, y - bump, x + middle + radius * .55, y - bump, x + middle + radius * .5, y - bump * .35)
    path.quadraticCurveTo(x + middle + radius * .75, y, x + middle + radius, y)
    path.lineTo(x + length, y)
  } else {
    path.lineTo(x, y + middle - radius)
    path.quadraticCurveTo(x, y + middle - radius * .75, x - bump * .35, y + middle - radius * .5)
    path.bezierCurveTo(x - bump, y + middle - radius * .55, x - bump, y + middle + radius * .55, x - bump * .35, y + middle + radius * .5)
    path.quadraticCurveTo(x, y + middle + radius * .75, x, y + middle + radius)
    path.lineTo(x, y + length)
  }
}

export async function cutPuzzlePieces(imageUrl, rows, columns) {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.src = imageUrl
  await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject })
  const sourceRatio = image.naturalWidth / image.naturalHeight
  const targetRatio = columns / rows
  const sourceWidth = sourceRatio > targetRatio ? image.naturalHeight * targetRatio : image.naturalWidth
  const sourceHeight = sourceRatio > targetRatio ? image.naturalHeight : image.naturalWidth / targetRatio
  const sourceX = (image.naturalWidth - sourceWidth) / 2
  const sourceY = (image.naturalHeight - sourceHeight) / 2
  const cell = 240
  const radius = 28
  return Promise.all(Array.from({ length: rows * columns }, (_, piece) => {
    const row = Math.floor(piece / columns)
    const column = piece % columns
    const canvas = document.createElement('canvas')
    canvas.width = cell + radius * 2
    canvas.height = cell + radius * 2
    const context = canvas.getContext('2d')
    const path = new Path2D()
    path.moveTo(radius, radius)
    drawEdge(path, radius, radius, cell, 'horizontal', -edgeValue(row, column, 'top', rows, columns), radius)
    drawEdge(path, radius + cell, radius, cell, 'vertical', edgeValue(row, column, 'right', rows, columns), radius)
    drawEdge(path, radius + cell, radius + cell, cell, 'horizontal', edgeValue(row, column, 'bottom', rows, columns), radius)
    drawEdge(path, radius, radius + cell, cell, 'vertical', -edgeValue(row, column, 'left', rows, columns), radius)
    path.closePath()
    context.save()
    context.clip(path)
    context.drawImage(image, sourceX + sourceWidth * column / columns - sourceWidth / columns * radius / cell, sourceY + sourceHeight * row / rows - sourceHeight / rows * radius / cell, sourceWidth / columns * (1 + radius * 2 / cell), sourceHeight / rows * (1 + radius * 2 / cell), radius, radius, cell + radius * 2, cell + radius * 2)
    context.restore()
    return { id: piece, src: canvas.toDataURL('image/png') }
  }))
}
