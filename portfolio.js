(() => {
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  const setMenu = open => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Close' : 'Menu';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
  });
  const links = [...menu.querySelectorAll('a')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => {
        if (a.hash === '#' + en.target.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-in');
    en.target.querySelector('.bars')?.classList.add('is-visible');
    io.unobserve(en.target);
  }), { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  const el = document.getElementById('type');
  const roles = ['Student', 'Developer', 'Lifelong learner'];
  if (!reduce) {
    el.setAttribute('aria-hidden', 'true');
    el.insertAdjacentHTML('afterend', '<span class="sr">' + roles.join(', ') + '</span>');
    let r = 0, i = roles[0].length, del = true;
    const tick = () => {
      const word = roles[r];
      i += del ? -1 : 1;
      el.textContent = word.slice(0, i);
      let wait = del ? 40 : 90;
      if (!del && i === word.length) { del = true; wait = 1800; }
      else if (del && i === 0) { del = false; r = (r + 1) % roles.length; wait = 300; }
      setTimeout(tick, wait);
    };
    setTimeout(tick, 1800);
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
