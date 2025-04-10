const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// PostgreSQL connection setup
const pool = new Pool({
    connectionString: 'postgresql://amitsehgal:nsbYRXM5gknlKorLf3GsSF7saBuwp9m2@dpg-cvs1tbidbo4c73fshamg-a.singapore-postgres.render.com/guessgame',
    ssl: {
        rejectUnauthorized: false
    }
});

// Create table if it doesn't exist
(async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS game_logs (
            id SERIAL PRIMARY KEY,
            player_name TEXT NOT NULL,
            attempts INTEGER NOT NULL,
            won BOOLEAN NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(createTableQuery);
        console.log('Table created or already exists.');
    } catch (error) {
        console.error('Error creating table:', error);
    }
})();

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    const adminKey = req.headers['x-admin-key']; // Admin key sent in request headers
    if (adminKey === 'your-secure-admin-key') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
};

// API endpoint to save game logs
app.post('/api/games', async (req, res) => {
    const { playerName, attempts, won } = req.body;

    if (!playerName || playerName.trim() === '') {
        return res.status(400).json({ error: 'Player name is required' });
    }

    const insertQuery = `
        INSERT INTO game_logs (player_name, attempts, won)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    try {
        const result = await pool.query(insertQuery, [playerName.trim(), attempts, won]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save game log' });
    }
});

// API endpoint to retrieve game logs
app.get('/api/games', async (req, res) => {
    const selectQuery = 'SELECT * FROM game_logs ORDER BY timestamp DESC';
    try {
        const result = await pool.query(selectQuery);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve game logs' });
    }
});

// API endpoint to clear game logs
app.delete('/api/games', async (req, res) => {
    const deleteQuery = 'DELETE FROM game_logs';
    try {
        await pool.query(deleteQuery);
        res.json({ message: 'All game logs cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear game logs' });
    }
});

// Serve the admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});