export default class Score {
    #scoreElement
    #score

    constructor(scoreElement) {
        this.#scoreElement = scoreElement
        this.#score = 0
    }

    get elem() {
        return this.#scoreElement
    }

    get score() {
        return this.#score
    }
    set score(val) {
        // if (!val) return
        // if (isNaN(parseInt(val))) return
        this.#score = val
    }

    increaseScore(val) {
        if (!val) return
        if (isNaN(parseInt(val))) return
        // console.log(val)
        this.score = this.score + val
        console.log(this.score)
        this.elem.textContent = this.score + val
    }

}