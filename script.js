const container = document.querySelector('.lego-container');
const input = document.querySelector('input');
const button = document.querySelector('button');
const message = document.querySelector('#message');

// Generate random number between 1-100
let targetNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

button.addEventListener('click', checkGuess);
input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') checkGuess();
});

function checkGuess() {
    const guess = Number(input.value);
    
    if (guess < 1 || guess > 100 || isNaN(guess)) {
        message.textContent = 'Please enter a valid number between 1 and 100';
        return;
    }

    attempts++;
    
    if (guess === targetNumber) {
        container.classList.add('success');
        message.textContent = `Congratulations! You got it in ${attempts} attempts!`;
        
        setTimeout(() => {
            container.classList.remove('success');
            targetNumber = Math.floor(Math.random() * 100) + 1;
            input.value = '';
            message.textContent = 'New game! Start guessing...';
            attempts = 0;
        }, 1500);
    } else {
        message.textContent = guess < targetNumber ? 
            'Too low! Try a higher number.' : 
            'Too high! Try a lower number.';
    }
}
