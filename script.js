// API Configuration
const API_URL = 'https://guessnumber-1e1p.onrender.com';
//const API_URL = 'http://localhost:3000';

// Game elements
const playerRegistration = document.getElementById('player-registration');
const gameContainer = document.getElementById('game-container');
const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');
const playerDisplay = document.getElementById('player-display');
const guessInput = document.querySelector('#game-container input[type="number"]');
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

// Sound effects
const SOUNDS = {
    start: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568.wav'),    // Space engine start
    click: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571.wav'),    // Space button beep
    wrong: new Audio('https://assets.mixkit.co/active_storage/sfx/2573/2573.wav'),    // Error alert
    tooHigh: new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570.wav'),  // Short high-pitched space beep
    tooLow: new Audio('https://assets.mixkit.co/active_storage/sfx/2574/2574.wav'),   // Low-pitched space whoosh
    win: new Audio('https://assets.mixkit.co/active_storage/sfx/2575/2575.wav')       // Victory fanfare
};

// Sound manager
const soundManager = {
    isMuted: false,
    async loadSounds() {
        const sounds = Object.values(SOUNDS);
        try {
            await Promise.all(sounds.map(async (sound, index) => {
                const soundName = Object.keys(SOUNDS)[index];
                try {
                    await new Promise((resolve, reject) => {
                        sound.addEventListener('canplaythrough', resolve, { once: true });
                        sound.addEventListener('error', (e) => {
                            console.error(`Failed to load sound ${soundName}:`, e);
                            reject(e);
                        }, { once: true });
                        sound.load();
                    });
                    console.log(`Successfully loaded sound: ${soundName}`);
                } catch (error) {
                    console.error(`Error loading sound ${soundName}:`, error);
                }
            }));
            console.log('All sounds loaded successfully');
        } catch (error) {
            console.warn('Some sounds failed to load:', error);
        }
    },
    playSound(soundName) {
        if (this.isMuted) return;
        
        const sound = SOUNDS[soundName];
        if (sound) {
            console.log(`Playing sound: ${soundName}`);
            sound.currentTime = 0; // Reset sound to start
            sound.play().catch(error => {
                console.error(`Failed to play ${soundName}:`, error);
                // If first attempt fails, try loading and playing again
                sound.load();
                sound.play().catch(e => console.error(`Sound retry failed for ${soundName}:`, e));
            });
        }
    },
    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
};

// Add mute button to game container
const muteButton = document.createElement('button');
muteButton.id = 'mute-btn';
muteButton.innerHTML = '🔊';
muteButton.className = 'mute-button';
gameContainer.insertBefore(muteButton, gameContainer.firstChild);

muteButton.addEventListener('click', () => {
    const isMuted = soundManager.toggleMute();
    muteButton.innerHTML = isMuted ? '🔈' : '🔊';
});

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
    message.textContent = '🛸 Begin Mission!';
    nextGameButton.classList.add('hidden');
    guessInput.value = '';
    
    // Re-enable input and button for new game
    guessInput.disabled = false;
    guessButton.disabled = false;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Preload sounds
    await soundManager.loadSounds();

    startGameButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            soundManager.playSound('start');
            currentPlayer = playerName;
            playerDisplay.textContent = currentPlayer;
            playerRegistration.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            initializeGame();
        } else {
            alert('Please enter a valid player name.');
        }
    });

    playerNameInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            startGameButton.click();
        }
    });

    guessButton.addEventListener('click', () => {
        soundManager.playSound('click');
        checkGuess();
    });
    guessInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') checkGuess();
    });

    nextGameButton.addEventListener('click', () => {
        gameContainer.classList.remove('success');
        initializeGame();
    });
});

// Record game stats
async function recordGameStats(won) {
    try {
        const response = await fetch(`${API_URL}/api/games`, {
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
    const colors = ['#00ffff', '#007777', '#004444', '#002222'];
    
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
    });

    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
    }, 250);

    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });
    }, 400);
}

function updateAttempts() {
    attemptsDisplay.textContent = attempts;
}

function wrongGuess(guess) {    
    gameContainer.classList.add('shake');
    setTimeout(() => gameContainer.classList.remove('shake'), 500);
    
    if (guess < targetNumber) {
        message.className = 'message-low';
        message.textContent = '🌠 Orbit Higher!';
        soundManager.playSound('tooLow');
    } else {
        message.className = 'message-high';
        message.textContent = '🌌 Orbit Lower!';
        soundManager.playSound('tooHigh');
    }
    guessInput.value = ''; // Clear input after each guess
}

function checkGuess() {
    const guessText = guessInput.value.trim();
    
    if (!/^\d+$/.test(guessText)) {
        message.textContent = '⚠️ Invalid Coordinates!';
        soundManager.playSound('wrong');
        return;
    }
    
    const guess = Number(guessText);
    
    if (guess < 1 || guess > 100) {
        message.textContent = '🚫 Sector Restricted!';
        soundManager.playSound('wrong');
        return;
    }

    attempts++;
    updateAttempts();
    
    if (guess === targetNumber) {
        gameContainer.classList.add('success');
        message.textContent = `✨ Target Acquired!`;
        soundManager.playSound('win');
        celebrateWin();
        recordGameStats(true);
        
        // Disable input and guess button
        guessInput.disabled = true;
        guessButton.disabled = true;
        
        // Show and highlight next game button
        nextGameButton.classList.remove('hidden');
        guessInput.value = ''; // Clear input
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

// Fetch and display game logs
async function fetchGameLogs() {
    try {
        const response = await fetch(`${API_URL}/api/games`);
        if (!response.ok) {
            throw new Error('Failed to fetch game logs');
        }
        const logs = await response.json();
        displayGameLogs(logs);
    } catch (error) {
        console.error('Error fetching game logs:', error);
    }
}

function displayGameLogs(logs) {
    statsContainer.innerHTML = '';
    if (logs.length === 0) {
        statsContainer.innerHTML = '<p>No game logs available</p>';
        return;
    }
    logs.forEach(log => {
        const logEntry = document.createElement('div');
        logEntry.className = 'game-log';
        logEntry.innerHTML = `
            <p><strong>Player:</strong> ${log.playerName}</p>
            <p><strong>Date:</strong> ${new Date(log.timestamp).toLocaleString()}</p>
            <p><strong>Attempts:</strong> ${log.attempts}</p>
            <p><strong>Result:</strong> ${log.won ? 'Won' : 'Lost'}</p>
        `;
        statsContainer.appendChild(logEntry);
    });
}

// Call fetchGameLogs when viewing stats
viewStatsBtn.addEventListener('click', fetchGameLogs);

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
