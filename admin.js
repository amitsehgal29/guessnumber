// API Configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://guessnumber.cyclic.app';

// Admin password hash (this is a simple example - in production use proper authentication)
const ADMIN_PASSWORD = '1234'; // Change this to your desired password

// DOM Elements
const loginContainer = document.getElementById('login-container');
const adminPanel = document.getElementById('admin-panel');
const loginBtn = document.getElementById('login-btn');
const adminPassword = document.getElementById('admin-password');
const loginMessage = document.getElementById('login-message');
const statsContainer = document.getElementById('stats-container');
const summaryContainer = document.getElementById('summary-container');
const exportBtn = document.getElementById('export-stats');
const clearBtn = document.getElementById('clear-stats');
const playerFilter = document.getElementById('player-filter');
const dateFilter = document.getElementById('date-filter');
const applyFiltersBtn = document.getElementById('apply-filters');
const resetFiltersBtn = document.getElementById('reset-filters');

let gameStats = [];

// Event Listeners
loginBtn.addEventListener('click', handleLogin);
exportBtn.addEventListener('click', exportData);
clearBtn.addEventListener('click', clearData);
applyFiltersBtn.addEventListener('click', loadStats);
resetFiltersBtn.addEventListener('click', resetFilters);

function handleLogin() {
    if (adminPassword.value === ADMIN_PASSWORD) {
        loginContainer.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        loadStats();
    } else {
        loginMessage.textContent = 'Invalid password';
    }
    adminPassword.value = '';
}

async function loadStats() {
    try {
        const params = new URLSearchParams();
        if (playerFilter.value) params.append('player', playerFilter.value);
        if (dateFilter.value) params.append('date', dateFilter.value);

        const [gamesResponse, statsResponse] = await Promise.all([
            fetch(`${API_URL}/api/games?${params}`),
            fetch(`${API_URL}/api/stats`)
        ]);

        if (!gamesResponse.ok || !statsResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        const games = await gamesResponse.json();
        const stats = await statsResponse.json();

        displayStats(games);
        updateSummary(stats);
    } catch (error) {
        console.error('Error loading game stats:', error);
        statsContainer.innerHTML = '<p>Error loading game statistics</p>';
    }
}

function displayStats(games) {
    statsContainer.innerHTML = '';
    
    if (games.length === 0) {
        statsContainer.innerHTML = '<p>No games found matching the filters</p>';
        return;
    }

    games.forEach(game => {
        const record = document.createElement('div');
        record.className = 'game-record';
        record.innerHTML = `
            <div><strong>Player:</strong> ${game.playerName}</div>
            <div><strong>Date:</strong> ${formatDate(game.timestamp)}</div>
            <div><strong>Attempts:</strong> ${game.attempts}</div>
            <div><strong>Result:</strong> ${game.won ? 'Won' : 'Gave up'}</div>
        `;
        statsContainer.appendChild(record);
    });
}

function updateSummary(stats) {
    summaryContainer.innerHTML = `
        <p><strong>Total Games:</strong> ${stats.totalGames}</p>
        <p><strong>Games Won:</strong> ${stats.gamesWon}</p>
        <p><strong>Win Rate:</strong> ${((stats.gamesWon / stats.totalGames) * 100).toFixed(1)}%</p>
        <p><strong>Average Attempts:</strong> ${stats.averageAttempts?.toFixed(1) || 0}</p>
        <p><strong>Unique Players:</strong> ${stats.uniquePlayers}</p>
    `;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function resetFilters() {
    playerFilter.value = '';
    dateFilter.value = '';
    loadStats();
}

async function exportData() {
    try {
        const response = await fetch(`${API_URL}/api/games`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'number-game-stats.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting data:', error);
    }
}

async function clearData() {
    if (confirm('Are you sure you want to clear all game statistics? This cannot be undone.')) {
        try {
            const response = await fetch(`${API_URL}/api/games`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to clear data');
            }
            loadStats();
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    }
}