const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database setup
const db = new Database('game_records.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS game_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playerName TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    attempts INTEGER NOT NULL,
    won BOOLEAN NOT NULL
  )
`);

// API endpoints
app.post('/api/games', (req, res) => {
  const { playerName, attempts, won } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO game_records (playerName, attempts, won) VALUES (?, ?, ?)');
    const result = stmt.run(playerName, attempts, won);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/games', (req, res) => {
  try {
    const { player, date } = req.query;
    let query = 'SELECT * FROM game_records WHERE 1=1';
    const params = [];

    if (player) {
      query += ' AND playerName LIKE ?';
      params.push(`%${player}%`);
    }
    if (date) {
      query += ' AND date(timestamp) = date(?)';
      params.push(date);
    }

    query += ' ORDER BY timestamp DESC';
    const stmt = db.prepare(query);
    const records = stmt.all(...params);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      totalGames: db.prepare('SELECT COUNT(*) as count FROM game_records').get().count,
      gamesWon: db.prepare('SELECT COUNT(*) as count FROM game_records WHERE won = 1').get().count,
      averageAttempts: db.prepare('SELECT AVG(attempts) as avg FROM game_records').get().avg,
      uniquePlayers: db.prepare('SELECT COUNT(DISTINCT playerName) as count FROM game_records').get().count
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/games', (req, res) => {
  try {
    db.prepare('DELETE FROM game_records').run();
    res.json({ message: 'All records deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});