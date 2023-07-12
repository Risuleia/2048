import Grid from "./Grid.js";
import Score from "./Score.js";
import Tile from "./Tile.js";

export default class Instance {
    #grid
    #score
    #state

    constructor(gridElem, scoreElem) {
        this.gridElem = gridElem
        this.scoreElem = scoreElem

        this.#grid = new Grid(gridElem)
        this.#grid.randomEmptyCell().tile = new Tile(gridElem)
        this.#grid.randomEmptyCell().tile = new Tile(gridElem)

        this.#score = new Score(scoreElem)
    }


    get grid() {
        return this.#grid
    }
    get score() {
        return this.#score
    }
    set grid(val) {
        this.#grid?.cells.forEach(cell => cell.tile?.remove())
        this.#grid = val
    }
    set score(val) {
        this.#score.score = 0
        this.#score.elem.textContent = 0
        this.#score = val
    }

    get state() {
        return this.#state
    }
    set state(v) {
        this.#state = v
    }

    end() {
        this.grid = null
        this.score = null
    }

}