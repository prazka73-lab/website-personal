const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const themeToggle = document.getElementById('themeToggle');
const aiToggle = document.getElementById('aiToggle');
const message = document.getElementById('message');
const xScoreEl = document.getElementById('xScore');
const oScoreEl = document.getElementById('oScore');
let currentPlayer = '❌';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isAI = false;
let xScore = 0;
let oScore = 0;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Sound effects (replace with your audio files)
const clickSound = new Audio('sounds/click.mp3');
const winSound = new Audio('sounds/win.mp3');
const drawSound = new Audio('sounds/draw.mp3');

function playSound(sound) {
    sound.play().catch(() => {}); // Ignore errors if audio fails
}

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    playSound(clickSound);
    checkWinner();
    if (gameActive) {
        currentPlayer = currentPlayer === '❌' ? '⭕' : '❌';
        message.textContent = `Player ${currentPlayer}'s turn`;
        if (isAI && currentPlayer === '⭕') {
            setTimeout(aiMove, 500); // Delay for AI
        }
    }
}

function aiMove() {
    const emptyCells = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        cells[randomIndex].click();
    }
}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            message.textContent = `Player ${board[a]} wins!`;
            playSound(winSound);
            gameActive = false;
            if (board[a] === '❌') xScore++;
            else oScore++;
            updateScores();
            return;
        }
    }
    if (!board.includes('')) {
        message.textContent = 'It\'s a draw!';
        playSound(drawSound);
        gameActive = false;
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = '❌';
    gameActive = true;
    message.textContent = 'Player ❌\'s turn';
}

function updateScores() {
    xScoreEl.textContent = xScore;
    oScoreEl.textContent = oScore;
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

aiToggle.addEventListener('click', () => {
    isAI = !isAI;
    aiToggle.textContent = isAI ? 'Play vs Human' : 'Play vs AI';
    resetGame();
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);