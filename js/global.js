/* ============================================
   LOVE BEYOND LIFETIMES — Global JS Utilities
   ============================================ */

// ---- Page transition helper ----
function goTo(url, delay = 400) {
  const overlay = document.getElementById('transition-overlay');
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => { window.location.href = url; }, delay);
  } else {
    window.location.href = url;
  }
}

// ---- Spawn floating petals ----
function spawnPetals(container, count = 15) {
  const symbols = ['🌸', '🌺', '✿', '❀', '💮'];
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.fontSize = (10 + Math.random() * 14) + 'px';
    petal.style.animationDuration = (5 + Math.random() * 8) + 's';
    petal.style.animationDelay = (Math.random() * 6) + 's';
    container.appendChild(petal);
  }
}

// ---- Spawn floating hearts ----
function spawnHearts(container, count = 8) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.classList.add('heart-float');
    h.textContent = '♥';
    h.style.left = (5 + Math.random() * 90) + 'vw';
    h.style.top  = (10 + Math.random() * 70) + 'vh';
    h.style.fontSize = (12 + Math.random() * 18) + 'px';
    h.style.animationDuration = (2 + Math.random() * 3) + 's';
    h.style.animationDelay = (Math.random() * 2) + 's';
    h.style.color = ['#ff6b9d','#e0397b','#ffaac8','#ff4081'][Math.floor(Math.random()*4)];
    container.appendChild(h);
  }
}

// ---- Spawn a sparkle burst at position ----
function spawnSparkle(x, y) {
  const s = document.createElement('div');
  s.classList.add('sparkle');
  s.textContent = ['✨','💖','⭐','🌟','💗'][Math.floor(Math.random()*5)];
  s.style.left = (x - 10) + 'px';
  s.style.top  = (y - 10) + 'px';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 700);
}

/* =============================================
   MUSIC CONTROLLER
   Strategy:
   - localStorage 'lbl_music' = 'off' means user muted it
   - On every page we try to play immediately
   - If browser blocks autoplay, we attach a one-time
     unlock handler on the first user gesture (click/touch/key)
   - The unlock fires play() once, then removes itself
   ============================================= */

let bgMusic = null;
let musicOn = localStorage.getItem('lbl_music') !== 'off';
let _unlockBound = false;
let _audioUnlocked = false; // permanent flag — once unlocked, never re-arm

function _getMusicSrc() {
  // Resolve path relative to site root regardless of page location
  // All pages are in root, so 'assets/music/Date.mp3' is always correct.
  return 'assets/music/Date.mp3';
}

function _tryPlay() {
  if (!bgMusic || !musicOn) return;
  const p = bgMusic.play();
  if (p && typeof p.catch === 'function') {
    p.catch(() => {
      // Autoplay blocked — arm the unlock-on-gesture handler
      _armUnlock();
    });
  }
}

function _armUnlock() {
  if (_unlockBound || _audioUnlocked) return;
  _unlockBound = true;

  function _unlock() {
    _audioUnlocked = true; // permanent — never re-arm
    _unlockBound = false;
    if (bgMusic && musicOn) {
      bgMusic.play().catch(() => {});
    }
  }

  document.addEventListener('click',    _unlock, { capture: true, once: true });
  document.addEventListener('touchend', _unlock, { capture: true, once: true });
  document.addEventListener('keydown',  _unlock, { capture: true, once: true });
}

function initMusic(src) {
  // Reuse existing <audio id="bg-audio"> if present (index.html has one)
  const existing = document.getElementById('bg-audio');
  if (existing) {
    bgMusic = existing;
  } else {
    bgMusic = new Audio(src || _getMusicSrc());
  }

  bgMusic.loop   = true;
  bgMusic.volume = 0.4;

  // Set playback time from session so music feels continuous across pages
  const savedTime = parseFloat(sessionStorage.getItem('lbl_music_time') || '0');
  if (!isNaN(savedTime) && savedTime > 0) {
    if (bgMusic.readyState >= 1) {
      bgMusic.currentTime = savedTime;
    } else {
      bgMusic.addEventListener('loadedmetadata', () => {
        bgMusic.currentTime = savedTime;
      }, { once: true });
    }
  }

  // Save playback position before user leaves the page
  window.addEventListener('beforeunload', () => {
    if (bgMusic) sessionStorage.setItem('lbl_music_time', bgMusic.currentTime);
  });

  if (musicOn) {
    _tryPlay();
  }

  updateMusicBtn();
}

