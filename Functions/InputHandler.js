const GESTURE_TIME = 500
const THRESHOLD_DIST = 60

export default class InputHandler {
    #callback
    #boundKeyboardInput
    #boundTouchStart
    #gridElem

    constructor(callback, gridElem) {
        this.#gridElem = gridElem
        this.#boundKeyboardInput = this.#handleKeyboardInput.bind(this)
        this.#boundTouchStart = this.#handleTouchStart.bind(this)
        this.#callback = callback
    }

    setupInput() {
        window.addEventListener('keydown', this.#boundKeyboardInput, { once: true })
        document.body.addEventListener('touchmove', this.#boundTouchStart, { once: true, passive: false })
    }

    stopInput() {
        window.removeEventListener('keydown', this.#boundKeyboardInput)
        document.body.removeEventListener('touchstart', this.#boundTouchStart)
    }

    async #handleKeyboardInput(e) {
        this.stopInput()
        await this.#callback(e.key)
        this.setupInput()
    }

    #handleTouchStart(e) {
        this.stopInput()
        e.preventDefault()

        const startTouch = e.changedTouches[0]
        const startTime = new Date()

        document.body.addEventListener('touchmove', handleTouch, { passive: false })

        document.body.addEventListener('touchend', async e => {

            const endTouch = e.changedTouches[0]
            if (new Date() - startTime > GESTURE_TIME) {
                this.setupInput()
                return
            }
    
            const distX = endTouch.pageX - startTouch.pageX
            const distY = endTouch.pageY - startTouch.pageY

            if (Math.abs(distX) >= THRESHOLD_DIST) {
                await this.#callback(distX > 0 ? "d" : "a")
            }
            if (Math.abs(distY) >= THRESHOLD_DIST) {
                await this.#callback(distY > 0 ? "s" : "w")
            }
            this.setupInput()
        }, { once: true })

    }
}

function handleTouch(e) {
    e.preventDefault()
}