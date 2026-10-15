/* Small, progressive enhancements for the portfolio. */
(() => {
  const intro = document.querySelector('#intro');
  const typedName = document.querySelector('#typed-name');
  const skipIntro = document.querySelector('#skip-intro');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sessionKey = 'uttamPortfolioIntroSeen';
  let introTimer;

  function dismissIntro() {
    if (!intro || !intro.classList.contains('is-active')) return;
    window.clearInterval(introTimer);
    try { sessionStorage.setItem(sessionKey, '1'); } catch (_) { /* Storage may be unavailable. */ }
    intro.classList.add('is-leaving');
    window.setTimeout(() => {
      intro.classList.remove('is-active', 'is-leaving');
      intro.setAttribute('aria-hidden', 'true');
    }, reducedMotion.matches ? 0 : 560);
  }

  if (intro && typedName && !reducedMotion.matches) {
    let seen = false;
    try { seen = sessionStorage.getItem(sessionKey) === '1'; } catch (_) { /* Continue without session storage. */ }
    if (!seen) {
      const name = 'Uttam Kumar';
      typedName.textContent = '';
      intro.setAttribute('aria-hidden', 'false');
      intro.classList.add('is-active');
      let position = 0;
      introTimer = window.setInterval(() => {
        position += 1;
        typedName.textContent = name.slice(0, position);
        if (position >= name.length) {
          window.clearInterval(introTimer);
          window.setTimeout(dismissIntro, 450);
        }
      }, 105);
    }
  }
  if (skipIntro) skipIntro.addEventListener('click', dismissIntro);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && intro?.classList.contains('is-active')) dismissIntro();
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.dock a[data-section]')];
  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => {
        if (link.dataset.section === visible.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .15, .35, .6] });
    sections.forEach(section => observer.observe(section));
  }

  const audio = document.querySelector('#background-music');
  const musicToggle = document.querySelector('#music-toggle');
  if (audio && musicToggle) {
    const label = musicToggle.querySelector('.music-label');
    const setPlaybackState = playing => {
      musicToggle.setAttribute('aria-pressed', String(playing));
      musicToggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
      if (label) label.textContent = playing ? 'Pause music' : 'Play music';
    };
    musicToggle.addEventListener('click', async () => {
      if (audio.paused) {
        try { await audio.play(); setPlaybackState(true); }
        catch (_) { if (label) label.textContent = 'Audio unavailable'; musicToggle.setAttribute('aria-label', 'Background music unavailable'); }
      } else { audio.pause(); setPlaybackState(false); }
    });
    audio.addEventListener('ended', () => setPlaybackState(false));
    audio.addEventListener('error', () => { if (label) label.textContent = 'Audio unavailable'; musicToggle.setAttribute('aria-label', 'Background music unavailable'); });
    audio.addEventListener('pause', () => { if (!audio.error) setPlaybackState(false); });
  }
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

(() => {
  document.querySelectorAll('.hero-portrait img').forEach(image => {
    image.addEventListener('error', () => {
      const fallback = document.createElement('div');
      fallback.className = 'portrait-fallback';
      fallback.setAttribute('role', 'img');
      fallback.setAttribute('aria-label', 'Portrait image currently unavailable');
      fallback.textContent = 'Portrait unavailable';
      image.replaceWith(fallback);
    }, { once: true });
  });
})();

