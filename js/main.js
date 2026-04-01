/* =============================================================
   Sun to Sale Media — Main JS
   GSAP + ScrollTrigger · Nav · FAQ · County Checker
============================================================= */

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* NAV — scroll behavior + mobile toggle
============================================================= */
const nav = document.getElementById('nav');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

const hamburger = document.querySelector('.nav__hamburger');
const mobileNav = document.querySelector('.nav__mobile');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    const [s0, s1, s2] = hamburger.querySelectorAll('span');
    if (open) {
      s0.style.transform = 'rotate(45deg) translate(5px, 5px)';
      s1.style.opacity = '0';
      s2.style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      s0.style.transform = s2.style.transform = '';
      s1.style.opacity = '';
    }
  });
}

/* SMOOTH SCROLL
============================================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 20 : 20;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      if (mobileNav) mobileNav.classList.remove('open');
    }
  });
});

/* GSAP ANIMATIONS
============================================================= */
if (!prefersReducedMotion) {

  /* ── HERO — scroll-driven video + page flip reveal ────────── */
  /* 3D ANIMATION CREATOR */

  const video      = document.getElementById('hero-video');
  const heroPage   = document.getElementById('hero-page');
  const videoStage = document.getElementById('hero-video-stage');

  if (video && heroPage) {

    // ── CONFIG ──
    const SCROLL_LENGTH   = '+=350%';
    const VIDEO_END_AT    = 0.65;
    const PAGE_FLIP_START = 0.58;
    const PAGE_FLIP_END   = 0.92;
    const VIDEO_FADE_AT   = 0.55;

    // ── CONFIG — text entrance ──
    const TEXT_SLIDE_START = 0.60;
    const TEXT_SLIDE_END   = 0.92;
    const TEXT_OFFSET      = 120;  // vw percentage each side slides from

    // ── Initial states ──
    gsap.set(heroPage, { opacity: 0 });
    gsap.set('.hero__page .sl', { x: -window.innerWidth * (TEXT_OFFSET / 100), opacity: 0 });
    gsap.set('.hero__page .sr', { x:  window.innerWidth * (TEXT_OFFSET / 100), opacity: 0 });

    // ── Boot: wait for video to be ready ──
    function boot() {
      const dur = video.duration;
      if (!dur || isNaN(dur)) return;

      // Park on first frame
      video.currentTime = 0.001;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: SCROLL_LENGTH,
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate(self) {
            const p = Math.min(self.progress / VIDEO_END_AT, 1);
            video.currentTime = p * dur;
          }
        }
      });

      // Video stage fades out
      tl.to(videoStage, {
        opacity: 0,
        ease: 'power1.in',
        duration: TEXT_SLIDE_START - VIDEO_FADE_AT
      }, VIDEO_FADE_AT);

      // Background crossfade — hero page appears with #0A0A0A bg
      tl.to(heroPage, {
        opacity: 1,
        ease: 'none',
        duration: TEXT_SLIDE_START - VIDEO_FADE_AT
      }, VIDEO_FADE_AT);

      // Text slides in from left
      tl.to('.hero__page .sl', {
        x: 0,
        opacity: 1,
        ease: 'power3.out',
        stagger: 0.015,
        duration: TEXT_SLIDE_END - TEXT_SLIDE_START
      }, TEXT_SLIDE_START);

      // Text slides in from right
      tl.to('.hero__page .sr', {
        x: 0,
        opacity: 1,
        ease: 'power3.out',
        stagger: 0.015,
        duration: TEXT_SLIDE_END - TEXT_SLIDE_START
      }, TEXT_SLIDE_START);
    }

    if (video.readyState >= 1) {
      boot();
    } else {
      video.addEventListener('loadedmetadata', boot, { once: true });
    }
    video.load();
  }

  /* 3D ANIMATION CREATOR — END */

  /* Generic .reveal elements */
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

  /* Staggered card grids */
  gsap.utils.toArray('.stagger-grid').forEach(grid => {
    gsap.fromTo(Array.from(grid.children),
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.09, ease: 'power2.out',
        scrollTrigger: { trigger: grid, start: 'top 84%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Steps stagger */
  const stepsEl = document.querySelector('.steps');
  if (stepsEl) {
    gsap.fromTo(Array.from(stepsEl.querySelectorAll('.step')),
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.14, ease: 'power2.out',
        scrollTrigger: { trigger: stepsEl, start: 'top 82%' }
      }
    );
  }

  /* Proof bar counters */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.6, ease: 'power2.out',
          onUpdate() { el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix; }
        });
      }
    });
  });

  /* Guarantee box glow pulse */
  const guaranteeBox = document.querySelector('.guarantee__box');
  if (guaranteeBox) {
    ScrollTrigger.create({
      trigger: guaranteeBox,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo(guaranteeBox,
          { boxShadow: '0 0 0px rgba(245,166,35,0)', borderColor: 'rgba(245,166,35,0.2)' },
          { boxShadow: '0 0 60px rgba(245,166,35,0.12)', borderColor: 'rgba(245,166,35,0.5)', duration: 1.2, ease: 'power2.out' }
        );
      }
    });
  }
}

/* FAQ ACCORDION
============================================================= */
document.querySelectorAll('.faq__item').forEach(item => {
  item.querySelector('.faq__q')?.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* COUNTY CHECKER
============================================================= */
// Counties marked as taken (replace with real data / API in production)
const TAKEN_COUNTIES = ['Ilfov', 'Cluj', 'Timis', 'Brasov', 'Prahova'];

const countySelect = document.getElementById('county-select');
const countyBtn    = document.getElementById('county-check-btn');
const countyResult = document.getElementById('county-result');

if (countySelect && countyBtn && countyResult) {
  countyBtn.addEventListener('click', () => {
    const val = countySelect.value;
    if (!val) return;
    const taken = TAKEN_COUNTIES.includes(val);
    countyResult.className = 'county-result ' + (taken ? 'taken' : 'available');
    if (taken) {
      countyResult.innerHTML = `<strong>Județul ${val} este deja ocupat.</strong> Suntem deja parteneri exclusivi cu o firmă de instalare panouri fotovoltaice din acest județ. Poți lăsa datele de contact și te anunțăm dacă se eliberează un loc.`;
    } else {
      countyResult.innerHTML = `<strong>✓ Județul ${val} este disponibil!</strong> Ești la un pas de a deveni partenerul exclusiv Sun to Sale Media din județul tău. <a href="contact.html" style="color:#F5A623;text-decoration:underline;">Aplică acum →</a>`;
    }
  });
}
