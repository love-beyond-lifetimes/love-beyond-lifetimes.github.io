/* flowers.js */

const NOTES = [
  {
    title: 'Thank you for being my favorite coincidence.',
    body:  'What started as something random, like two paths crossing by chance, became something I now treasure deeply. Meeting you feels like finding a flower I never knew I was searching for.'
  },
  {
    title: 'Thank you for loving me.',
    body:  'Like a lisianthus that blooms softly even when unnoticed, your love finds its way to me in the quietest, gentlest forms. Out of everyone, I am the one you chose to care for — and that is something I will always hold gently in my heart.'
  },
  {
    title: 'Thank you for making ordinary days feel special.',
    body:  'You turn simple days into something soft and warm, like petals slowly opening in sunlight. Even the quietest moments feel meaningful just because you\'re part of them.'
  },
  {
    title: 'Thank you for making me smile so much.',
    body:  'You bring a kind of happiness that feels light, like petals moving in a gentle breeze. Even without trying, you make my world feel softer.'
  },
  {
    title: 'Thank you for making the world feel beautiful again.',
    body:  'Because of you, even ordinary things feel softer and more meaningful, like a garden after rain. You make life feel a little more worth looking at.'
  },
  {
    title: 'Thank you for making me feel at home.',
    body:  'Being with you feels like resting beside something familiar and safe, like flowers placed in a quiet room that make everything feel calmer just by being there.'
  },
  {
    title: 'Thank you for being you.',
    body:  'Everything about you feels naturally beautiful, like a flower that doesn\'t need to try to be admired. Your kindness, your laughter, and even your quiet moments are things I admire deeply.'
  },
  {
    title: 'Thank you for trusting me.',
    body:  'Like a delicate bloom opening slowly, you let me see parts of your world that I know are precious. I don\'t take that trust lightly — it\'s something I will always protect gently.'
  },
  {
    title: 'Thank you for letting me love you.',
    body:  'Like holding a bouquet of lisianthus carefully in my hands, I cherish this feeling softly and sincerely. Loving you is something I will always treat gently, because it means so much to me.'
  },
  {
    title: 'Thank you for making me believe some people are worth waiting a lifetime for.',
    body:  'You made patience feel like something gentle instead of painful, like waiting for a flower to fully bloom in its own time. And somehow, it feels worth it because it\'s you.'
  },
];

const openedNotes = new Set();
const TOTAL_NOTES = NOTES.length;

window.addEventListener('DOMContentLoaded', () => {
  spawnPetals(document.getElementById('petals'), 18);
});

let _sfxCooldown = false;

function openNote(index) {
  // Prevent SFX error from rapid repeated clicks
  if (!_sfxCooldown) {
    SFX.heartTap();
    _sfxCooldown = true;
    setTimeout(() => { _sfxCooldown = false; }, 350);
  }
  const note    = NOTES[index];
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = note.title;
  document.getElementById('modal-body').textContent  = note.body;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Mark pill as opened
  openedNotes.add(index);
  const pill = document.querySelector(`.note-pill[data-index="${index}"]`);
  if (pill) pill.classList.add('opened');

  // Show next button once all notes opened
  if (openedNotes.size >= TOTAL_NOTES) {
    showNextButton();
  }
}

function closeNote() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function showNextButton() {
  const btn = document.getElementById('next-btn');
  if (btn) {
    btn.classList.add('visible');
    btn.addEventListener('click', () => SFX.nextButton(), { once: true });
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNote();
});