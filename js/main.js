/* Strange Innovations — main.js */

/* ── Revenue Configuration ──────────────────────────────────────────────
   UPDATE THESE VALUES as revenue comes in.
   All amounts in USD. Japan goal is $30,000.
   ─────────────────────────────────────────────────────────────────────── */
const REVENUE = {
  cole:     0,   // Food Noise + other Cole apps
  weston:   0,   // Games + YouTube
  michelle: 0,   // Educational tools + resources
};
const JAPAN_GOAL = 30000;
/* ─────────────────────────────────────────────────────────────────────── */


/* ── Navigation ── */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


/* ── Hero Canvas Particles ── */
(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 55;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.45 + 0.08,
      gold: Math.random() > 0.5,
    };
  }

  for (let i = 0; i < COUNT; i++) {
    particles.push(randomParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(200, 168, 75, ${p.alpha})`
        : `rgba(74, 158, 255, ${p.alpha * 0.5})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ── Scroll Reveal ── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '-40px 0px -40px 0px',
    threshold: 0.08,
  });

  elements.forEach(el => observer.observe(el));
})();


/* ── Japan Revenue Tracker ── */
(function initTracker() {
  const totalRevenue = REVENUE.cole + REVENUE.weston + REVENUE.michelle;
  const remaining = Math.max(0, JAPAN_GOAL - totalRevenue);
  const pct = Math.min(100, (totalRevenue / JAPAN_GOAL) * 100);

  function fmt(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  const currentEl   = document.getElementById('currentRevenue');
  const remainingEl = document.getElementById('remainingRevenue');
  const fillEl      = document.getElementById('progressFill');
  const planeEl     = document.getElementById('progressPlane');
  const coleBarEl   = document.getElementById('coleBar');
  const westonBarEl = document.getElementById('westonBar');
  const michelleBarEl = document.getElementById('michelleBar');
  const coleAmtEl   = document.getElementById('coleAmount');
  const westonAmtEl = document.getElementById('westonAmount');
  const michelleAmtEl = document.getElementById('michelleAmount');

  if (currentEl)   currentEl.textContent   = fmt(totalRevenue);
  if (remainingEl) remainingEl.textContent = fmt(remaining);
  if (coleAmtEl)   coleAmtEl.textContent   = fmt(REVENUE.cole);
  if (westonAmtEl) westonAmtEl.textContent = fmt(REVENUE.weston);
  if (michelleAmtEl) michelleAmtEl.textContent = fmt(REVENUE.michelle);

  // Animate bars when Japan section comes into view
  const japanSection = document.getElementById('japan');
  if (!japanSection) return;

  const trackerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (fillEl)  fillEl.style.width  = pct + '%';
        if (planeEl) planeEl.style.left  = Math.max(0, pct - 2) + '%';

        const colePct     = Math.min(100, (REVENUE.cole / JAPAN_GOAL) * 100);
        const westonPct   = Math.min(100, (REVENUE.weston / JAPAN_GOAL) * 100);
        const michellePct = Math.min(100, (REVENUE.michelle / JAPAN_GOAL) * 100);

        if (coleBarEl)     coleBarEl.style.width     = colePct + '%';
        if (westonBarEl)   westonBarEl.style.width   = westonPct + '%';
        if (michelleBarEl) michelleBarEl.style.width = michellePct + '%';

        trackerObserver.unobserve(japanSection);
      }
    });
  }, { threshold: 0.2 });

  trackerObserver.observe(japanSection);
})();


/* ── Smooth Scroll offset for fixed nav ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('nav')?.offsetHeight || 64;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── Game option hover interaction ── */
document.querySelectorAll('.game-option').forEach(opt => {
  opt.addEventListener('click', function() {
    const siblings = this.parentElement.querySelectorAll('.game-option');
    siblings.forEach(s => s.style.borderColor = '');
    this.style.borderColor = 'var(--blue)';
    this.style.color = 'var(--blue-light)';
  });
});
