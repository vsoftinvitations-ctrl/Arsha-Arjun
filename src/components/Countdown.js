/**
 * ============================================================================
 * LUXURY WEDDING COUNTDOWN TIMER
 * ============================================================================
 * Accurate, elegant countdown timer ticking down to Arjun & Arsha's wedding
 * ceremony on 22 November 2026 at 6:00 AM IST.
 */

// Target Wedding Muhurtham: 22 November 2026, 6:00 AM IST (+05:30)
const WEDDING_TARGET_TIME = new Date('2026-11-22T06:00:00+05:30').getTime();

export function renderCountdown() {
  return `
    <div class="countdown-container r" id="wedding-countdown" role="timer" aria-label="Countdown to Wedding">
      <div class="countdown-item">
        <span class="countdown-num" id="cd-days">--</span>
        <span class="countdown-label">Days</span>
      </div>
      <span class="countdown-colon" aria-hidden="true">:</span>
      <div class="countdown-item">
        <span class="countdown-num" id="cd-hours">--</span>
        <span class="countdown-label">Hours</span>
      </div>
      <span class="countdown-colon" aria-hidden="true">:</span>
      <div class="countdown-item">
        <span class="countdown-num" id="cd-minutes">--</span>
        <span class="countdown-label">Mins</span>
      </div>
      <span class="countdown-colon" aria-hidden="true">:</span>
      <div class="countdown-item">
        <span class="countdown-num" id="cd-seconds">--</span>
        <span class="countdown-label">Secs</span>
      </div>
    </div>
  `;
}

export function initCountdown(targetTimestamp = WEDDING_TARGET_TIME) {
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  if (!elDays || !elHours || !elMinutes || !elSeconds) return null;

  function update() {
    const now = Date.now();
    const diff = targetTimestamp - now;

    if (diff <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      const container = document.getElementById('wedding-countdown');
      if (container) {
        container.setAttribute('aria-label', 'The Wedding Celebration Has Begun!');
      }
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    elDays.textContent = String(days);
    elHours.textContent = String(hours).padStart(2, '0');
    elMinutes.textContent = String(minutes).padStart(2, '0');
    elSeconds.textContent = String(seconds).padStart(2, '0');
  }

  // Run immediately to eliminate any delay
  update();
  const timer = setInterval(update, 1000);

  return {
    stop() {
      clearInterval(timer);
    }
  };
}
