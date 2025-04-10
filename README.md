# Guess Number Game

A modern and interactive number guessing game built with HTML, CSS, and JavaScript, featuring a persistent database for tracking player statistics.

## Features

- Responsive and modern design with a gradient background and glassmorphism effect
- Player registration and statistics tracking
- Admin dashboard for viewing game statistics
- SQLite database for persistent storage
- Smooth transitions and hover effects for an engaging user experience

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/guess-number-game.git
   ```

2. Navigate to the project directory:
   ```bash
   cd guess-number-game
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and visit:
   - Game: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin.html` (default password: "1234")

## Deployment

The game requires a Node.js server to run due to the database functionality. You can deploy it to platforms like:
- Heroku
- DigitalOcean
- AWS
- Any other platform that supports Node.js

Make sure to:
1. Set up proper environment variables if needed
2. Configure your database path
3. Update CORS settings for your domain

## Project Structure

- `server.js` - Node.js/Express server handling database operations
- `index.html` - Main game interface
- `admin.html` - Admin dashboard for statistics
- `script.js` - Game logic
- `admin.js` - Admin panel functionality
- `style.css` - Main styling
- `admin.css` - Admin panel styling

## Database

The game uses SQLite for data persistence. Game records include:
- Player name
- Timestamp
- Number of attempts
- Game result (won/lost)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
