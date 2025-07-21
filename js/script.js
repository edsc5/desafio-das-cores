const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameBoard = document.getElementById('game-board');
const targetColorText = document.getElementById('target-color-text');
const feedbackMessage = document.getElementById('feedback-message');
const startButton = document.getElementById('start-button');

//CONSTANTES E VARIÁVEIS DE ESTADO DO JOGO
const GAME_DURATION = 10;
const COLORS = [
    { name: 'vermelho', value: '#E74C3C' },
    { name: 'verde', value: '#2ECC71' },
    { name: 'azul', value: '#3498DB' },
    { name: 'amarelo', value: '#F1C40F' }
];

let score = 0;
let timer = GAME_DURATION;
let timerId = null;
let gameActive = false;
let targetColor = {};

//FUNÇÕES DO JOGO
function startGame() {
    //Reset
    score = 0;
    timer = GAME_DURATION;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timer;
    gameActive = true;
    startButton.classList.remove('active');
    feedbackMessage.textContent = '';

    //Inicia o timer
    timerId = setInterval(updateTimer, 1000);

    generateRound();
}

function generateRound() {
    if (!gameActive) return;

    gameBoard.innerHTML = '';

    //Sorteia a cor alvo
    targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    targetColorText.textContent = `Clique na cor: ${targetColor.name}`;

    const squares = [];
    for (let i = 0; i < 9; i++) { //Loop
        const square = document.createElement('div');
        square.classList.add('color-square');
        
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        square.style.backgroundColor = randomColor.value;
        square.dataset.colorValue = randomColor.value;

        square.addEventListener('click', handleSquareClick);
        squares.push(square);
    }
    
    const hasTargetColor = squares.some(sq => sq.dataset.colorValue === targetColor.value);
    if (!hasTargetColor) {
        const randomIndex = Math.floor(Math.random() * squares.length);
        squares[randomIndex].style.backgroundColor = targetColor.value;
        squares[randomIndex].dataset.colorValue = targetColor.value;
    }

    squares.forEach(square => gameBoard.appendChild(square));
}

function handleSquareClick(event) {
    if (!gameActive) return;

    const clickedColor = event.target.dataset.colorValue;

    if (clickedColor === targetColor.value) {
        score += 5;
        showFeedback('Acertou!', 'success');
    } else {
        score -= 2;
        showFeedback('Errou!', 'error');
    }

    scoreDisplay.textContent = score;
    generateRound();
}

function showFeedback(message, type) {
    feedbackMessage.textContent = message;
    feedbackMessage.className = type === 'success' ? 'feedback-success' : 'feedback-error';

    setTimeout(() => {
        if (gameActive) {
            feedbackMessage.textContent = '';
        }
    }, 1000);
}

function updateTimer() {
    timer--;
    timerDisplay.textContent = timer;

    if (timer <= 0) {
        endGame();
    }
}

function endGame() {
    gameActive = false;
    clearInterval(timerId);
    gameBoard.innerHTML = '<p class="end-text">Fim de Jogo!</p>';
    targetColorText.textContent = '';
    
    feedbackMessage.className = 'feedback-final';
    feedbackMessage.textContent = `Tempo esgotado! Sua pontuação final: ${score}`;
    
    //botão para jogar novamente
    startButton.textContent = 'Jogar Novamente';
    startButton.classList.add('active');
}

startButton.addEventListener('click', startGame);