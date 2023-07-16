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
        this.#scoreElement.textContent = val 
    }

    increaseScore(val) {
        if (!val) return
        if (isNaN(parseInt(val))) return
        this.score += val
    }

}