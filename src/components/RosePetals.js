/**
 * ============================================================================
 * LUXURY FALLING ROSE PETALS ANIMATION (Pushpavrishti)
 * ============================================================================
 * Delicate HTML5 Canvas animation simulating tiny 3D rose petals gently
 * fluttering and falling ONLY over the first inner cover image (.cover).
 * Petals feature true 3D tumbling (roll, pitch, yaw) with dark velvet undertones
 * on flip, gentle wind drift, and smooth container-bound masking.
 */

const ROSE_PALETTES = [
  // 1. Classic Royal Ruby
  {
    front: ['#a81b2c', '#c72438', '#7a0e1c'],
    back: ['#580812', '#720c19']
  },
  // 2. Deep Velvet Crimson
  {
    front: ['#921424', '#b51d31', '#6b0b17'],
    back: ['#4b060e', '#610a14']
  },
  // 3. Romantic Rose Wine
  {
    front: ['#ba2136', '#db324b', '#8f1224'],
    back: ['#630a17', '#7c1020']
  },
  // 4. Soft Blush Coral Rose
  {
    front: ['#d94d65', '#eb6880', '#ad3249'],
    back: ['#8c1e32', '#a82941']
  },
  // 5. Deep Temple Baccara
  {
    front: ['#82101e', '#9e1728', '#5e0813'],
    back: ['#3e040a', '#540710']
  }
];

class PetalEngine {
  constructor(canvas, container) {
    this.canvas = canvas;
    this.container = container || canvas.parentElement || document.body;
    this.ctx = canvas.getContext('2d');
    this.petals = [];
    this.animationId = null;
    this.lastTime = performance.now();
    this.wind = { x: 0.06, targetX: 0.08, changeTimer: 0 };
    this.mouse = { x: -9999, y: -9999, vx: 0, vy: 0, lastX: 0, lastY: 0 };
    this.isRunning = false;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.onResize = this.onResize.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.loop = this.loop.bind(this);
  }

