// ==========================================
// CLIENT DETAILS — EDIT THESE 5 LINES:
// ==========================================
const NAME_1 = "Arjun";
const NAME_2 = "Arsha";
const WEDDING_DATE = "22 . NOVEMBER . 2026";
const BG_IMAGE_URL = "/assets/preloder.png";
const BG_MUSIC_URL = "/wedding.mp3";
// ==========================================
let bgAudio = null;
let audioFadeInterval = null;

function playMusic() {
  try {
    if (!bgAudio) {
      bgAudio = document.getElementById('wedding-audio') || document.getElementById('bg-music');
      if (!bgAudio) {
        bgAudio = new Audio(BG_MUSIC_URL);
        bgAudio.id = 'bg-music';
        document.body.appendChild(bgAudio);
      }
      bgAudio.loop = true;
      bgAudio.preload = 'auto';
    }

    if (!bgAudio.src || !bgAudio.src.includes('wedding.mp3')) {
      bgAudio.src = BG_MUSIC_URL;
    }

    // If audio is already actively playing, keep playing seamlessly (do not reset volume)
    if (!bgAudio.paused && bgAudio.currentTime > 0) {
      if (bgAudio.volume < 0.8 && !audioFadeInterval) {
        bgAudio.volume = 0.8;
      }
      return;
    }

    const promise = bgAudio.play();
    if (promise !== undefined) {
      promise.then(() => {
        if (bgAudio.volume < 0.2) {
          bgAudio.volume = 0.05;
          let vol = 0.05;
          if (audioFadeInterval) clearInterval(audioFadeInterval);
          audioFadeInterval = setInterval(() => {
            vol = Math.min(0.8, vol + 0.08);
            if (bgAudio) bgAudio.volume = vol;
            if (vol >= 0.8) {
              clearInterval(audioFadeInterval);
              audioFadeInterval = null;
            }
          }, 60);
        }
      }).catch(() => { });
    }
  } catch (e) { }
}
export function renderPreloader(customConfig = {}) {
  const name1 = customConfig.name1 || customConfig.groom || NAME_1;
  const name2 = customConfig.name2 || customConfig.bride || NAME_2;
  const date = customConfig.date || WEDDING_DATE;
  const bgImg = customConfig.bgImage || BG_IMAGE_URL;

  return `
    <div id="wedding-preloader" class="wedding-preloader" role="dialog" aria-modal="true" aria-label="Wedding Invitation Preloader">
      <!-- Fullscreen Background Image with Ken Burns effect -->
      <div class="preloader-bg-media">
        <img src="${bgImg}" alt="${name1} &amp; ${name2}" class="preloader-bg-img" />
        <div class="preloader-overlay"></div>
      </div>
      <!-- Floating Gold Stardust -->
      <div class="preloader-particles" aria-hidden="true">
        <span class="preloader-particle p1"></span>
        <span class="preloader-particle p2"></span>
        <span class="preloader-particle p3"></span>
        <span class="preloader-particle p4"></span>
        <span class="preloader-particle p5"></span>
        <span class="preloader-particle p6"></span>
      </div>
      <!-- Initial Gate: Center Tagline + Bottom Tap to Open Pill Button -->
      <div class="preloader-gate-wrapper" id="preloader-gate-wrapper">
        <div class="preloader-gate-center">
          <div class="preloader-gate-badge">
            <span class="preloader-tagline">WEDDING INVITATION</span>
          </div>
        </div>
        <div class="preloader-gate-bottom">
          <button class="preloader-open-pill-btn" id="preloader-enter-btn" aria-label="Tap to Open Invitation">
            <span>Tap to Open</span>
          </button>
        </div>
      </div>
      <!-- Center Handwriting Script Animation -->
      <div class="preloader-content" id="preloader-content-box">
        <div class="preloader-top-badge">
          <span class="preloader-tagline">WEDDING INVITATION</span>
        </div>
        <div class="preloader-script-container" id="preloader-script-box">
          <!-- Line 1: First Name (Arjun) -->
          <div class="script-line script-name-1">
            <span class="script-text">${name1}</span>
            <span class="calligraphy-pen-spark"></span>
          </div>
          <!-- Line 2: Ampersand -->
          <div class="script-line script-ampersand">
            <span class="script-text">&amp;</span>
          </div>
          <!-- Line 3: Second Name (Arsha) -->
          <div class="script-line script-name-2">
            <span class="script-text">${name2}</span>
            <span class="calligraphy-pen-spark"></span>
          </div>
          <!-- Underline Calligraphy Flourish -->
          <div class="flourish-wrap">
            <svg class="calligraphy-flourish" viewBox="0 0 280 26" fill="none">
              <path class="flourish-path" d="M14,14 C65,4 105,6 140,16 C175,24 215,10 266,8" stroke="url(#goldFlourishGrad)" stroke-width="2.2" stroke-linecap="round" />
              <defs>
                <linearGradient id="goldFlourishGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="rgba(245, 230, 180, 0.1)" />
                  <stop offset="35%" stop-color="rgba(255, 235, 170, 0.95)" />
                  <stop offset="70%" stop-color="rgba(218, 165, 32, 0.95)" />
                  <stop offset="100%" stop-color="rgba(245, 230, 180, 0.1)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <!-- Date -->
        <div class="preloader-subtext">
          <p class="preloader-date">${date}</p>
        </div>
      </div>
    </div>
  `;
}
export function initPreloader(onDismissCallback) {
  const preloader = document.getElementById('wedding-preloader');
  if (!preloader) return;

  let stage = 'waiting'; // 'waiting' | 'revealing' | 'dismissed'
  let autoDismissTimer = null;

  // Strict scroll lock on both html and body
  document.documentElement.classList.add('preloader-active');
  document.body.classList.add('preloader-active');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);

  function preventScroll(e) {
    if (stage !== 'dismissed') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });

  // Pre-load font in background
  if (document.fonts?.load) {
    document.fonts.load('48px "Brittany Signature"').catch(() => { });
  }

  function handleTapToOpen() {
    if (stage !== 'waiting') return;
    stage = 'revealing';

    // 1. Play music immediately on user gesture
    playMusic();

    // 2. Start handwriting animation
    preloader.classList.add('preloader-animating');

    // 3. Shimmer sweep after writing finishes (5.0s)
    setTimeout(() => {
      const scriptBox = document.getElementById('preloader-script-box');
      if (scriptBox) {
        scriptBox.classList.add('shimmer-active');
        scriptBox.querySelectorAll('.script-text').forEach((el) => {
          el.style.clipPath = 'none';
          el.style.opacity = '1';
          el.style.visibility = 'visible';
        });
      }
    }, 5000);

    // 4. Smooth reveal of the invitation page (6.0s)
    autoDismissTimer = setTimeout(() => {
      dismissPreloader();
    }, 6000);
  }

  function dismissPreloader() {
    if (stage === 'dismissed') return;
    stage = 'dismissed';
    if (autoDismissTimer) clearTimeout(autoDismissTimer);

    // Remove scroll locks
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);

    playMusic();
    preloader.classList.add('preloader-fade-out');
    preloader.style.pointerEvents = 'none';

    document.documentElement.classList.remove('preloader-active');
    document.body.classList.remove('preloader-active');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.body.style.height = '';

    if (typeof onDismissCallback === 'function') {
      try { onDismissCallback(); } catch (err) { console.error(err); }
    }

    setTimeout(() => {
      preloader.style.display = 'none';
      preloader.setAttribute('aria-hidden', 'true');
    }, 1250);
  }

  // ONLY the 'Tap to Open' button opens the invitation — clicking outside does not
  const enterBtn = document.getElementById('preloader-enter-btn');
  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleTapToOpen();
    });

    enterBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        handleTapToOpen();
      }
    });
  }

  // Strictly disallow clicking anywhere outside the 'Tap to Open' button
  preloader.addEventListener('click', (e) => {
    if (enterBtn && e.target !== enterBtn && !enterBtn.contains(e.target)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}
