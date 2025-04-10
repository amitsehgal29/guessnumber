let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

document.getElementById('guessButton').addEventListener('click', () => {
    const userGuess = parseInt(document.getElementById('guessInput').value);
    const message = document.getElementById('message');
    const attemptsDisplay = document.getElementById('attempts');
    attempts++;

    if (userGuess < randomNumber) {
        message.textContent = 'Your guess is lower, please try again.';
    } else if (userGuess > randomNumber) {
        message.textContent = 'Your guess is higher, please try again.';
    } else {
        message.textContent = `Correct guess! You took ${attempts} chances.`;
    }

    attemptsDisplay.textContent = `Attempts: ${attempts}`;
});
