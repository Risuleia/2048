import Grid from "./scripts/Grid.js"
import Tile from "./scripts/Tile.js"
import Score from "./scripts/Score.js"

const gameBoard = document.getElementById('game-board')
const scoreBoard = document.getElementById('score-board')

const grid = new Grid(gameBoard)
const score = new Score(scoreBoard)
grid.randomCellCreation().tile = new Tile(gameBoard)
grid.randomCellCreation().tile = new Tile(gameBoard)
setInput()

function setInput() {
  window.addEventListener('keydown', handleInput, {
    once: true
  })
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp) {
        return
        setInput()
      }
      await moveUp()
      break
    case "ArrowDown":
      if (!canMoveDown) {
        return
        setInput()
      }
      await moveDown()
      break
    case "ArrowRight":
      if (!canMoveRight) {
        return
        setInput()
      }
      await moveRight()
      break
    case "ArrowLeft":
      if (!canMoveLeft) {
        return
        setInput()
      }
      await moveLeft()
      break
    default:
      setInput()
      return
  }

  grid.cells.forEach(cell => cell.mergeTiles())
  grid.cells.filter(cell => cell.tile)
    .forEach(cell => {
      score.increment(cell.tile.value)
      document.querySelector('.score').textContent = score.value
    })
  const newTile = new Tile(gameBoard)
  grid.randomCellCreation().tile = newTile

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.awaitTransition(true)
      .then(() => {
        alert("You lost!")
      })
      .then(() => {
        grid.cells.forEach(cell => {
          [...gameBoard.childNodes].forEach(child => child.remove())
          cell.tile = null
        })
        score.reset()
        document.querySelector('.score').textContent = score.value
        const newGrid = new Grid(gameBoard)
        const newScore = new Score(scoreBoard)
        newGrid.randomCellCreation().tile = new Tile(gameBoard)
        newGrid.randomCellCreation().tile = new Tile(gameBoard)
        setInput()
      })
    return
  }
  setInput()
}

function moveUp() {
  return slideTiles(grid.cellsByColumn)
}
function moveDown() {
  return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}
function moveLeft() {
  return slideTiles(grid.cellsByRow)
}
function moveRight() {
  return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap(group => {
      const promises = []
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let lastValidCell
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j]
          if (!moveToCell.canAccept(cell.tile)) break
          lastValidCell = moveToCell
        }
        if (lastValidCell != null) {
          promises.push(cell.tile.awaitTransition())
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile
          } else {
            lastValidCell.tile = cell.tile
          }
          cell.tile = null
        }
      }
      return promises
    })
  )
}

function canMoveUp() {
  return movementScope(grid.cellsByColumn)
}
function canMoveDown() {
  return movementScope(grid.cellsByColumn.map(column => [...column].reverse()))
}
function canMoveLeft() {
  return movementScope(grid.cellsByRow)
}
function canMoveRight() {
  return movementScope(grid.cellsByRow.map(row => [...row].reverse()))
}
function movementScope(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) return false
      if (cell.tile == null) return false
      const moveToCell = group[index - 1]
      return moveToCell.canAccept(cell.tile)
    })
  })
}

window.onbeforeunload = function(event) {
    var message = 'You might lose your game progress!';
    if (typeof event == 'undefined') {
        event = window.event;
    }
    if (event) {
        event.returnValue = message;
    }
    return message;
}
