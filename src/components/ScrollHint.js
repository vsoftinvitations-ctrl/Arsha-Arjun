// Luxury Floating Scroll Down Indicator
let hasScrolledOnce = false;

export function initScrollHint() {
  if (hasScrolledOnce || (typeof window !== 'undefined' && window.scrollY > 20) || document.getElementById('scroll-hint')) return;

  const hint = document.createElement('div');
  hint.id = 'scroll-hint';
  hint.className = 'scroll-hint';
  hint.setAttribute('role', 'button');
  hint.setAttribute('tabindex', '0');
  hint.setAttribute('aria-label', 'Scroll down to view invitation details');
  hint.innerHTML = `
    <span class="scroll-hint-label">Scroll Down</span>
    <svg class="scroll-hint-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `;
  document.body.appendChild(hint);

  // Smooth fade-in
  requestAnimationFrame(() => {
    hint.classList.add('visible');
  });

  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    hasScrolledOnce = true;

    hint.classList.remove('visible');
    hint.classList.add('hidden');

    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('keydown', onKeyDown);

    setTimeout(() => {
      if (hint.parentNode) {
        hint.parentNode.removeChild(hint);
      }
    }, 550);
  }

  function onScroll() {
    if (window.scrollY > 10) {
      dismiss();
    }
  }

  function onWheel(e) {
    if (e.deltaY > 3) {
      dismiss();
    }
  }

  function onKeyDown(e) {
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      dismiss();
    }
  }

  let touchStartY = 0;
  function onTouchStart(e) {
    if (e.touches && e.touches[0]) {
      touchStartY = e.touches[0].clientY;
    }
  }

  function onTouchMove(e) {
    if (e.touches && e.touches[0]) {
      const delta = touchStartY - e.touches[0].clientY;
      if (delta > 8) {
        dismiss();
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('keydown', onKeyDown, { passive: true });

  // Tapping the hint also dismisses it and gently scrolls down
  hint.addEventListener('click', (e) => {
    e.preventDefault();
    dismiss();
    const introNames = document.querySelector('.intro-names') || document.getElementById('intro');
    if (introNames) {
      introNames.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: 320, behavior: 'smooth' });
    }
  });
}
