(function () {
  const header = document.querySelector('.header');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');
  const ring = backToTop && backToTop.querySelector('circle');

  let lastScroll = 0;

  function initNavigation() {
    if (hamburger) {
      hamburger.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        closeMobileMenu();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        closeMobileMenu();
      }
    });

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function toggleMobileMenu() {
    const isOpen = document.body.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  function handleScroll() {
    const scrollY = window.scrollY;

    if (header) {
      header.classList.toggle('header-scrolled', scrollY > 20);
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 300);
    }

    if (ring) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(scrollY / scrollable, 1) : 0;
      const circumference = 2 * Math.PI * 20;
      ring.style.strokeDashoffset = circumference * (1 - progress);
    }

    const currentSection = getCurrentSection();
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + currentSection);
    });

    lastScroll = scrollY;
  }

  function getCurrentSection() {
    const sections = ['home', 'skills', 'projects', 'testimonials', 'stats', 'contact'];
    const offset = 150;

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && el.getBoundingClientRect().top <= offset) {
        return sections[i];
      }
    }
    return 'home';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
