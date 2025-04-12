// API Configuration
const API_URL = 'https://guessnumber-1e1p.onrender.com';

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
const clearBtn = document.getElementById('clear-stats');
const playerFilter = document.getElementById('player-filter');
const applyFiltersBtn = document.getElementById('apply-filters');
const resetFiltersBtn = document.getElementById('reset-filters');

// Event Listeners
loginBtn.addEventListener('click', handleLogin);
adminPassword.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleLogin();
    }
});
clearBtn.addEventListener('click', clearData);
applyFiltersBtn.addEventListener('click', handleFilter);
resetFiltersBtn.addEventListener('click', resetFilters);

// Add Enter key support for player filter
playerFilter.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleFilter();
    }
});

function handleLogin() {
    if (adminPassword.value === ADMIN_PASSWORD) {
        loginContainer.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        statsContainer.classList.remove('hidden');  // Make sure stats are visible
        loadStats();
    } else {
        loginMessage.textContent = 'Invalid password';
    }
    adminPassword.value = '';
}

function handleFilter() {
    loadStats(true);
}

async function loadStats(isFiltered = false) {
    try {
        let url = `${API_URL}/api/games`;
        
        if (isFiltered && playerFilter.value.trim()) {
            const searchName = playerFilter.value.trim();
            url += `?player=${encodeURIComponent(searchName)}`;
            console.log('🔍 Filtering by player name:', searchName);
            console.log('📡 Full request URL:', url);
        }

        console.log('⏳ Sending request to:', url);
        const response = await fetch(url);
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const games = await response.json();
        console.log('📥 Received games:', games);
        console.log('📊 Number of games:', games.length);
        
        displayStats(games);
        updateSummary(games);

    } catch (error) {
        console.error('❌ Error loading game stats:', error);
        loginMessage.textContent = error.message;
        statsContainer.innerHTML = '<p class="error-message">Error loading game statistics. Check console for details.</p>';
        summaryContainer.innerHTML = '<p class="error-message">Error loading summary</p>';
    }
}

function displayStats(games) {
    statsContainer.innerHTML = '';
    
    if (!Array.isArray(games) || games.length === 0) {
        statsContainer.innerHTML = '<p>No games found matching the filters</p>';
        return;
    }

    games.forEach(game => {
        const div = document.createElement('div');
        div.className = 'game-record';
        div.innerHTML = `
            <div><strong>Player:</strong> ${game.player_name}</div>
            <div><strong>Date:</strong> ${formatDate(game.timestamp)}</div>
            <div><strong>Attempts:</strong> ${game.attempts}</div>
            <div><strong>Result:</strong> ${game.won ? 'Won' : 'Gave up'}</div>
        `;
        statsContainer.appendChild(div);
    });
}

function updateSummary(games) {
    if (!Array.isArray(games)) {
        summaryContainer.innerHTML = '<p class="error-message">Error loading summary</p>';
        return;
    }

    const totalGames = games.length;
    const gamesWon = games.filter(game => game.won).length;
    const averageAttempts = totalGames > 0 ? 
        (games.reduce((sum, game) => sum + game.attempts, 0) / totalGames).toFixed(1) : 0;
    const uniquePlayers = new Set(games.map(game => game.player_name)).size;

    summaryContainer.innerHTML = `
        <p><strong>Total Games:</strong> ${totalGames}</p>
        <p><strong>Games Won:</strong> ${gamesWon}</p>
        <p><strong>Win Rate:</strong> ${totalGames ? ((gamesWon / totalGames) * 100).toFixed(1) : 0}%</p>
        <p><strong>Average Attempts:</strong> ${averageAttempts}</p>
        <p><strong>Unique Players:</strong> ${uniquePlayers}</p>
    `;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function resetFilters() {
    playerFilter.value = '';
    loadStats(false);
}

async function clearData() {
    if (confirm('🚨 WARNING: Are you sure you want to clear ALL game statistics? This action cannot be undone!')) {
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