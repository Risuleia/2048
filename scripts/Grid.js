// global variables
const GRID_SIZE = 4
const CELL_SIZE = 16
const CELL_GAP = 2

// grid class
export default class Grid {
  #cells

  constructor(gridElem) {
    gridElem.style.setProperty("--grid-size", GRID_SIZE)
    gridElem.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
    gridElem.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)
    this.#cells = createCellElements(gridElem).map((cellElem, index) => {
      return new Cell(
        cellElem,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      )
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

  get #empty() {
    return this.#cells.filter((cell) => cell.tile == null)
  }

  randomCellCreation() {
    const randomIndex = Math.floor(Math.random() * this.#empty.length)
    return this.#empty[randomIndex]
  }
}

class Cell {
  #cellElem
  #x
  #y
  #tile
  #mergeTile

  constructor(cellElem, x, y) {
    this.#cellElem = cellElem
    this.#x = x
    this.#y = y
  }

  get cellElem() {
    return this.#cellElem
  }

  get x() {
    return this.#x
  }
  get y() {
    return this.#y
  }

  get tile() {
    return this.#tile
  }
  set tile(value) {
    this.#tile = value
    if (value == null) return
    this.#tile.x = this.#x
    this.#tile.y = this.#y
  }

  get mergeTile() {
    return this.#mergeTile
  }
  set mergeTile(value) {
    this.#mergeTile = value
    if (value == null) return
    this.#mergeTile.x = this.#x
    this.#mergeTile.y = this.#y
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    )
  }
  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return
    this.tile.value = this.tile.value + this.mergeTile.value
    this.mergeTile.remove()
    this.mergeTile = null
  }
}

function createCellElements(gridElem) {
  const cells = []
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cells.push(cell)
    gridElem.append(cell)
  }
  return cells
}
