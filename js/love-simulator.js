/* love-simulator.js */

let lovePoints = 0;
const MAX = 100;

const milestones = {
  10: "okay you're so special",
  25: "why am i smiling right now",
  50: "this is getting serious\u2026",
  75: "i'm falling for you deeper\u2026",
  100: "system unlocked: emotional access granted"
};

window.addEventListener('DOMContentLoaded', () => {
  spawnPetals(document.getElementById('petals'), 14);
});

function clickHeart(e) {
  if (lovePoints >= MAX) return;

  lovePoints++;

  // Update counter
  document.getElementById('sim-counter').textContent = `love points: ${lovePoints} / ${MAX}`;

  // Update bar
  document.getElementById('sim-bar-fill').style.width = (lovePoints / MAX * 100) + '%';

  // SFX: milestone or regular tap
  if (milestones[lovePoints]) {
    SFX.milestone();
  } else {
    SFX.heartTap();
  }

  // Spawn floating heart at click position
  spawnClickHeart(e.clientX, e.clientY);

  // Check milestones — capture msg before setTimeout to avoid stale closure
  if (milestones[lovePoints]) {
    const msg = milestones[lovePoints];
    const el = document.getElementById('sim-milestone');
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = '\u201c' + msg + '\u201d';
      el.style.opacity = '1';
    }, 200);
  }

  // Pulse the heart
  const heart = document.getElementById('sim-heart');
  heart.style.transform = 'scale(0.85)';
  setTimeout(() => heart.style.transform = '', 120);

  // Victory at 100
  if (lovePoints >= MAX) {
    setTimeout(() => {
      SFX.levelComplete();
      launchConfetti();
      setProgress('sim_done', 'true');
      document.getElementById('sim-victory').style.display = 'flex';
    }, 500);
  }
}

function spawnClickHeart(x, y) {
  const symbols = ['\u2665', '+1', '\ud83d\udc97', '\u2661'];
  const el = document.createElement('div');
  el.classList.add('click-heart');
  el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  el.style.left = (x + (Math.random() * 30 - 15)) + 'px';
  el.style.top  = (y - 10) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}