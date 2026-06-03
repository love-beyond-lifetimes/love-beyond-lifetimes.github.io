/* greeting.js — Dialogue System */
/* NOTE: typeWriter, spawnPetals, toggleMusic are all defined in global.js.
   This file only defines greeting-specific logic. */

const dialogues = [
  "hi baby ><",
  "I assume you know what this is?",
  "I know it's not much, but I hope you like it \u2661"
];

let currentLine = 0;
let isTyping = false;

function showLine(idx) {
  const textEl = document.getElementById('dialogue-text');
  const arrow  = document.getElementById('next-arrow');
  isTyping = true;
  arrow.style.opacity = '0.3';
  typeWriter(textEl, dialogues[idx], 48, () => {
    isTyping = false;
    arrow.style.opacity = '';
    if (idx === dialogues.length - 1) {
      setTimeout(() => {
        arrow.style.display = 'none';
        document.getElementById('continue-area').style.display = 'block';
      }, 400);
    }
  });
}

function nextDialogue() {
  if (isTyping) return;
  SFX.nextButton();
  currentLine++;
  if (currentLine < dialogues.length) showLine(currentLine);
}

window.addEventListener('DOMContentLoaded', () => {
  // Use global.js spawnPetals (emoji-based) — matches the rest of the project
  spawnPetals(document.getElementById('petals'), 14);
  showLine(0);
  document.getElementById('dialogue-bubble').addEventListener('click', nextDialogue);
});