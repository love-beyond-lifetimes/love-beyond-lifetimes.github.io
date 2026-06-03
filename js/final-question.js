/* final-question.js */

let noMoved      = false;
let noClickCount = 0;
let yesScale     = 1;   // tracks cumulative YES growth

window.addEventListener('DOMContentLoaded', () => {
  spawnPetals(document.getElementById('petals'), 16);
  spawnHearts(document.querySelector('.fq-content'), 8);
});

function runFromCursor() {
  const noBtn  = document.getElementById('no-btn');
  const yesBtn = document.getElementById('yes-btn');

  // ---- First time: lift NO to fixed at its exact painted position ----
  if (!noMoved) {
    const rect = noBtn.getBoundingClientRect();

    const placeholder = document.createElement('div');
    placeholder.id = 'no-placeholder';
    placeholder.style.cssText = `
      display: inline-block;
      width: ${rect.width}px;
      height: ${rect.height}px;
      visibility: hidden;
      flex-shrink: 0;
    `;
    noBtn.parentNode.insertBefore(placeholder, noBtn.nextSibling);

    noBtn.style.position = 'fixed';
    noBtn.style.left     = rect.left + 'px';
    noBtn.style.top      = rect.top  + 'px';
    noBtn.style.width    = rect.width  + 'px';
    noBtn.style.height   = rect.height + 'px';
    noBtn.style.margin   = '0';
    noBtn.style.zIndex   = '999';

    noMoved = true;
    setTimeout(() => moveNoRandom(), 30);
  } else {
    moveNoRandom();
  }

  // Grow YES bigger each dodge — caps at 2.2x
  yesScale = Math.min(yesScale + 0.18, 2.2);
  yesBtn.style.transform = `scale(${yesScale})`;
  yesBtn.style.boxShadow = yesScale > 1.4
    ? `6px 6px 0 var(--dark), 0 0 20px rgba(255,100,157,0.6)`
    : `6px 6px 0 var(--dark)`;
}

function moveNoRandom() {
  const noBtn  = document.getElementById('no-btn');
  const yesBtn = document.getElementById('yes-btn');

  const noW = noBtn.offsetWidth  || 80;
  const noH = noBtn.offsetHeight || 40;
  const pad = 12;

  const maxX = window.innerWidth  - noW - pad;
  const maxY = window.innerHeight - noH - pad;
  const yesRect = yesBtn.getBoundingClientRect();

  let rx, ry, tries = 0;
  do {
    rx = pad + Math.random() * (maxX - pad);
    ry = pad + Math.random() * (maxY - pad);
    tries++;
    const overlapsYes =
      rx < yesRect.right  + 30 &&
      rx + noW > yesRect.left  - 30 &&
      ry < yesRect.bottom + 30 &&
      ry + noH > yesRect.top   - 30;
    if (!overlapsYes) break;
  } while (tries < 25);

  noBtn.style.left = rx + 'px';
  noBtn.style.top  = ry + 'px';

  noClickCount++;
  const hint = document.getElementById('fq-hint');
  const msgs = [
    'the answer is yes ♡',
    'NO is broken, please use YES',
    'nice try... but just say yes',
    'stop chasing the wrong button baby',
    'i think you know the answer ><',
    'the NO button has left the chat :3',
    'just... click YES na please ><',
  ];
  hint.textContent = msgs[Math.min(noClickCount - 1, msgs.length - 1)];
}

function handleYes() {
  SFX.levelComplete();
  launchConfetti();
  for (let i = 0; i < 15; i++) {
    setTimeout(() => spawnSparkle(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight
    ), i * 80);
  }
  setTimeout(() => goTo('girlfriend.html'), 800);
}