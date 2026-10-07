/* ==========================================================================
   BANTEK INTERIOR - ULTRA-LUXURY JAVASCRIPT SYSTEM
   Cinematic Animations, Luxury Cursor Glow, Parallax, Staggered Reveals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initStickyHeader();
  initMobileDrawer();
  initLuxuryCursor();
  initScrollAnimations();
  initHeroParallax();
  initCounters();
  initPortfolioFilter();
  initLightbox();
});

/* --- Theme Switcher (Dark Onyx / Light Ivory) --- */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('bantek_theme') || 'dark';

  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('bantek_theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('bantek_theme', 'light');
      }
    });
  });
}

/* --- Sticky Header on Scroll --- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --- Dedicated Robust Mobile Drawer Navigation --- */
function initMobileDrawer() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const drawerPanel = document.getElementById('mobileDrawerPanel');
  const drawerOverlay = document.getElementById('mobileDrawerOverlay');
  const closeBtn = document.getElementById('drawerCloseBtn');

  if (!mobileToggle || !drawerPanel || !drawerOverlay) return;

  function openDrawer(e) {
    if (e) e.preventDefault();
    mobileToggle.classList.add('is-active');
    drawerPanel.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer(e) {
    if (e) e.preventDefault();
    mobileToggle.classList.remove('is-active');
    drawerPanel.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle.addEventListener('click', (e) => {
    if (drawerPanel.classList.contains('active')) {
      closeDrawer(e);
    } else {
      openDrawer(e);
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerPanel.classList.contains('active')) {
      closeDrawer();
    }
  });

  const drawerLinks = drawerPanel.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeDrawer, 120);
    });
  });
}

/* ==========================================================================
   CUSTOM LUXURY CURSOR GLOW (DESKTOP)
   ========================================================================== */
function initLuxuryCursor() {
  // Only initialize on devices with a fine pointer (desktop / mouse)
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'luxury-cursor-dot';
  const glow = document.createElement('div');
  glow.className = 'luxury-cursor-glow';
  document.body.appendChild(dot);
  document.body.appendChild(glow);

  let mouseX = -100;
  let mouseY = -100;
  let glowX = -100;
  let glowY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  // Smooth lerp follow loop
  function renderCursor() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    glow.style.transform = `translate(${glowX - 20}px, ${glowY - 20}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover triggers for interactive elements
  const hoverSelectors = 'a, button, input, select, textarea, .portfolio-item, .service-card, .team-card, .testimonial-card, .feature-pill';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      glow.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      glow.classList.remove('is-hovering');
    }
  });
}

/* ==========================================================================
   CINEMATIC SCROLL REVEAL & STAGGER ENGINE
   ========================================================================== */
function initScrollAnimations() {
  const targets = document.querySelectorAll(`
    .section-header-center,
    .service-card,
    .portfolio-item,
    .testimonial-card,
    .team-card,
    .process-card,
    .feature-pill,
    .estimator-wrapper,
    .map-wrapper,
    .luxury-form,
    .hero-content,
    .hero-visual,
    .cta-banner-section .container
  `);

  if (!targets.length) return;

  targets.forEach((el) => {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-scale') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
      el.classList.add('reveal');
    }

    // Stagger items inside grids
    const parentGrid = el.closest('.services-grid, .portfolio-grid, .testimonials-grid, .team-grid, .process-grid, .features-grid');
    if (parentGrid) {
      const itemIndex = Array.from(parentGrid.children).indexOf(el);
      const delayClass = `delay-${(itemIndex % 6) + 1}`;
      el.classList.add(delayClass);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

/* --- Hero Parallax Tilt on Scroll --- */
function initHeroParallax() {
  const heroVisual = document.querySelector('.hero-visual-card');
  if (!heroVisual) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < 900) {
      const yOffset = scrollY * 0.08;
      heroVisual.style.transform = `translateY(${yOffset}px)`;
    }
  }, { passive: true });
}

/* --- Smooth Eased Number Counters --- */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-num[data-target]');
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 1600; // ms
          const startTime = performance.now();

          function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(eased * target);

            counter.innerText = currentVal + suffix;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              counter.innerText = target + suffix;
            }
          }

          requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.querySelector('.hero-stats-row');
  if (statsSection) observer.observe(statsSection);
}

/* --- Portfolio Gallery Filter --- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (!filterBtns.length || !portfolioItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 280);
        }
      });
    });
  });
}

/* --- Lightbox Modal for Portfolio --- */
function initLightbox() {
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('#lightboxImg');
  const lightboxTitle = lightbox.querySelector('#lightboxTitle');
  const lightboxCategory = lightbox.querySelector('#lightboxCategory');
  const lightboxLocation = lightbox.querySelector('#lightboxLocation');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.portfolio-title')?.innerText || '';
      const category = item.querySelector('.portfolio-category')?.innerText || '';
      const loc = item.querySelector('.portfolio-location')?.innerText || '';

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      }
      if (lightboxTitle) lightboxTitle.innerText = title;
      if (lightboxCategory) lightboxCategory.innerText = category;
      if (lightboxLocation) lightboxLocation.innerText = loc;

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
