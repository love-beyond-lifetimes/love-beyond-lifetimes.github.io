/* love-letter.js */

window.addEventListener('DOMContentLoaded', () => {
  spawnPetals(document.getElementById('petals'), 18);

  // After envelope intro (2.5s), reveal letter
  setTimeout(() => {
    const wrap = document.getElementById('letter-wrap');
    wrap.style.opacity = '1';
    startReveal();
  }, 2600);
});

function startReveal() {
  // Use IntersectionObserver to reveal paragraphs as user scrolls
  const paras = document.querySelectorAll('.lp');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // First few paragraphs revealed immediately
  paras.forEach((p, i) => {
    if (i < 3) {
      setTimeout(() => p.classList.add('visible'), i * 400);
    } else {
      observer.observe(p);
    }
  });

  // Show finale button when last paragraph is visible — delay observer until wrap is visible
  const lastPara = paras[paras.length - 1];
  setTimeout(() => {
    const finaleObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const finale = document.getElementById('letter-finale');
        finale.style.opacity = '1';
        finaleObs.unobserve(lastPara);
      }
    }, { threshold: 0.5 });
    finaleObs.observe(lastPara);
  }, 600); // wait for letter-wrap opacity transition (~0.5s) to finish
}