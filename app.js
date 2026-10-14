(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-main');
  const progress = document.querySelector('#scroll-progress-bar');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 809px)');
  const dropdowns = [...document.querySelectorAll('.nav-item.dropdown')];

  function closeDropdowns(except = null) {
    dropdowns.forEach(item => {
      if (item === except) return;
      item.classList.remove('open');
      item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
    });
  }
  dropdowns.forEach(item => {
    const trigger = item.querySelector('.nav-trigger');
    trigger?.addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      closeDropdowns(item);
      item.classList.toggle('open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    });
    trigger?.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        item.querySelector('.dropdown-panel a')?.focus();
      }
    });
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-item.dropdown')) closeDropdowns();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeDropdowns();
      nav?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.setAttribute('aria-label', 'Open menu');
    }
  });
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav?.classList.toggle('open', open);
    if (!open) closeDropdowns();
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (mobile.matches) {
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.setAttribute('aria-label', 'Open menu');
    }
    closeDropdowns();
  }));
  mobile.addEventListener?.('change', () => {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    closeDropdowns();
  });

  let ticking = false;
  function onScroll() {
    const y = window.scrollY || 0;
    header?.classList.toggle('scrolled', y > 12);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? Math.min(100, y / max * 100) : 0}%`;
    const dashboard = document.querySelector('.hero-dashboard');
    if (dashboard && !reduceMotion && !mobile.matches) {
      const rect = dashboard.getBoundingClientRect();
      const relative = Math.max(-8, Math.min(28, (window.innerHeight * .4 - rect.top) * .045));
      dashboard.style.setProperty('--scroll-y', `${relative}px`);
    } else dashboard?.style.setProperty('--scroll-y', '0px');
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -35px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('visible'));

  // Scroll-linked feature story: the visual stays in place while each feature card
  // becomes active naturally as it reaches the reading area.
  const featureSection = document.querySelector('.feature-story');
  const featureSteps = [...document.querySelectorAll('[data-feature-step]')];
  const featureImages = [...document.querySelectorAll('[data-feature-image]')];
  const featureCurrent = document.querySelector('#feature-current');
  let activeFeatureIndex = 0;

  function setActiveFeature(index, options = {}) {
    if (!featureSteps.length) return;
    const nextIndex = (index + featureSteps.length) % featureSteps.length;
    activeFeatureIndex = nextIndex;
    featureSteps.forEach((step, i) => {
      const active = i === nextIndex;
      step.classList.toggle('is-active', active);
      if (active) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
    featureImages.forEach((image, i) => {
      const active = i === nextIndex;
      image.classList.toggle('is-active', active);
      image.setAttribute('aria-hidden', String(!active));
    });
    if (featureCurrent) featureCurrent.textContent = String(nextIndex + 1).padStart(2, '0');
    if (options.scroll) {
      featureSteps[nextIndex].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }
  }

  if (featureSection && featureSteps.length) {
    setActiveFeature(0);
    if ('IntersectionObserver' in window) {
      const featureObserver = new IntersectionObserver(entries => {
        const candidates = entries.filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (candidates[0]) {
          const index = featureSteps.indexOf(candidates[0].target);
          if (index >= 0) setActiveFeature(index);
        }
      }, { threshold: [0.25, 0.45, 0.6, 0.75], rootMargin: '-18% 0px -18% 0px' });
      featureSteps.forEach(step => featureObserver.observe(step));
    }
    document.querySelector('[data-feature-prev]')?.addEventListener('click', () => setActiveFeature(activeFeatureIndex - 1, { scroll: true }));
    document.querySelector('[data-feature-next]')?.addEventListener('click', () => setActiveFeature(activeFeatureIndex + 1, { scroll: true }));
    featureSteps.forEach((step, index) => {
      step.addEventListener('click', () => setActiveFeature(index));
      step.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          event.preventDefault();
          setActiveFeature(index + 1, { scroll: true });
          featureSteps[(index + 1) % featureSteps.length].focus({ preventScroll: true });
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          event.preventDefault();
          setActiveFeature(index - 1, { scroll: true });
          featureSteps[(index - 1 + featureSteps.length) % featureSteps.length].focus({ preventScroll: true });
        }
      });
    });
  }

  const faqItems = [...document.querySelectorAll('.faq-list details')];
  faqItems.forEach(item => item.addEventListener('toggle', () => {
    if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; });
  }));

  const demoForm = document.querySelector('#demo-form');
  demoForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!demoForm.reportValidity()) return;
    const name = document.querySelector('#demo-name')?.value.trim();
    const message = document.querySelector('#demo-message');
    if (message) message.textContent = `Thanks${name ? `, ${name}` : ''}. Your details are valid. This assessment preview is not connected to a booking service.`;
    demoForm.reset();
  });
  const newsletter = document.querySelector('#newsletter-form');
  newsletter?.addEventListener('submit', event => {
    event.preventDefault();
    if (!newsletter.reportValidity()) return;
    const message = document.querySelector('#newsletter-message');
    if (message) message.textContent = 'Thanks for subscribing. This preview is not connected to an email service.';
    newsletter.reset();
  });
  document.querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
    img.classList.add('asset-error');
    console.warn('Hirely asset failed to load:', img.currentSrc || img.src);
  }, { once: true }));
})();
