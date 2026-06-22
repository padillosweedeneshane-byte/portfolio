(function () {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');

  const moonPath = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  const sunPath =
    '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';

  function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let theme = saved;
    if (!theme) {
      theme = prefersDark ? 'dark' : 'light';
    }

    applyTheme(theme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (icon) {
      icon.innerHTML = theme === 'dark' ? moonPath : sunPath;
    }
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  }

  function syncThemeFromSystem(e) {
    const saved = localStorage.getItem('theme');
    if (!saved) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeFromSystem);
})();
