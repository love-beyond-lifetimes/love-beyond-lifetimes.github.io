/* index.js — Landing Page */

window.addEventListener('DOMContentLoaded', () => {
  // Spawn petals
  spawnPetals(document.getElementById('petals'), 20);

  // Spawn floating hearts
  spawnHearts(document.getElementById('floating-hearts'), 12);

  // NOTE: Music is handled by global.js (DOMContentLoaded auto-init).
  // index.html has <audio id="bg-audio"> which global.js picks up automatically.

  // Stagger title lines
  const t1 = document.getElementById('title-line1');
  const t2 = document.getElementById('title-line2');
  t1.style.opacity = '0';
  t2.style.opacity = '0';
  setTimeout(() => { t1.style.transition = 'opacity 0.8s'; t1.style.opacity = '1'; }, 300);
  setTimeout(() => { t2.style.transition = 'opacity 0.8s'; t2.style.opacity = '1'; }, 700);
});

function handleStart() {
  // Reset all game/story progress so every playthrough starts fresh from reason 1
  resetProgress();

  // SFX: game start
  SFX.gameStart();

  // Spawn sparkles on click
  const btn = document.getElementById('start-btn');
  const rect = btn.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    setTimeout(() => spawnSparkle(
      rect.left + Math.random() * rect.width,
      rect.top  + Math.random() * rect.height
    ), i * 60);
  }
  goTo('greeting.html');
}