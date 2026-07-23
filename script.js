/* ═══ Ustadh Abu Ilyaas Academy ═══ */

// ── Sticky nav shading ──
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Mobile menu ──
const burger = document.getElementById('burger');
const links = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    links.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  })
);

// ── Scroll reveal ──
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
}

// ── Animated counters (15+ years, 4 disciplines) ──
const counters = document.querySelectorAll('[data-count]');
const animateCount = el => {
  const target = +el.dataset.count;
  const dur = 1400;
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if (reduceMotion) {
  counters.forEach(el => (el.textContent = el.dataset.count));
} else {
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        cio.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => cio.observe(el));
}

// ── Review marquees: duplicate track for a seamless loop ──
document.querySelectorAll('.marquee').forEach(m => {
  const track = m.querySelector('.marquee__track');
  track.innerHTML += track.innerHTML; // clone once → 200% width, scroll -50%
  m.style.setProperty('--dur', (m.dataset.speed || 46) + 's');
});

// ── Contact form (static site — friendly confirmation) ──
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) {
    note.textContent = 'Please add your name and a valid email so the Ustadh can reply.';
    note.style.color = '#8E2F35';
    return;
  }
  // On GitHub Pages there is no backend — open the visitor's email app pre-filled.
  const course = form.course.value;
  const msg = form.message.value.trim();
  const body = encodeURIComponent(
    `Assalamu alaikum,\n\nMy name is ${name} and I would like a free trial lesson.\nCourse: ${course}\n\n${msg}\n\nMy email: ${email}`
  );
  window.location.href =
    `mailto:contact@abuilyaasacademy.com?subject=${encodeURIComponent('Free trial request — ' + name)}&body=${body}`;
  note.textContent = `JazakAllahu khayran, ${name}! Your email app is opening — just press send.`;
  note.style.color = '#6F7D4F';
  form.reset();
});

// ── Footer year ──
document.getElementById('year').textContent = new Date().getFullYear();
