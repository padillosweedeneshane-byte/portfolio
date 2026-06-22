(function () {
  function init() {
    setupTypewriter();
    setupProjectFilters();
  }

  function setupProjectFilters() {
    const filters = document.querySelectorAll('.project-filter');
    const cards = document.querySelectorAll('.project-card');

    if (!filters.length || !cards.length) return;

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        let visibleIndex = 0;
        let hiddenCount = 0;

        cards.forEach((card, i) => {
          const matches = filter === 'all' || card.getAttribute('data-category') === filter;

          if (matches) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            card.style.transition = 'none';
            card.style.pointerEvents = 'none';

            const delay = 50 + visibleIndex * 80;
            visibleIndex++;

            setTimeout(() => {
              card.style.transition = 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
              card.style.pointerEvents = '';
            }, delay);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

            const delay = hiddenCount * 40;
            hiddenCount++;

            setTimeout(() => {
              card.style.display = 'none';
            }, 300 + delay);
          }
        });
      });
    });
  }

  function setupTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const words = [
      'Designing Relational Databases',
      'Configuring Cisco Networks',
      'Optimizing SQL Queries',
      'Securing Network Topologies'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
      const current = words[wordIndex];

      if (isPaused) {
        isPaused = false;
        setTimeout(type, 500);
        return;
      }

      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(type, 300);
          return;
        }
        setTimeout(type, 30);
      } else {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          isPaused = true;
          isDeleting = true;
          setTimeout(type, 2000);
          return;
        }
        setTimeout(type, 50);
      }
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      setTimeout(type, 1000);
    } else {
      el.textContent = 'Building Mobile Experiences';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
