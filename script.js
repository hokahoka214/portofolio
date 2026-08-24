/* ==========================================
   LOADING SCREEN
   ========================================== */
function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.querySelector('.loader-bar-fill');

  gsap.to(bar, {
    width: '100%',
    duration: 2,
    ease: 'power2.inOut',
    onComplete: () => {
      loader.classList.add('hidden');
      document.body.style.cursor = 'none';
      initHeroAnimation();
    }
  });
}

/* ==========================================
   CURSOR
   ========================================== */
function initCursor() {
  document.body.style.cursor = 'none';
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';

    gsap.to(ring, {
      left: e.clientX,
      top: e.clientY,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  });

  document.querySelectorAll('a, button, .project-card, .skill-card, .filter-btn, .social-link, .theme-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('grow'));
    el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
  });

  document.addEventListener('mouseleave', () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
  });

  document.addEventListener('mouseenter', () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
  });
}

/* ==========================================
   PARTICLES
   ========================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = null;
  let mouseY = null;
  let animId;

  function resize() {
    const hero = canvas.parentElement;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function create(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const particleColor = isLight ? 'rgba(99, 102, 241,' : 'rgba(255, 255, 255,';
    const lineColor = isLight ? 'rgba(99, 102, 241,' : 'rgba(255, 255, 255,';

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (mouseX !== null && mouseY !== null) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x -= dx * force * 0.015;
          p.y -= dy * force * 0.015;
        }
      }

      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particleColor} ${p.opacity})`;
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `${lineColor} ${0.04 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  create(80);
  draw();

  window.addEventListener('resize', () => { resize(); create(80); });

  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  document.addEventListener('mouseleave', () => { mouseX = null; mouseY = null; });

  // Re-draw when theme changes
  const observer = new MutationObserver(() => {
    draw();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

/* ==========================================
   FLOATING SHAPES PARALLAX
   ========================================== */
function initShapeParallax() {
  const shapes = document.querySelectorAll('.hero-bg-shapes .shape');

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    shapes.forEach((shape, i) => {
      const factor = (i + 1) * 12;
      gsap.to(shape, {
        x: x * factor,
        y: y * factor,
        duration: 1.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  });
}

/* ==========================================
   NAVBAR
   ========================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ==========================================
   MOBILE MENU
   ========================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-link');
  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    hamburger.classList.toggle('active');
    menu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  const closeAndScroll = (el) => {
    if (isOpen) toggleMenu();
    const href = el.getAttribute('href');
    if (href) scrollToSection(href);
  };

  links.forEach(link => {
    link.addEventListener('click', () => closeAndScroll(link));
  });

  const mobileCta = document.querySelector('.mobile-cta');
  if (mobileCta) {
    mobileCta.addEventListener('click', (e) => {
      e.preventDefault();
      closeAndScroll(mobileCta);
    });
  }
}

/* ==========================================
   HERO ANIMATION
   ========================================== */
function initHeroAnimation() {
  const tl = gsap.timeline();
  tl
    .from('.hero-badge', { opacity: 0, x: -100, duration: 0.6, ease: 'power2.out' })
    .from('.hero-title-line:nth-child(1)', { opacity: 0, x: -150, duration: 0.8, ease: 'power3.out' }, '-=0.2')
    .from('.hero-title-line:nth-child(2)', { opacity: 0, x: 150, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero-subtitle', { opacity: 0, x: -100, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .from('.hero-actions .btn:nth-child(1)', { opacity: 0, x: -80, duration: 0.5, ease: 'power2.out' }, '-=0.2')
    .from('.hero-actions .btn:nth-child(2)', { opacity: 0, x: 80, duration: 0.5, ease: 'power2.out' }, '-=0.4')
    .from('.hero-socials .social-link', { opacity: 0, x: 60, stagger: 0.06, duration: 0.4, ease: 'power2.out' }, '-=0.2')
    .from('.hero-stats', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.1')
    .from('.scroll-indicator', { opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.1');
}

/* ==========================================
   SCROLL REVEALS
   ========================================== */
function initReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ==========================================
   3D TILT
   ========================================== */
function initTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = y * -10;
      const rotateY = x * 10;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      const img = card.querySelector('.project-image');
      if (img) {
        gsap.to(img, {
          x: x * 8,
          y: y * 8,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
      const img = card.querySelector('.project-image');
      if (img) {
        gsap.to(img, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
      }
    });
  });
}

/* ==========================================
   MAGNETIC BUTTONS
   ========================================== */
function initMagnetic() {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0, y: 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  });
}

/* ==========================================
   RIPPLE EFFECT
   ========================================== */
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ==========================================
   PROJECT FILTER
   ========================================== */
function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', clearProps: 'scale' });
        } else {
          gsap.to(card, {
            opacity: 0, scale: 0.95, duration: 0.25, ease: 'power2.in',
            onComplete: () => { card.style.display = 'none'; }
          });
        }
      });
    });
  });
}

