export function gameOver(gameBoard, scoreBoard, instance, inputHandler) {
    gameBoard.setAttribute('game-state', 'lose')
    gameBoard.querySelector('#lose').addEventListener('click', () => {
        instance.state = 'lose'
        instance.end()
        gameBoard.removeAttribute('game-state')
        inputHandler.setupInput()
    })
}