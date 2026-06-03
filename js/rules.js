/* rules.js */

window.addEventListener('DOMContentLoaded', () => {
  spawnPetals(document.getElementById('petals'), 12);
});

function handleCheck(input) {
  SFX.select();
  const label = input.closest('.rule-check-label');
  label.classList.toggle('checked', input.checked);

  // Check if all are checked
  const all = document.querySelectorAll('.rule-cb');
  const allChecked = Array.from(all).every(cb => cb.checked);

  const btn = document.getElementById('agree-btn');
  const hint = document.getElementById('agree-hint');

  btn.disabled = !allChecked;
  if (allChecked) {
    hint.classList.add('hidden');
    btn.style.opacity = '1';
  }
}

function handleAgree() {
  SFX.nextButton();
  launchConfetti();
  // Small delay then navigate
  setTimeout(() => {
    goTo('maze.html');
  }, 1200);
}