/* ==========================================
   COUNTER ANIMATION
   ========================================== */
function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');

  statNums.forEach(el => {
    const target = parseInt(el.dataset.target);
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el.closest('.hero-stats'),
        start: 'top 85%'
      },
      onUpdate: () => {
        el.textContent = Math.floor(obj.val);
      }
    });
  });
}

/* ==========================================
   SKILL BARS
   ========================================== */
function initSkillBars() {
  document.querySelectorAll('.skill-card').forEach(card => {
    const fill = card.querySelector('.skill-bar-fill');
    const target = parseInt(card.dataset.progress);

    gsap.to(fill, {
      width: target + '%',
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%'
      }
    });
  });
}

/* ==========================================
   FORM VALIDATION
   ========================================== */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      const error = input.parentElement.querySelector('.form-error');
      input.classList.remove('error');
      if (error) error.classList.remove('visible');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('.form-input').forEach(input => {
      const error = input.parentElement.querySelector('.form-error');
      const val = input.value.trim();

      if (!val) {
        input.classList.add('error');
        if (error) error.classList.add('visible');
        valid = false;
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        input.classList.add('error');
        if (error) error.classList.add('visible');
        valid = false;
      } else {
        input.classList.remove('error');
        if (error) error.classList.remove('visible');
      }
    });

    if (valid) {
      const btn = form.querySelector('.form-submit');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>Message Sent!</span><i class="fa-solid fa-check"></i>';
      btn.style.pointerEvents = 'none';
      setTimeout(() => {
        form.reset();
        btn.innerHTML = orig;
        btn.style.pointerEvents = '';
      }, 3000);
    }
  });
}

/* ==========================================
   SMOOTH SCROLL
   ========================================== */
function scrollToSection(id) {
  const target = document.querySelector(id);
  if (!target) return;
  const offset = 72;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      if (anchor.closest('.mobile-links')) return;
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      scrollToSection(href);
    });
  });

  document.querySelectorAll('.magnetic-btn[data-href]').forEach(btn => {
    btn.addEventListener('click', () => {
      const href = btn.dataset.href;
      if (href) scrollToSection(href);
    });
  });
}

/* ==========================================
   BACK TO TOP
   ========================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================
   ACTIVE SECTION
   ========================================== */
function initActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================
   THEME TOGGLE
   ========================================== */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Check for saved theme preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  toggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Animate the transition
    gsap.fromTo(toggle, 
      { rotation: 0, scale: 1 },
      { rotation: 180, scale: 0.8, duration: 0.2, ease: 'power2.in', onComplete: () => {
        gsap.to(toggle, { rotation: 360, scale: 1, duration: 0.2, ease: 'power2.out' });
      }}
    );
  });
}

/* ==========================================
   REGISTER GSAP PLUGINS
   ========================================== */
gsap.registerPlugin(ScrollTrigger);

/* ==========================================
   INIT
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initParticles();
  initShapeParallax();
  initNavbar();
  initMobileMenu();
  initReveals();
  initTilt();
  initMagnetic();
  initRipple();
  initFilter();
  initCounters();
  initSkillBars();
  initForm();
  initSmoothScroll();
  initBackToTop();
  initActiveSection();
  initThemeToggle();
});
