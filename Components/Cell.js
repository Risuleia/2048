import Score from "./Score.js"

export default class Cell {
    #cellElement
    #x
    #y
    #tile
    #mergeTile

    constructor(cellElement, x, y) {
        this.#cellElement = cellElement
        this.#x = x
        this.#y = y
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
        if (!value) return
        this.#tile.x = this.#x
        this.#tile.y = this.#y
    }

    get mergeTile() {
        return this.#mergeTile
    }
    set mergeTile(value) {
        this.#mergeTile = value
        if (!value) return
        this.#mergeTile.x = this.#x
        this.#mergeTile.y = this.#y
    }

    canAccept(tile) {
        return (!this.tile || (!this.mergeTile && this.tile.value === tile.value))
    }

    mergeTiles(scores) {
        if (!this.tile || !this.mergeTile) return
        let v = this.tile.value + this.mergeTile.value
        this.tile.value = v
        scores.increaseScore(v)
        this.mergeTile.remove()
        this.mergeTile = null
    }

}