import Grid from "./Components/Grid.js"
import Tile from "./Components/Tile.js"
import Score from "./Components/Score.js"
import Instance from "./Components/Instance.js"

const gameBoard = document.getElementById("game-board")
const scoreBoard = document.querySelector('.scores')

let instance = new Instance(gameBoard, scoreBoard)

// const grid = new Grid(gameBoard)
// grid.randomEmptyCell().tile = new Tile(gameBoard)
// grid.randomEmptyCell().tile = new Tile(gameBoard)
setupInput(instance)

// const scores = new Score(scoreBoard)

function setupInput(instance) {
    window.addEventListener('keydown', (e) => handleInput(e, instance), { once: true })
}

async function handleInput(e, instance) {
    switch (e.key) {
        case "ArrowUp":
            if (!canMoveUp(instance)) {
                setupInput(instance)
                return
            }
            await moveUp(instance)
            break;
        case "ArrowDown":
            if (!canMoveDown(instance)) {
                setupInput(instance)
                return
            }
            await moveDown(instance)
            break;
        case "ArrowLeft":
            if (!canMoveLeft(instance)) {
                setupInput(instance)
                return
            }
            await moveLeft(instance)
            break;
        case "ArrowRight":
            if (!canMoveRight(instance)) {
                setupInput(instance)
                return
            }
            await moveRight(instance)
            break;
    
        default:
            setupInput(instance)
            return;
    }

    instance.grid.cells.forEach(cell => cell.mergeTiles(instance.score))

    const newTile = new Tile(gameBoard)
    instance.grid.randomEmptyCell().tile = newTile

    if (!canMoveUp(instance) && !canMoveDown(instance) && !canMoveLeft(instance) && !canMoveRight(instance)) {
        newTile.waitForTransition(true).then(() => {
            gameBoard.setAttribute('game-state', "lose")
            gameBoard.querySelector('#lose').addEventListener('click', () => {
                instance.state = "lose"
                instance.end()
                gameBoard.removeAttribute('game-state')
                instance = new Instance(gameBoard, scoreBoard)
                setupInput(instance)
            })
        })
        return
    }
    if (
        (instance.state !== "lose" && instance.state !== "continuing") &&
        instance.grid.cells.some(cell => cell?.tile?.value === "2048" || cell?.mergeTile?.value === "2048")
        ) {
        newTile.waitForTransition(true).then(() => {
            gameBoard.setAttribute('game-state', "win")
            gameBoard.querySelector('#win').addEventListener('click', () => {
                instance.state = "continuing"
                gameBoard.setAttribute('game-state', "continuing")
                setupInput(instance)
            })
        })
        document.querySelector('.restart').removeEventListener('click')
        document.querySelector('.restart').addEventListener('click', () => {
            gameBoard.removeAttribute('game-state')
            instance.state = null
            instance.end()
            instance = new Instance(gameBoard, scoreBoard)
            setupInput(instance)
        })
        return
    }

    setupInput(instance)
}

function moveUp(instance) {
    return slideTiles(instance.grid.cellsByColumn)
}
function moveDown(instance) {
    return slideTiles(instance.grid.cellsByColumn.map(column => [...column].reverse()))
}
function moveLeft(instance) {
    return slideTiles(instance.grid.cellsByRow)
}
function moveRight(instance) {
    return slideTiles(instance.grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
    return Promise.all(
        cells.flatMap(group => {
            const promises = []
            for (let i = 1; i < group.length; i++) {
                const cell = group[i]
                if (!cell.tile) continue
                let lastValidCell

                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j]
                    if (!moveToCell.canAccept(cell.tile)) break
                    lastValidCell = moveToCell
                }

                if (lastValidCell) {
                    promises.push(cell.tile.waitForTransition())
                    if (lastValidCell.tile)  {
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

function canMoveUp(instance) {
    return canMove(instance.grid.cellsByColumn)
}
function canMoveDown(instance) {
    return canMove(instance.grid.cellsByColumn.map(column => [...column].reverse()))
}
function canMoveLeft(instance) {
    return canMove(instance.grid.cellsByRow)
}
function canMoveRight(instance) {
    return canMove(instance.grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false
            if (!cell.tile) return false
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile)
        })
    })
}

document.querySelector('.restart').addEventListener('click', () => {
    gameBoard.removeAttribute('game-state')
    instance.state = null
    instance.end()
    instance = new Instance(gameBoard, scoreBoard)
    setupInput(instance)
})

// document.querySelector('.button').addEventListener('click', () => {
//     const new_tile = new Tile(gameBoard)
//     new_tile.value = "2048"
//     instance.grid.randomEmptyCell().tile = new_tile 
// })