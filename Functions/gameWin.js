export default function gameWin(gameBoard, instance, inputHandler) {
    gameBoard.setAttribute('game-state', 'win')
    gameBoard.querySelector('#win').addEventListener('click', () => {
        instance.state = 'continuing'
        gameBoard.setAttribute('game-state', 'continuing')
        inputHandler.setupInput()
    })
}