function horizontalSeam(seamRow, column, rows) {
  if (seamRow === 0 || seamRow === rows) return 0
  return (seamRow * 31 + column * 17) % 2 === 0 ? 1 : -1
}

function verticalSeam(row, seamColumn, columns) {
  if (seamColumn === 0 || seamColumn === columns) return 0
  return (row * 17 + seamColumn * 31) % 2 === 0 ? 1 : -1
}

function drawHorizontal(path, startX, y, length, direction, outward, radius) {
  if (!outward) {
    path.lineTo(startX + direction * length, y)
    return
  }
  const middle = length / 2
  const first = startX + direction * (middle - radius)
  const second = startX + direction * (middle + radius)
  const bump = outward * radius
  path.lineTo(first, y)
  path.quadraticCurveTo(
    startX + direction * (middle - radius * .75),
    y,
    startX + direction * (middle - radius * .5),
    y + bump * .35,
  )
  path.bezierCurveTo(
    startX + direction * (middle - radius * .55),
    y + bump,
    startX + direction * (middle + radius * .55),
    y + bump,
    startX + direction * (middle + radius * .5),
    y + bump * .35,
  )
  path.quadraticCurveTo(startX + direction * (middle + radius * .75), y, second, y)
  path.lineTo(startX + direction * length, y)
}

function drawVertical(path, x, startY, length, direction, outward, radius) {
  if (!outward) {
    path.lineTo(x, startY + direction * length)
    return
  }
  const middle = length / 2
  const first = startY + direction * (middle - radius)
  const second = startY + direction * (middle + radius)
  const bump = outward * radius
  path.lineTo(x, first)
  path.quadraticCurveTo(
    x,
    startY + direction * (middle - radius * .75),
    x + bump * .35,
    startY + direction * (middle - radius * .5),
  )
  path.bezierCurveTo(
    x + bump,
    startY + direction * (middle - radius * .55),
    x + bump,
    startY + direction * (middle + radius * .55),
    x + bump * .35,
    startY + direction * (middle + radius * .5),
  )
  path.quadraticCurveTo(x, startY + direction * (middle + radius * .75), x, second)
  path.lineTo(x, startY + direction * length)
}

function drawPiecePath(row, column, rows, columns, cell, padding, radius) {
  const left = padding
  const top = padding
  const right = padding + cell
  const bottom = padding + cell
  const path = new Path2D()
  path.moveTo(left, top)
  const topSeam = horizontalSeam(row, column, rows)
  const bottomSeam = horizontalSeam(row + 1, column, rows)
  const leftSeam = verticalSeam(row, column, columns)
  const rightSeam = verticalSeam(row, column + 1, columns)
  drawHorizontal(path, left, top, cell, 1, topSeam, radius)
  drawVertical(path, right, top, cell, 1, rightSeam, radius)
  drawHorizontal(path, right, bottom, cell, -1, bottomSeam, radius)
  drawVertical(path, left, bottom, cell, -1, leftSeam, radius)
  path.closePath()
  return path
}

export async function cutPuzzlePieces(imageUrl, rows, columns) {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.src = imageUrl
  await new Promise((resolve, reject) => {
    image.onload = resolve
    image.onerror = reject
  })

  const sourceWidth = image.naturalWidth
  const sourceHeight = image.naturalHeight
  const sourceX = 0
  const sourceY = 0
  const cell = 240
  const radius = 28
  const padding = radius
  return Array.from({ length: rows * columns }, (_, piece) => {
    const row = Math.floor(piece / columns)
    const column = piece % columns
    const canvas = document.createElement('canvas')
    canvas.width = cell + padding * 2
    canvas.height = cell + padding * 2
    const context = canvas.getContext('2d')
    const path = drawPiecePath(row, column, rows, columns, cell, padding, radius)
    context.save()
    context.clip(path)
    context.drawImage(
      image,
      sourceX + sourceWidth * column / columns - sourceWidth / columns * padding / cell,
      sourceY + sourceHeight * row / rows - sourceHeight / rows * padding / cell,
      sourceWidth / columns * (1 + padding * 2 / cell),
      sourceHeight / rows * (1 + padding * 2 / cell),
      0,
      0,
      canvas.width,
      canvas.height,
    )
    context.restore()
    return { id: piece, src: canvas.toDataURL('image/png') }
  })
}