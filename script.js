// Game elements
const playerRegistration = document.getElementById('player-registration');
const gameContainer = document.getElementById('game-container');
const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');
const playerDisplay = document.getElementById('player-display');
const input = document.querySelector('#game-container input');
const guessButton = document.getElementById('guess-btn');
const nextGameButton = document.getElementById('next-game');
const message = document.querySelector('#message');
const attemptsDisplay = document.getElementById('attempts');

// Stats viewing functionality
const statsModal = document.getElementById('stats-modal');
const statsContainer = document.getElementById('stats-container');
const viewStatsBtn = document.getElementById('view-stats');
const viewStatsInGameBtn = document.getElementById('view-stats-ingame');
const closeStatsBtn = document.getElementById('close-stats');

// Game state
let targetNumber;
let attempts = 0;
let currentPlayer = '';
let gameStats = [];

// Initialize game
function initializeGame() {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    updateAttempts();
    message.textContent = 'Start guessing...';
    nextGameButton.classList.add('hidden');
    input.value = '';
}

// Event Listeners
startGameButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        currentPlayer = playerName;
        playerDisplay.textContent = currentPlayer;
        playerRegistration.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        initializeGame();
    }
});

guessButton.addEventListener('click', checkGuess);
input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') checkGuess();
});

nextGameButton.addEventListener('click', () => {
    container.classList.remove('success');
    initializeGame();
});

// Record game stats
async function recordGameStats(won) {
    try {
        const response = await fetch('http://localhost:3000/api/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playerName: currentPlayer,
                attempts: attempts,
                won: won
            })
        });
        if (!response.ok) {
            throw new Error('Failed to save game record');
        }
    } catch (error) {
        console.error('Error saving game record:', error);
    }
}

function celebrateWin() {
    const winSound = document.getElementById('winSound');
    winSound.play();
    
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
    }, 250);

    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 400);
}

function updateAttempts() {
    attemptsDisplay.textContent = attempts;
}

function wrongGuess(guess) {
    const errorSound = document.getElementById('errorSound');
    errorSound.play();
    
    gameContainer.classList.add('shake');
    setTimeout(() => gameContainer.classList.remove('shake'), 500);
    
    if (guess < targetNumber) {
        message.className = 'message-low';
        message.textContent = 'Too low! Try a higher number.';
    } else {
        message.className = 'message-high';
        message.textContent = 'Too high! Try a lower number.';
    }
    input.value = ''; // Clear input after each guess
}

function checkGuess() {
    const guessText = input.value.trim();
    
    if (!/^\d+$/.test(guessText)) {
        message.textContent = 'Please enter numbers only';
        return;
    }
    
    const guess = Number(guessText);
    
    if (guess < 1 || guess > 100) {
        message.textContent = 'Please enter a number between 1 and 100';
        return;
    }

    attempts++;
    updateAttempts();
    
    if (guess === targetNumber) {
        gameContainer.classList.add('success');
        message.textContent = `Congratulations ${currentPlayer}! You got it in ${attempts} attempts!`;
        celebrateWin();
        recordGameStats(true);
        nextGameButton.classList.remove('hidden');
        input.value = ''; // Clear input
    } else {
        wrongGuess(guess);
    }
}

// Stats viewing functionality
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function displayGameStats() {
    statsContainer.innerHTML = '';
    const stats = gameStats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (stats.length === 0) {
        statsContainer.innerHTML = '<p>No games played yet!</p>';
        return;
    }

    stats.forEach(game => {
        const record = document.createElement('div');
        record.className = 'game-record';
        record.innerHTML = `
            <p><strong>Player:</strong> ${game.playerName}</p>
            <p><strong>Date:</strong> ${formatDate(game.timestamp)}</p>
            <p><strong>Attempts:</strong> ${game.attempts}</p>
            <p><strong>Result:</strong> ${game.won ? 'Won' : 'Gave up'}</p>
        `;
        statsContainer.appendChild(record);
    });
}

[viewStatsBtn, viewStatsInGameBtn].forEach(btn => {
    btn.addEventListener('click', () => {
        displayGameStats();
        statsModal.classList.remove('hidden');
    });
});

closeStatsBtn.addEventListener('click', () => {
    statsModal.classList.add('hidden');
});

// Close modal when clicking outside
statsModal.addEventListener('click', (e) => {
    if (e.target === statsModal) {
        statsModal.classList.add('hidden');
    }
});

// Load previous game stats if they exist
try {
    const savedStats = localStorage.getItem('numberGameStats');
    if (savedStats) {
        gameStats = JSON.parse(savedStats);
    }
} catch (e) {
    console.error('Error loading game stats:', e);
    gameStats = [];
}
