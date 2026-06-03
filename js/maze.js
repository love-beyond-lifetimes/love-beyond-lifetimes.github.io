/* maze.js — Canvas Maze Game
   Player = her.png (Player One navigating to Player Two = me.png)
   Traps are completely invisible — look identical to normal path cells.
*/

// ---- Maze definition ----
// 21×21 grid. 1 = wall, 0 = path, 2 = INVISIBLE TRAP
const MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1],
  [1,0,0,0,1,0,2,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,2,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,2,0,1,0,1],
  [1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1],
  [1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1],
  [1,0,1,0,2,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,0,1],
  [1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,1,0,1,0,2,0,0,0,1,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,2,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const ROWS = MAZE.length;
const COLS = MAZE[0].length;

const START = { row: 1, col: 1 };
const GOAL  = { row: 19, col: 19 };

let cellSize = 36;
let canvas, ctx;

let player = { row: START.row, col: START.col };
const keys = { up: false, down: false, left: false, right: false };

const imgPlayer = new Image();
const imgGoal   = new Image();

let lastMove = 0;
const MOVE_DELAY = 130;

let gameOver  = false;
let trapFlash = 0;
let trapLocked = false;
let trapCount = 0; // track how many times she's been got

// Rotating trap messages — funnier each time
const TRAP_MESSAGES = [
  { emoji: '💀', line1: 'SORRY BABY', line2: 'BACK TO START PO HEHE' },
  { emoji: '😭', line1: 'YOU STEPPED ON LOVE', line2: 'AND LOST. CLASSIC.' },
  { emoji: '🤡', line1: 'CONGRATULATIONS!', line2: 'YOU FOUND A TRAP.' },
  { emoji: '💅', line1: 'AAAND RESET.', line2: 'NT WIFEY KOOO' },
  { emoji: '😈', line1: 'RAWR', line2: 'HEHEHEHE' },
  { emoji: '🚨', line1: 'TRAP DETECTED.', line2: 'SKILL ISSUE.' },
  { emoji: '💔', line1: 'SO CLOSE...', line2: 'KAYA MO YAN BABY.' },
  { emoji: '🐣', line1: 'AWWW BABY STEPS!', line2: 'WRONG ONES THO.' },
];

// ---- Init ----
window.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('maze-canvas');
  ctx = canvas.getContext('2d');

  const maxW = Math.min(window.innerWidth - 32, 700);
  const maxH = window.innerHeight - 180;
  cellSize = Math.floor(Math.min(maxW / COLS, maxH / ROWS));
  cellSize = Math.max(cellSize, 18);

  canvas.width  = COLS * cellSize;
  canvas.height = ROWS * cellSize;

  imgPlayer.src = 'assets/images/her.png';
  imgGoal.src   = 'assets/images/me.png';

  document.addEventListener('keydown', (e) => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)) e.preventDefault();
    if (e.key === 'ArrowUp'    || e.key === 'w') keys.up    = true;
    if (e.key === 'ArrowDown'  || e.key === 's') keys.down  = true;
    if (e.key === 'ArrowLeft'  || e.key === 'a') keys.left  = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp'    || e.key === 'w') keys.up    = false;
    if (e.key === 'ArrowDown'  || e.key === 's') keys.down  = false;
    if (e.key === 'ArrowLeft'  || e.key === 'a') keys.left  = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
  });

  requestAnimationFrame(gameLoop);
});

function setDir(dir)   { keys[dir] = true;  }
function clearDir(dir) { keys[dir] = false; }

// ---- Game loop ----
function gameLoop(ts) {
  if (gameOver || trapLocked) return;

  if (ts - lastMove > MOVE_DELAY) {
    let dr = 0, dc = 0;
    if (keys.up)    dr = -1;
    if (keys.down)  dr =  1;
    if (keys.left)  dc = -1;
    if (keys.right) dc =  1;

    if (dr !== 0 || dc !== 0) {
      const nr = player.row + dr;
      const nc = player.col + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && MAZE[nr][nc] !== 1) {
        player.row = nr;
        player.col = nc;
        lastMove = ts;

        if (MAZE[nr][nc] === 2) {
          triggerTrap();
          return;
        }

        if (player.row === GOAL.row && player.col === GOAL.col) {
          drawFrame();
          triggerVictory();
          return;
        }
      }
    }
  }

  if (trapFlash > 0) trapFlash--;
  drawFrame();
  requestAnimationFrame(gameLoop);
}

// ---- Trap ----
function triggerTrap() {
  trapLocked = true;
  trapFlash  = 22;
  drawFrame();

  SFX.losing();
  showTrapMessage();
  trapCount++;

  setTimeout(() => {
    player.row = START.row;
    player.col = START.col;
    trapFlash  = 0;
    trapLocked = false;
    requestAnimationFrame(gameLoop);
  }, 1400);
}

function showTrapMessage() {
  const el = document.getElementById('trap-msg');
  if (!el) return;

  const msg = TRAP_MESSAGES[trapCount % TRAP_MESSAGES.length];
  const emojiEl = el.querySelector('.trap-emoji');
  const line1El = el.querySelector('.trap-line1');
  const line2El = el.querySelector('.trap-line2');

  if (emojiEl) emojiEl.textContent = msg.emoji;
  if (line1El) line1El.textContent = msg.line1;
  if (line2El) line2El.textContent = msg.line2;

  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 2200);
}

// ---- Draw ----
function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isFlashing = trapFlash > 0;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * cellSize;
      const y = r * cellSize;
      const cell = MAZE[r][c];

      if (cell === 1) {
        ctx.fillStyle = isFlashing ? '#cc1133' : '#ff6b9d';
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.fillStyle = isFlashing ? '#880022' : '#e0397b';
        ctx.fillRect(x, y, cellSize, 3);
        ctx.fillRect(x, y, 3, cellSize);
        ctx.fillStyle = isFlashing ? '#ff4466' : '#ff9dc0';
        ctx.fillRect(x + cellSize - 3, y, 3, cellSize);
        ctx.fillRect(x, y + cellSize - 3, cellSize, 3);
      } else {
        // Path AND trap cells look IDENTICAL — no markers ever
        ctx.fillStyle = 'rgba(255,230,242,0.75)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }

  const pad = Math.floor(cellSize * 0.06);
  const spriteW = cellSize - pad * 2;
  const spriteH = cellSize - pad * 2;

  // Goal (me.png)
  const gx = GOAL.col * cellSize + pad;
  const gy = GOAL.row * cellSize + pad;
  if (imgGoal.complete && imgGoal.naturalWidth > 0) {
    ctx.drawImage(imgGoal, gx, gy, spriteW, spriteH);
  } else {
    ctx.fillStyle = '#e0397b';
    ctx.font = Math.floor(cellSize * 0.7) + 'px serif';
    ctx.fillText('♥', gx + 2, gy + spriteH - 2);
  }

  // Player (her.png)
  const px = player.col * cellSize + pad;
  const py = player.row * cellSize + pad;
  if (imgPlayer.complete && imgPlayer.naturalWidth > 0) {
    ctx.drawImage(imgPlayer, px, py, spriteW, spriteH);
  } else {
    ctx.fillStyle = '#ff6b9d';
    ctx.beginPath();
    ctx.arc(px + spriteW / 2, py + spriteH / 2, spriteW / 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---- Victory ----
function triggerVictory() {
  gameOver = true;
  SFX.levelComplete();
  if (typeof launchConfetti === 'function') launchConfetti();
  const overlay = document.getElementById('victory-overlay');
  if (overlay) overlay.style.display = 'flex';
  if (typeof setProgress === 'function') setProgress('maze_done', 'true');
}