/* reasons.js — progression logic */

const reasonPages = ['reason1.html','reason2.html','reason3.html','reason4.html'];

window.addEventListener('DOMContentLoaded', () => {
  spawnPetals(document.getElementById('petals'), 14);
  loadProgress();
});

function loadProgress() {
  const unlocked = parseInt(getProgress('reasons_unlocked') || '0');
  const done     = parseInt(getProgress('reasons_done')     || '0');

  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById('reason-' + i);
    if (!btn) continue;

    if (i < done) {
      // Already completed
      btn.disabled = true;
      btn.classList.remove('locked');
      btn.classList.add('done');
    } else if (i === unlocked) {
      // Currently unlocked and playable
      btn.disabled = false;
      btn.classList.remove('locked');
      btn.classList.remove('done');
    } else {
      // Still locked
      btn.disabled = true;
      btn.classList.remove('done');
      btn.classList.add('locked');
    }
  }

  // Show secret note button when all 4 done
  const secretBtn = document.getElementById('reason-secret');
  if (secretBtn) {
    secretBtn.style.display = done >= 4 ? 'block' : 'none';
  }
}

function openReason(index) {
  SFX.select();
  goTo(reasonPages[index]);
}