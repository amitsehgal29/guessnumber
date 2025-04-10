const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Logs file setup
const logsFilePath = path.join(__dirname, 'game_logs.txt');

// Ensure the logs file exists
if (!fs.existsSync(logsFilePath)) {
    fs.writeFileSync(logsFilePath, '');
}

// API endpoint to save game logs
app.post('/api/games', (req, res) => {
    const { playerName, attempts, won } = req.body;
    const logEntry = {
        playerName,
        attempts,
        won,
        timestamp: new Date().toISOString()
    };
    try {
        fs.appendFileSync(logsFilePath, JSON.stringify(logEntry) + '\n');
        res.json({ message: 'Game log saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save game log' });
    }
});

// API endpoint to retrieve game logs
app.get('/api/games', (req, res) => {
    try {
        const logs = fs.readFileSync(logsFilePath, 'utf-8')
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => JSON.parse(line));
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve game logs' });
    }
});

// API endpoint to clear game logs
app.delete('/api/games', (req, res) => {
    try {
        fs.writeFileSync(logsFilePath, '');
        res.json({ message: 'All game logs cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear game logs' });
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});