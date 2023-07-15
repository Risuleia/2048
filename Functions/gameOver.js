export default function gameOver(gameBoard, instance) {
    gameBoard.setAttibute('game-state', 'lose')
    gameBoard.getElementById('lose').addEventListener('click', () => {
        instance.state = 'lose'
        instance.end()
        gameBoard.removeAttribute('game-state')
    })
}