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

function celebrateWin() {
    const winSound = document.getElementById('winSound');
    winSound.play();
    
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Fire multiple confetti bursts
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
    }, 250);

    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 400);
}

function checkGuess() {
    const guessText = input.value.trim();
    
    if (!/^\d+$/.test(guessText)) {
        message.textContent = 'Please enter numbers only';
        return;
    }
    
    const guess = Number(guessText);
    
    if (guess < 1 || guess > 100) {
        message.textContent = 'Please enter a number between 1 and 100';
        return;
    }

    attempts++;
    
    if (guess === targetNumber) {
        container.classList.add('success');
        message.textContent = `Congratulations! You got it in ${attempts} attempts!`;
        celebrateWin();
        
        setTimeout(() => {
            container.classList.remove('success');
            targetNumber = Math.floor(Math.random() * 100) + 1;
            input.value = '';
            message.textContent = 'New game! Start guessing...';
            attempts = 0;
        }, 2000); // Increased delay to allow for celebration
    } else {
        message.textContent = guess < targetNumber ? 
            'Too low! Try a higher number.' : 
            'Too high! Try a lower number.';
    }
}