  init() {
    this.updateDimensions();
    this.createPetals();

    window.addEventListener('resize', this.onResize, { passive: true });
    if (window.ResizeObserver && this.container) {
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.container);
    }

    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.container.addEventListener('pointermove', this.onPointerMove, { passive: true });
    this.container.addEventListener('touchmove', this.onPointerMove, { passive: true });

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.start();
  }

  updateDimensions() {
    this.width = this.container ? (this.container.offsetWidth || window.innerWidth) : window.innerWidth;
    this.height = this.container ? (this.container.offsetHeight || window.innerHeight) : window.innerHeight;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  onResize() {
    this.updateDimensions();
    for (const p of this.petals) {
      if (p.x > this.width + 50) p.x = Math.random() * this.width;
    }
  }

  onVisibilityChange() {
    if (document.hidden) {
      this.stop();
    } else {
      this.lastTime = performance.now();
      this.start();
    }
  }

  onPointerMove(e) {
    const rect = this.container.getBoundingClientRect();
    const clientX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const clientY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    if (this.mouse.lastX) {
      this.mouse.vx = (clientX - this.mouse.lastX) * 0.06;
      this.mouse.vy = (clientY - this.mouse.lastY) * 0.06;
    }
    this.mouse.x = clientX;
    this.mouse.y = clientY;
    this.mouse.lastX = clientX;
    this.mouse.lastY = clientY;
  }

  createPetals() {
    // 22 petals inside the cover image for an exquisite, uncluttered shower
    const count = this.width < 768 ? 16 : 22;
    this.petals = [];

    for (let i = 0; i < count; i++) {
      this.petals.push(this.spawnPetal(true));
    }
  }

  spawnPetal(initial = false) {
    const palette = ROSE_PALETTES[Math.floor(Math.random() * ROSE_PALETTES.length)];
    const depth = Math.random();
    let size, opacity, speedY;

    // Small, small 3D petals: 4.5px to 10px
    if (depth < 0.35) {
      // Background layer (tiny, soft float)
      size = 4.5 + Math.random() * 1.8;      // ~4.5px - 6.3px
      opacity = 0.55 + Math.random() * 0.18;
      speedY = 0.22 + Math.random() * 0.14;   // very slow
    } else if (depth < 0.8) {
      // Midground layer (delicate)
      size = 6.2 + Math.random() * 2.0;      // ~6.2px - 8.2px
      opacity = 0.72 + Math.random() * 0.18;
      speedY = 0.30 + Math.random() * 0.16;   // very slow
    } else {
      // Foreground layer (small accent)
      size = 8.2 + Math.random() * 2.2;      // ~8.2px - 10.4px
      opacity = 0.86 + Math.random() * 0.12;
      speedY = 0.38 + Math.random() * 0.18;   // slow gentle drift
    }

    return {
      x: Math.random() * (this.width + 40) - 20,
      y: initial ? Math.random() * (this.height + 40) - 20 : -18 - Math.random() * 25,
      size,
      aspect: 0.70 + Math.random() * 0.16,
      speedY,
      speedX: -0.08 + Math.random() * 0.18,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.006,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: 0.007 + Math.random() * 0.012, // 3D roll
      pitch: Math.random() * Math.PI * 2,
      pitchSpeed: 0.009 + Math.random() * 0.014, // 3D pitch/wobble
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.006 + Math.random() * 0.009,
      swayAmp: 7 + Math.random() * 10,
      curl: (Math.random() - 0.5) * 0.6,
      palette,
      opacity,
      depth
    };
  }

  drawPetal(p) {
    const ctx = this.ctx;
    const w = p.size * p.aspect;
    const h = p.size;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    // Realistic 3D projection (roll & pitch)
    const flipCos = Math.cos(p.flip);
    const pitchSin = Math.sin(p.pitch);
    ctx.scale(flipCos, 0.93 + pitchSin * 0.07);

    ctx.globalAlpha = p.opacity;

    // Darker underside velvet palette when flipped backwards
    const isBack = flipCos < 0;
    const colors = isBack ? p.palette.back : p.palette.front;

    // 3D curved gradient
    const grad = ctx.createLinearGradient(-w * 0.5, -h * 0.5, w * 0.5, h * 0.5);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.5, colors[1]);
    grad.addColorStop(1, colors[colors.length - 1]);

    ctx.fillStyle = grad;

    // Organic 3D Rose Petal Path
    ctx.beginPath();
    ctx.moveTo(0, h * 0.48);
    ctx.bezierCurveTo(-w * 0.58, h * 0.22, -w * 0.65, -h * 0.22, -w * 0.22, -h * 0.48);
    ctx.bezierCurveTo(-w * 0.08, -h * 0.51, w * 0.08, -h * 0.51, w * 0.22, -h * 0.48);
    ctx.bezierCurveTo(w * 0.65, -h * 0.22, w * 0.58, h * 0.22, 0, h * 0.48);
    ctx.closePath();
    ctx.fill();

    // Subtle translucent curved spine/crease for 3D realism
    ctx.strokeStyle = isBack ? 'rgba(255, 190, 190, 0.14)' : 'rgba(255, 240, 240, 0.22)';
    ctx.lineWidth = Math.max(0.4, w * 0.04);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.42);
    ctx.quadraticCurveTo(p.curl * w * 0.22, 0, 0, -h * 0.38);
    ctx.stroke();

    ctx.restore();
  }

  update(dt, now) {
    this.wind.changeTimer += dt;
    if (this.wind.changeTimer > 240) {
      this.wind.targetX = 0.04 + Math.random() * 0.10;
      this.wind.changeTimer = 0;
    }
    this.wind.x += (this.wind.targetX - this.wind.x) * 0.005 * dt;

    this.mouse.vx *= 0.94;
    this.mouse.vy *= 0.94;

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      const sway = Math.cos(now * 0.001 * p.swaySpeed + p.swayPhase) * (p.swayAmp * 0.022);

      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < 6400 && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / 80) * 0.6;
        p.x += (dx / dist) * force * dt;
        p.y += (dy / dist) * force * dt;
      }

      p.y += p.speedY * dt;
      p.x += (p.speedX + this.wind.x + sway) * dt;
      p.angle += p.angleSpeed * dt;
      p.flip += p.flipSpeed * dt;
      p.pitch += p.pitchSpeed * dt;

      // Wrap around within container bounds
      if (p.y > this.height + 25) {
        p.y = -15 - Math.random() * 25;
        p.x = Math.random() * (this.width + 40) - 20;
      }
      if (p.x < -30) {
        p.x = this.width + 20;
      } else if (p.x > this.width + 30) {
        p.x = -20;
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.petals.length; i++) {
      this.drawPetal(this.petals[i]);
    }
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    const delta = Math.min((currentTime - this.lastTime) / 16.667, 2.0);
    this.lastTime = currentTime;

    this.update(delta, currentTime);
    this.render();

    this.animationId = requestAnimationFrame(this.loop);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animationId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    if (this.container) {
      this.container.removeEventListener('pointermove', this.onPointerMove);
      this.container.removeEventListener('touchmove', this.onPointerMove);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

let activeEngine = null;

/**
 * Initializes the falling rose petals animation strictly inside the first cover image (.cover).
 */
export function initRosePetals() {
  if (typeof document === 'undefined') return null;
  if (activeEngine) return activeEngine;

  const cover = document.querySelector('.cover');
  if (!cover) return null;

  let canvas = document.getElementById('rose-petals-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'rose-petals-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    cover.appendChild(canvas);
  } else if (canvas.parentElement !== cover) {
    cover.appendChild(canvas);
  }

  requestAnimationFrame(() => {
    document.body.classList.add('petals-active');
  });

  activeEngine = new PetalEngine(canvas, cover);
  activeEngine.init();
  return activeEngine;
}
