import Cell from "./Cell.js"

const GRID_SIZE = 4
const CELL_SIZE = 19
const CELL_GAP = 2

export default class Grid {
    #cells

    constructor(gridElement) {

        gridElement.style.setProperty('--grid-size', GRID_SIZE)
        gridElement.style.setProperty('--cell-size', `${CELL_SIZE}vmin`)
        gridElement.style.setProperty('--cell-gap', `${CELL_GAP}vmin`)
        this.#cells = createCellElements(gridElement).map((cellElement, index) => {
            return new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE))
        })
    }

    get cells() {
        return this.#cells
    }

    get cellsByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || []
            cellGrid[cell.x][cell.y] = cell
            return cellGrid
        }, [])
    }
    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || []
            cellGrid[cell.y][cell.x] = cell
            return cellGrid
        }, [])
    }

    get #emptyCells() {
        return this.#cells.filter(cell => !cell.tile)
    }

    randomEmptyCell() {
        const randI = Math.floor(Math.random() * this.#emptyCells.length)
        return this.#emptyCells[randI]
    }

    // handling tile move 
    moveUp() {
        return this.#slideTiles(this.cellsByColumn)
    }
    moveDown() {
        return this.#slideTiles(this.cellsByColumn.map(column => [...column].reverse()))
    }
    moveLeft() {
        return this.#slideTiles(this.cellsByRow)
    }
    moveRight() {
        return this.#slideTiles(this.cellsByRow.map(row => [...row].reverse()))
    }

    #slideTiles(cells) {
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

    // handling movement check
    canMoveTilesInAnyDirection(instance) {
        return (
            this.canMoveUp(instance) ||
            this.canMoveLeft(instance) ||
            this.canMoveDown(instance) ||
            this.canMoveRight(instance)
        )
    }
    
    canMoveUp() {
        return this.#canMove(this.cellsByColumn)
    }
    canMoveDown() {
        return this.#canMove(this.cellsByColumn.map(column => [...column].reverse()))
    }
    canMoveLeft() {
        return this.#canMove(this.cellsByRow)
    }
    canMoveRight() {
        return this.#canMove(this.cellsByRow.map(row => [...row].reverse()))
    }
    
    #canMove(cells) {
        return cells.some(group => {
            return group.some((cell, i) => {
                if (i === 0) return false
                if (!cell.tile) return false
                const moveToCell = group[i - 1]
                return moveToCell.canAccept(cell.tile)
            })
        })
    }

}

function createCellElements(gridElement) {
    const cells = []
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cells.push(cell)
        gridElement.append(cell)
        
    }
    return cells
}