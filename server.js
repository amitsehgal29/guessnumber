const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// PostgreSQL connection configuration
const pool = new Pool({
    connectionString: 'postgresql://amitsehgal:nsbYRXM5gknlKorLf3GsSF7saBuwp9m2@dpg-cvs1tbidbo4c73fshamg-a.singapore-postgres.render.com/guessgame',
    ssl: {
        rejectUnauthorized: false
    }
});

// Create table if it doesn't exist
async function initializeDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS game_logs (
                id SERIAL PRIMARY KEY,
                player_name TEXT NOT NULL,
                attempts INTEGER NOT NULL,
                won BOOLEAN NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initializeDatabase();

// API endpoint to save game logs
app.post('/api/games', async (req, res) => {
    const { playerName, attempts, won } = req.body;

    if (!playerName || playerName.trim() === '') {
        return res.status(400).json({ error: 'Player name is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO game_logs (player_name, attempts, won) VALUES ($1, $2, $3) RETURNING *',
            [playerName.trim(), attempts, won]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error saving game log:', error);
        res.status(500).json({ error: 'Failed to save game log' });
    }
});

// API endpoint to retrieve game logs
app.get('/api/games', async (req, res) => {
    try {
        const { player } = req.query;
        console.log('Received request query params:', req.query);
        console.log('Player name filter:', player);
        
        let query = 'SELECT * FROM game_logs';
        const params = [];

        // Only apply filter if player parameter exists and is not empty
        if (player && player.trim()) {
            // Add WHERE clause with proper SQL LIKE syntax
            query += ' WHERE LOWER(player_name) LIKE LOWER($1)';
            params.push(`%${player.trim()}%`);
            console.log('SQL Query:', query);
            console.log('Query parameters:', params);
        } else {
            console.log('No filter applied - returning all records');
        }

        query += ' ORDER BY timestamp DESC';
        
        const result = await pool.query(query, params);
        console.log('SQL Query executed:', { query, params });
        console.log(`Found ${result.rows.length} matching records with filter:`, player || 'none');
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving game logs:', error);
        res.status(500).json({ error: 'Failed to retrieve game logs' });
    }
});

// API endpoint to clear game logs
app.delete('/api/games', async (req, res) => {
    try {
        await pool.query('DELETE FROM game_logs');
        res.json({ message: 'All game logs cleared successfully' });
    } catch (error) {
        console.error('Error clearing game logs:', error);
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