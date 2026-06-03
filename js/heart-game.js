/* heart-game.js */

const GOAL       = 67;
const BOMB_CHANCE  = 0.22;
const BOMB_PENALTY = 3;

let score      = 0;
let gameActive = true;
let HEADER_H   = 90; // updated on DOMContentLoaded

const HEART_SYMBOLS = ['♥','♡','💗','💖','💕'];
const BOMB_SYMBOLS  = ['💣','☠️','💀'];

let spawnTimer = null;

window.addEventListener('DOMContentLoaded', () => {
  const hdr = document.querySelector('.hg-header');
  if (hdr) HEADER_H = hdr.getBoundingClientRect().height + 8;
  startGame();
});

/* ── Speed helpers ── */
function getSpawnDelay() {
  const p = Math.min(score / GOAL, 1);
  return Math.round(700 - p * 450);
}

function getDropSpeed() {
  // px per frame (60fps target). Starts slow, gets fast.
  const p = Math.min(score / GOAL, 1);
  // range: 1.4 px/f → 4.2 px/f
  return 1.4 + p * 2.8 + Math.random() * 0.8;
}

/* ── Spawn loop ── */
function startGame() {
  scheduleNext();
  // burst at start
  for (let i = 0; i < 5; i++) setTimeout(spawnEntity, i * 160);
}

function scheduleNext() {
  spawnTimer = setTimeout(() => {
    if (!gameActive) return;
    spawnEntity();
    scheduleNext();            // re-schedule each time so delay updates
  }, getSpawnDelay());
}

function spawnEntity() {
  if (!gameActive) return;
  Math.random() < BOMB_CHANCE ? spawnBomb() : spawnHeart();
}

/* ── Core spawner ── */
function createFaller(symbols, extraClass) {
  const area = document.getElementById('hg-area');
  const el   = document.createElement('div');

  el.classList.add('hg-heart');
  if (extraClass) el.classList.add(extraClass);
  el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  const x = 5 + Math.random() * 85;
  el.style.left     = x + 'vw';
  el.style.top      = HEADER_H + 'px';
  el.style.position = 'absolute';

  const size = extraClass === 'hg-bomb'
    ? (32 + Math.random() * 16)
    : (34 + Math.random() * 24);
  el.style.fontSize = size + 'px';

  area.appendChild(el);

  // Animate via JS so hitbox tracks visual position
  let topPx   = HEADER_H;
  const speed = getDropSpeed() * (extraClass === 'hg-bomb' ? 1.15 : 1);
  const limit = window.innerHeight + 80;

  let rafId;
  function fall() {
    if (!gameActive && !el.classList.contains('popped')) {
      el.remove();
      return;
    }
    topPx += speed;
    el.style.top = topPx + 'px';
    if (topPx > limit) {
      el.remove();
      return;
    }
    if (!el.classList.contains('popped')) {
      rafId = requestAnimationFrame(fall);
    }
  }
  rafId = requestAnimationFrame(fall);

  return el;
}

function spawnHeart() {
  const heart = createFaller(HEART_SYMBOLS, null);

  heart.addEventListener('click', (e) => hitHeart(e, heart));
  heart.addEventListener('touchstart', (e) => {
    e.preventDefault();
    hitHeart(e.touches[0], heart);
  }, { passive: false });
}

function spawnBomb() {
  const bomb = createFaller(BOMB_SYMBOLS, 'hg-bomb');

  bomb.addEventListener('click', (e) => hitBomb(e, bomb));
  bomb.addEventListener('touchstart', (e) => {
    e.preventDefault();
    hitBomb(e.touches[0], bomb);
  }, { passive: false });
}

/* ── Hit handlers ── */
function hitHeart(e, heart) {
  if (!gameActive) return;
  if (heart.classList.contains('popped')) return;

  heart.classList.add('popped');
  score++;
  updateCounter();

  // SFX: basic tap always; bonus sound on every-10-point milestone
  const isMilestone = score % 10 === 0 && score < GOAL;
  if (isMilestone) {
    SFX.bonusEarned();
    showCombo(e.clientX ?? e.pageX, e.clientY ?? e.pageY, score + ' ♥');
  } else {
    SFX.heartTap();
  }

  spawnSparkle(e.clientX ?? e.pageX, e.clientY ?? e.pageY);

  setTimeout(() => heart.remove(), 300);

  if (score >= GOAL) {
    gameActive = false;
    clearTimeout(spawnTimer);
    setTimeout(() => {
      SFX.levelComplete();
      launchConfetti();
      setProgress('hearts_done', 'true');
      document.getElementById('hg-victory').style.display = 'flex';
    }, 400);
  }
}

function hitBomb(e, bomb) {
  if (!gameActive) return;
  if (bomb.classList.contains('popped')) return;

  bomb.classList.add('popped', 'bomb-popped');
  score = Math.max(0, score - BOMB_PENALTY);
  updateCounter();

  SFX.bombPop();

  showCombo(e.clientX ?? e.pageX, e.clientY ?? e.pageY, '-' + BOMB_PENALTY + ' 💣', true);

  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), 400);

  setTimeout(() => bomb.remove(), 350);
}

/* ── UI helpers ── */
function updateCounter() {
  document.getElementById('hg-counter').textContent = score + '/67';
}

function showCombo(x, y, text, isBomb = false) {
  const el = document.createElement('div');
  el.classList.add('combo-text');
  if (isBomb) el.classList.add('bomb-msg');
  el.textContent = text;
  el.style.left = (x - 30) + 'px';
  el.style.top  = (y - 20) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}