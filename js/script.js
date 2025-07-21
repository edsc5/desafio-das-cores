// --- SELEÇÃO DE ELEMENTOS DO DOM ---
// Telas
const preGameScreen = document.getElementById('pre-game-screen');
const gameScreen = document.getElementById('game-screen');
const postGameScreen = document.getElementById('post-game-screen');

// Botões e Inputs
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const playerNameInput = document.getElementById('player-name-input');

// Elementos do Jogo
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameBoard = document.getElementById('game-board');
const targetColorNameDisplay = document.getElementById('target-color-name');

// Elementos da Tela Final
const finalPlayerNameDisplay = document.getElementById('final-player-name');
const finalScoreDisplay = document.getElementById('final-score');


// --- CONSTANTES E VARIÁVEIS DE ESTADO DO JOGO ---
const GAME_DURATION = 60; // Duração do jogo em segundos
const COLORS = [
    { name: 'VERMELHO', value: 'rgb(255, 0, 0)' },
    { name: 'VERDE', value: 'rgb(0, 255, 0)' },
    { name: 'AZUL', value: 'rgb(0, 0, 255)' },
    { name: 'AMARELO', value: 'rgb(255, 255, 0)' },
    { name: 'ROXO', value: 'rgb(128, 0, 128)' },
    { name: 'LARANJA', value: 'rgb(255, 165, 0)' }
];

let score = 0;
let timer = GAME_DURATION;
let timerId = null;
let playerName = '';
let targetColor = {};

// --- FUNÇÕES DO JOGO ---

// Função para iniciar o jogo
function startGame() {
    playerName = playerNameInput.value || 'Jogador'; // Pega o nome ou usa 'Jogador'
    score = 0;
    timer = GAME_DURATION;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timer;

    // Troca de telas
    preGameScreen.classList.remove('active');
    postGameScreen.classList.remove('active');
    gameScreen.classList.add('active');

    // Inicia o timer
    timerId = setInterval(updateTimer, 1000);

    // Gera a primeira rodada
    generateRound();
}

// Função para gerar uma nova rodada (cores e alvo)
function generateRound() {
    gameBoard.innerHTML = ''; // Limpa a grade anterior

    // Sorteia a cor alvo
    targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    targetColorNameDisplay.textContent = targetColor.name;
    targetColorNameDisplay.style.backgroundColor = targetColor.value; // Mostra a cor visualmente

    const squares = [];
    for (let i = 0; i < 16; i++) {
        const square = document.createElement('div');
        square.classList.add('color-square');

        // Sorteia uma cor para o quadrado
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        square.style.backgroundColor = randomColor.value;
        square.dataset.colorValue = randomColor.value; // Guarda o valor da cor para comparação

        square.addEventListener('click', handleSquareClick);
        squares.push(square);
    }

    // Garante que pelo menos um quadrado tenha a cor alvo
    const hasTargetColor = squares.some(sq => sq.dataset.colorValue === targetColor.value);
    if (!hasTargetColor) {
        const randomIndex = Math.floor(Math.random() * squares.length);
        squares[randomIndex].style.backgroundColor = targetColor.value;
        squares[randomIndex].dataset.colorValue = targetColor.value;
    }

    // Adiciona os quadrados à grade
    squares.forEach(square => gameBoard.appendChild(square));
}

// Função para lidar com o clique em um quadrado
function handleSquareClick(event) {
    const clickedColor = event.target.dataset.colorValue;

    if (clickedColor === targetColor.value) {
        // Acertou
        score += 10;
    } else {
        // Errou
        score -= 5;
    }

    scoreDisplay.textContent = score; // Atualiza a pontuação na tela
    generateRound(); // Gera a próxima rodada
}

// Função para atualizar o timer
function updateTimer() {
    timer--;
    timerDisplay.textContent = timer;

    if (timer <= 0) {
        endGame();
    }
}

// Função para finalizar o jogo
function endGame() {
    clearInterval(timerId); // Para o timer

    // Mostra a tela de fim de jogo
    gameScreen.classList.remove('active');
    postGameScreen.classList.add('active');

    // Exibe as informações finais
    finalPlayerNameDisplay.textContent = playerName;
    finalScoreDisplay.textContent = score;
}


// --- EVENT LISTENERS ---
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);