function toggleMusic() {
  musicOn = !musicOn;
  localStorage.setItem('lbl_music', musicOn ? 'on' : 'off');
  if (bgMusic) {
    if (musicOn) {
      bgMusic.play().catch(() => {});
    } else {
      bgMusic.pause();
    }
  }
  updateMusicBtn();
}

function updateMusicBtn() {
  const btn = document.getElementById('music-btn');
  if (btn) btn.textContent = musicOn ? '♪ ON' : '♪ OFF';
}

// ---- Auto-init music on every page ----
document.addEventListener('DOMContentLoaded', () => {
  // index.html has its own <audio id="bg-audio"> — initMusic() handles both cases
  initMusic(_getMusicSrc());
});

// ---- Confetti burst ----
function launchConfetti() {
  const colors = ['#ff6b9d','#ffaac8','#ffd6e7','#ff4081','#ffffff','#e0397b'];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div');
    c.style.cssText = `
      position:fixed;
      width:${6+Math.random()*6}px;
      height:${6+Math.random()*6}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random()>0.5?'50%':'2px'};
      top:${Math.random()*30}vh;
      left:${Math.random()*100}vw;
      z-index:9998;
      pointer-events:none;
      animation: confettiFall ${1.5+Math.random()*2}s ease forwards;
      animation-delay:${Math.random()*0.5}s;
      --rot:${360+Math.random()*360}deg;
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

// Inject confetti keyframes once
(function() {
  if (!document.getElementById('confetti-style')) {
    const s = document.createElement('style');
    s.id = 'confetti-style';
    s.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg); opacity:1; }
        100% { transform: translateY(90vh) rotate(var(--rot, 720deg)); opacity:0; }
      }
    `;
    document.head.appendChild(s);
  }
})();

// ---- Typewriter effect ----
function typeWriter(el, text, speed = 40, cb = null) {
  el.textContent = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.animation = 'blink 0.7s step-end infinite';
  el.appendChild(cursor);

  if (!document.getElementById('blink-style')) {
    const s = document.createElement('style');
    s.id = 'blink-style';
    s.textContent = '@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }';
    document.head.appendChild(s);
  }

  const iv = setInterval(() => {
    el.insertBefore(document.createTextNode(text[i]), cursor);
    i++;
    if (i >= text.length) {
      clearInterval(iv);
      cursor.remove();
      if (cb) cb();
    }
  }, speed);
}

/* =============================================
   SFX MANAGER
   Lightweight one-shot sound effect player.
   All sfx files live in assets/sfx/.
   ============================================= */

const SFX = {
  _cache: {},

  _get(name) {
    if (!this._cache[name]) {
      this._cache[name] = new Audio('assets/sfx/' + name + '.mp3');
    }
    return this._cache[name];
  },

  play(name, volume = 0.6) {
    try {
      const audio = this._get(name).cloneNode();
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch (e) { /* silently ignore */ }
  },

  // Convenience aliases
  bombPop()      { this.play('bomb-pop'); },
  bonusEarned()  { this.play('bonus-earned'); },
  levelComplete(){ this.play('completion-of-a-level'); },
  gameStart()    { this.play('game-start'); },
  milestone()    { this.play('heart-simulator-milestone-notification'); },
  heartTap()     { this.play('heart-tap', 0.5); },
  losing()       { this.play('losing'); },
  nextButton()   { this.play('next-button'); },
  select()       { this.play('select'); },
};

// ---- localStorage progression helpers ----
function setProgress(key, val) { localStorage.setItem('lbl_' + key, val); }
function getProgress(key)      { return localStorage.getItem('lbl_' + key); }
function resetProgress() {
  ['reasons_unlocked','reasons_done','hearts_done','maze_done','sim_done']
    .forEach(k => localStorage.removeItem('lbl_' + k));
}
