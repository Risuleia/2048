export default function gameWin(gameBoard, instance) {
    gameBoard.setAttibute('game-state', 'win')
    gameBoard.getElementById('win').addEventListener('click', () => {
        instance.state = 'continuing'
        gameBoard.setAttribute('game-state', 'continuing')
    })
}