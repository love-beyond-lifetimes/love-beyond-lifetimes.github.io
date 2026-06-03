/* girlfriend.js */

window.addEventListener('DOMContentLoaded', () => {
  spawnPetals(document.getElementById('petals'), 20);
  spawnMiniHearts();
  launchConfetti();

  // Reveal bubble + typewrite message
  setTimeout(() => {
    const bubble = document.getElementById('speech-bubble');
    bubble.style.opacity = '1';

    const msgEl = document.getElementById('gf-msg');
    typeWriter(msgEl, 'This may be the end of the game, but it is the beginning of our story. Thank you for choosing me. I promise to love you, cherish you, and make you happy every single day, in this lifetime and every lifetime after. I love you so much,\nmy girlfriend ><', 60, () => {
      setTimeout(() => {
        const deco = document.getElementById('bubble-deco');
        if (deco) deco.style.display = 'block';
      }, 300);
    });
  }, 800);

  // Show play again
  setTimeout(() => {
    document.getElementById('gf-bottom').style.opacity = '1';
  }, 4500);

  // Extra confetti
  setTimeout(() => launchConfetti(), 1600);
  setTimeout(() => launchConfetti(), 3200);
});

function playAgain() {
  // Reset all story progress
  resetProgress();

  // Restart music from the beginning on next page load
  sessionStorage.removeItem('lbl_music_time');
  if (bgMusic) {
    bgMusic.currentTime = 0;
  }

  goTo('index.html');
}

function spawnMiniHearts() {
  const container = document.getElementById('cat-hearts');
  const symbols = ['🩷', '❤️', '💗', '💕'];

  for (let i = 0; i < 7; i++) {
    const h = document.createElement('div');
    h.classList.add('mini-heart');
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const tx = (Math.random() - 0.5) * 100;
    const ty = -(50 + Math.random() * 70);
    h.style.setProperty('--tx', tx + 'px');
    h.style.setProperty('--ty', ty + 'px');
    h.style.left   = (15 + Math.random() * 65) + '%';
    h.style.top    = (30 + Math.random() * 50) + '%';
    h.style.animationDuration = (1.6 + Math.random() * 2) + 's';
    h.style.animationDelay   = (Math.random() * 2) + 's';

    container.appendChild(h);
  }
}