import './style.css'
import { BOARD_HEIGHT, BOARD_WIDTH, BLOCK_SIZE, EVENT_MOVEMENTS } from './consts.js'

// 1. Inicializar el canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const $score = document.querySelector('span')

let score = 0

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// 3. board
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)

function createBoard (width, height) {
  return Array(height).fill().map(() => Array(width).fill(0))
}

//4. pieza
const piece = {
  position: { x: 5, y: 0 },
  shape: [
    [1, 1],
    [1, 1]
  ]
}

// 9. random pieces
const PIECES = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  [
    [0, 1],
    [0, 1],
    [0, 1],
  ]
]

// 2. game loop
// function update () {
//   draw()
//   window.requestAnimationFrame(update)
// }

// 8. auto drop
let dropCounter = 0
let lastTime = 0

function update (time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if (dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0
  }

  if (checkCollision()) {
    piece.position.y--
    solidyPiece()
    removeRows()
  }

  draw()
  window.requestAnimationFrame(update)
}

function draw () {
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'red'
        context.fillRect(piece.position.x + x, piece.position.y + y, 1, 1)
      }
    })
  }) 

  $score.innerText = score
}

document.addEventListener('keydown', event => {
  if (event.key === EVENT_MOVEMENTS.LEFT) {
    piece.position.x--
    if (checkCollision()) {
      piece.position.x++
    }
  }

  if (event.key === EVENT_MOVEMENTS.RIGHT) {
    piece.position.x++
    if (checkCollision()) {
      piece.position.x--
    }
  }
  
  if (event.key === EVENT_MOVEMENTS.DOWN) {
    piece.position.y++
    if (checkCollision()) {
      piece.position.y--
      solidyPiece()
      removeRows()
    }
  }

  if (event.key === 'ArrowUp') {
    const rotated = []
    
    for (let i = 0; i < piece.shape[0].length; i++) {
      rotated.push([])

      for (let j = 0; j < piece.shape.length; j++) {
        rotated[i].unshift(piece.shape[j][i])
      }
    }

    const previousShape = piece.shape
    piece.shape = rotated

    if (checkCollision()) {
      piece.shape = previousShape
    }
  }
})

function checkCollision () {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        board[piece.position.y + y]?.[piece.position.x + x] !== 0
      )
    })
  })
}

function solidyPiece () {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })

  // reset position
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2)
  piece.position.y = 0

  // get random shape
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

  // game over
  if (checkCollision()) {
    window.alert('Game Over! 😭')
    board.forEach(row => row.fill(0))
  }
}

function removeRows () {
  const rowsToRemove = []

  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score += 10
  })
}

const $section = document.querySelector('section')

$section.addEventListener('click', () => {
  update()
  
  $section.remove()
  const audio = new Audio('public/tetris.mp3')
  audio.volume = 0.1
  audio.play()
})

