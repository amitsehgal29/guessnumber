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

## Deployment on Render.com (Free)

1. Fork/Push this repository to your GitHub account

2. Go to [Render.com](https://render.com) and create a free account

3. In your Render dashboard:
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Select the repository with this game

4. Configure the deployment:
   - Name: `guess-number-game` (or your preferred name)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Select the free plan

5. Click "Create Web Service"

Your game will be deployed and accessible at: `https://your-app-name.onrender.com`

Note: The free tier includes:
- 750 hours of runtime per month
- 500MB storage
- Automatic HTTPS/SSL
- Continuous deployment from GitHub

## Deployment on Cyclic.sh (Free)

1. Push your code to a GitHub repository if you haven't already

2. Go to [Cyclic.sh](https://www.cyclic.sh/) and:
   - Sign in with your GitHub account
   - Click "Deploy Now"
   - Select your repository
   - Click "Connect"
   - Click "Deploy"

3. Once deployed, your app will be available at `https://your-app-name.cyclic.app`

The free tier on Cyclic.sh includes:
- Unlimited deployments
- Automatic HTTPS
- Continuous deployment from GitHub
- 1GB storage
- No cold starts
- 24/7 operation

Note: The database will be stored in the `/tmp` directory which is writable on Cyclic.sh.

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
