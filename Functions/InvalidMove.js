export default class InvalidMove extends Error {
    constructor(...params) {
        super(...params)

        this.name = "InvalidMoveError"
    }
}