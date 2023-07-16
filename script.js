import Tile from "./Components/Tile.js"
import Instance from "./Components/Instance.js"
import InputHandler from "./Functions/InputHandler.js"
import InvalidMoveError from "./Functions/InvalidMoveError.js"

const gameBoard = document.getElementById("game-board")
const scoreBoard = document.querySelector('.scores')

const restart_btn = document.querySelector('.restart')

let instance = new Instance(gameBoard, scoreBoard)

// handle input
const inputHandler = new InputHandler(handleInput, gameBoard)
inputHandler.setupInput()

async function handleInput(dir) {
    try {
        await moveTiles(dir)
    } catch (e) {
        if (e instanceof InvalidMoveError) {
            if (instance.grid.canMoveTilesInAnyDirection()) inputHandler.setupInput()
            return
        }
        throw e
    }

    instance.grid.cells.forEach(cell => cell.mergeTiles(instance.score))

    const newTile = new Tile(gameBoard)
    instance.grid.randomEmptyCell().tile = newTile

    if (!instance.grid.canMoveTilesInAnyDirection(instance)) {
        newTile.waitForTransition(true).then(() => {
            inputHandler.stopInput()
            
            gameBoard.setAttribute('game-state', 'lose')
            gameBoard.querySelector('#lose').addEventListener('click', () => {
                instance.state = 'lose'
                instance.end()
                gameBoard.removeAttribute('game-state')
                instance = new Instance(gameBoard, scoreBoard)
                inputHandler.setupInput()
            })
        })
    } else if (instance.grid.canMoveTilesInAnyDirection(instance)) inputHandler.setupInput()
    if (
        (instance.state !== "lose" && instance.state !== "continuing") &&
        instance.grid.cells.some(cell => cell?.tile?.value === "2048" || cell?.mergeTile?.value === "2048")
        ) {
        newTile.waitForTransition(true).then(() => {
            inputHandler.stopInput()
            gameWin(gameBoard, instance, inputHandler)
        })
        restart_btn.removeEventListener('click')
        restart_btn.addEventListener('click', () => {
            gameBoard.removeAttribute('game-state')
            instance.state = null
            instance.end()
            instance = new Instance(gameBoard, scoreBoard)
            inputHandler.setupInput(instance)
        })
    }

}

async function moveTiles(dir) {
    switch (dir) {
        case "ArrowUp":
        case "w":
            if (!instance.grid.canMoveUp()) throw new InvalidMoveError()
            await instance.grid.moveUp()
            return;
        case "ArrowDown":
        case "s":
            if (!instance.grid.canMoveDown()) throw new InvalidMoveError()
            await instance.grid.moveDown()
            return;
        case "ArrowLeft":
        case "a":
            if (!instance.grid.canMoveLeft()) throw new InvalidMoveError()
            await instance.grid.moveLeft()
            return;
        case "ArrowRight":
        case "d":
            if (!instance.grid.canMoveRight()) throw new InvalidMoveError()
            await instance.grid.moveRight()
            return;
    
        default:
            throw new InvalidMoveError()
    }
}

// restart button
restart_btn.addEventListener('click', () => {
    gameBoard.removeAttribute('game-state')
    instance.state = null
    instance.end()
    instance = new Instance(gameBoard, scoreBoard)
    inputHandler.setupInput(instance)
})

// utility functions
function gameOver(gameBoard, scoreBoard, instance, inputHandler) {
    gameBoard.setAttribute('game-state', 'lose')
    gameBoard.querySelector('#lose').addEventListener('click', () => {
        instance.state = 'lose'
        instance.end()
        gameBoard.removeAttribute('game-state')
        inputHandler.setupInput()
    })
}
function gameWin(gameBoard, instance, inputHandler) {
    gameBoard.setAttribute('game-state', 'win')
    gameBoard.querySelector('#win').addEventListener('click', () => {
        instance.state = 'continuing'
        gameBoard.setAttribute('game-state', 'continuing')
        inputHandler.setupInput()
    })
}

// document.querySelector('.button').addEventListener('click', () => {
//     const new_tile = new Tile(gameBoard)
//     new_tile.value = "2048"
//     instance.grid.randomEmptyCell().tile = new_tile 
// })