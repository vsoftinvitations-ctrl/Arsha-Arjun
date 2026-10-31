import './style.css';
import { renderPreloader, initPreloader } from './components/Preloader.js';
import { initRosePetals } from './components/RosePetals.js';
import { renderCountdown, initCountdown } from './components/Countdown.js';
import { initScrollHint } from './components/ScrollHint.js';
import { W, PHOTOS } from './data.js';

const app = document.getElementById('app');

function coupleCard(person) {
  return `<div class="r couple-card">
    <h3 class="couple-name">${person.name}</h3>
    <div class="couple-rule line-x"></div>
    <p class="couple-sentence"><span class="relation-tag">${person.relation}</span> ${person.father} &amp; ${person.mother}</p>
  </div>`;
}


if (app) {
  const orn = '<svg class="orn r" viewBox="0 0 150 18" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M0 9h55M95 9h55"/><circle cx="75" cy="9" r="4"/><circle cx="65" cy="9" r="2.5"/><circle cx="85" cy="9" r="2.5"/></svg>';
  const pin = '<svg class="pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/></svg>';
  const D = W.date;

  // 1. Put the preloader at the top of your #app:
  app.innerHTML = `
    ${renderPreloader()}

    <section id="intro">
      <div class="cover r">
        <img src="/assets/img2.webp" alt="Arjun and Arsha" decoding="async">
        <canvas id="rose-petals-canvas" aria-hidden="true"></canvas>
      </div>
      <div class="wrap">
        <p class="label r">Together with their families</p>
        <h2 class="intro-names r" aria-label="${W.groom} & ${W.bride}">
          <div class="script-line script-groom">
            <span class="script-text">${W.groom}</span>
            <span class="calligraphy-spark" aria-hidden="true"></span>
          </div>
          <div class="script-line script-amp" aria-hidden="true">
            <span class="amp">&amp;</span>
          </div>
          <div class="script-line script-bride">
            <span class="script-text">${W.bride}</span>
            <span class="calligraphy-spark" aria-hidden="true"></span>
          </div>
          <div class="flourish-wrap" aria-hidden="true">
            <svg class="calligraphy-flourish" viewBox="0 0 280 26" fill="none" preserveAspectRatio="none">
              <path class="flourish-path" d="M14,14 C65,4 105,6 140,16 C175,24 215,10 266,8" stroke="url(#goldFlourishGrad)" stroke-width="2.2" stroke-linecap="round" />
              <defs>
                <linearGradient id="goldFlourishGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="rgba(220, 201, 160, 0.2)" />
                  <stop offset="35%" stop-color="rgba(184, 152, 90, 0.95)" />
                  <stop offset="70%" stop-color="rgba(218, 165, 32, 0.95)" />
                  <stop offset="100%" stop-color="rgba(220, 201, 160, 0.2)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </h2>
        ${orn}
        <p class="quote r">“${W.quotes[0]}”</p>
      </div>
    </section>

    <section class="alt"><div class="wrap">
      <p class="label r">The wedding day</p>
      <div class="daynum r">${D.num}</div>
      <div class="month r">${D.month.toUpperCase()}</div>
      <div class="day r" style="margin-top:10px">${D.day}</div>
      <div class="rule line-x r"></div>
      <div class="time r">Muhurtham: ${W.ceremony.muhurtham}</div>
      ${renderCountdown()}
    </div></section>

    <section><div class="wrap">
      <p class="label r">Wedding Ceremony</p>
      <div class="r">${pin}</div>
      <h2 class="big r">${W.ceremony.venue}</h2>
      <div class="time r" style="margin-top:14px;font-size:clamp(1.2rem,4vw,1.5rem);color:var(--gold)">Muhurtham: ${W.ceremony.muhurtham}</div>
      <p class="small r" style="margin-top:10px;font-size:1.05rem;line-height:1.7;color:var(--mute)">${W.ceremony.address}</p>
      <div style="margin-top:28px" class="r">
        <a class="btn" href="${W.ceremony.map}" target="_blank" rel="noopener noreferrer">View Location on Google Maps</a>
      </div>
    </div></section>

    <section class="alt"><div class="wrap">
      <p class="label r">Reception Details</p>
      <div class="r">${pin}</div>
      <h2 class="big r">${W.reception.venue}</h2>
      <div class="time r" style="margin-top:14px;font-size:clamp(1.2rem,4vw,1.5rem);color:var(--gold)">Reception Time: ${W.reception.time}</div>
      <p class="small r" style="margin-top:10px;font-size:1.05rem;line-height:1.7;color:var(--mute)">${W.reception.address.join('<br>')}</p>
      <div style="margin-top:28px" class="r">
        <a class="btn" href="${W.reception.map}" target="_blank" rel="noopener noreferrer">View Location on Google Maps</a>
      </div>
    </div></section>

    <section><div class="wrap">
      ${orn}
      <p class="body r">${W.invite}</p>
      ${orn}
    </div></section>

    <section class="alt"><div class="wrap" style="max-width:900px">
      <p class="label r">The Couple</p>
      <div class="fam">
        ${coupleCard(W.couple.groom)}
        <div class="sep line-x"></div>
        ${coupleCard(W.couple.bride)}
      </div>
    </div></section>

    <section style="background:linear-gradient(180deg,var(--ivory),var(--blush) 55%,var(--ivory))"><div class="wrap">
      <div class="rule line-x r" style="margin-top:0"></div>
      <p class="quote r">“${W.quotes[1]}”</p>
      <div class="rule line-x r"></div>
    </div></section>

    <section><div class="wrap" style="max-width:560px">
      <div class="gal">
        <div class="ph ga r"><img src="${PHOTOS.a}" alt="Arjun and Arsha" loading="lazy" decoding="async"></div>
        <div class="ph gb r"><img src="${PHOTOS.b}" alt="Arjun and Arsha" loading="lazy" decoding="async"></div>
      </div>
    </div></section>

    <section style="padding-block:clamp(100px,22vw,200px)"><div class="wrap">
      <h2 class="names r" style="font-size:clamp(2.2rem,9vw,3.4rem)">${W.short}</h2>
      <p class="serif r" style="font-size:1.4rem;letter-spacing:.2em;margin-top:24px">${D.dots}</p>
      <div class="rule line-x r"></div>
      <p class="quote r">Together, forever begins here.</p>
      <p class="small r" style="margin-top:28px">With love and blessings</p>
      ${orn}
    </div></section>
  `;

  const fmono = document.getElementById('fmono');
  if (fmono) fmono.textContent = W.footMono;
  const fdate = document.getElementById('fdate');
  if (fdate) fdate.textContent = D.dotted;

  // Scroll reveal
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });

  // 2. Initialize it:
  initPreloader(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.r').forEach(el => io.observe(el));
      const inames = document.querySelector('.intro-names');
      if (inames) inames.classList.add('in');
      setTimeout(() => {
        initRosePetals();
      }, 250);
      // Once the invitation is fully open, show the small subtle scroll down indicator
      setTimeout(() => {
        initScrollHint();
      }, 950);
    });
  });

  // 3. Initialize countdown timer
  initCountdown();
}
