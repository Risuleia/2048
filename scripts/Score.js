// global variables
const INITIAL = 0
const MULTI = 2

export default class Score {
  #value

  constructor(elem) {
    this.#value = INITIAL
    const scoreValue = createScore(elem, this.#value)
  }

  get value() {
    return this.#value
  }
  set value(v) {
    if (!v || isNaN((parseInt(v)))) return
    this.#value = v
  }

  increment(v) {
    return this.#value += Math.floor(v)
  }
  reset() {
    return this.#value = INITIAL
  }
}

function createScore(scoreElem, value) {
  const score = document.createElement('div')
  score.classList.add('score')
  score.textContent = value
  scoreElem.append(score)
}
