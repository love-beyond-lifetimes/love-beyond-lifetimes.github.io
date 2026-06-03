/* reason-page.js — shared logic for all reason pages */

window.addEventListener('DOMContentLoaded', () => {
  spawnPetals(document.getElementById('petals'), 14);

  // Fade in paragraphs with stagger
  const paras = document.querySelectorAll('#reason-body p');
  paras.forEach((p, i) => {
    setTimeout(() => p.classList.add('visible'), 300 + i * 400);
  });

  // Show Next button after all paragraphs
  const delay = 300 + paras.length * 400 + 300;
  setTimeout(() => {
    document.getElementById('next-area').classList.add('visible');
  }, delay);
});

// Called with: completeReason(reasonNumber, 'reasons.html')
// reasonNumber is 1-based
function completeReason(num, nextPage) {
  SFX.nextButton();
  // Mark this reason as done; unlock the next one (0-based index = num)
  const done = Math.max(num, parseInt(getProgress('reasons_done') || '0'));
  setProgress('reasons_done', done);
  setProgress('reasons_unlocked', done); // next unlocked index = done count

  goTo(nextPage);
}