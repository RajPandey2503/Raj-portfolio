// Theme toggle with persistence + system preference
(() => {
  const STORAGE_KEY = 'theme';
  const btn = document.getElementById('theme-toggle');
  const root = document.body;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem(STORAGE_KEY);

  const apply = (mode) => {
    if (mode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    btn.textContent = root.classList.contains('dark') ? '☀️' : '🌙';
    btn.setAttribute('aria-label', root.classList.contains('dark') ? 'Switch to light mode' : 'Switch to dark mode');
  };

  apply(saved ? saved : (prefersDark ? 'dark' : 'light'));

  btn.addEventListener('click', () => {
    const mode = root.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, mode);
    apply(mode);
  });
})();

// Fade-in on scroll
(() => {
  const els = document.querySelectorAll('.fade-in');
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('appear');
      observer.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
})();

// Scroll to top button
(() => {
  const btn = document.getElementById('scrollTopBtn');
  const toggle = () => btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Dynamic projects loader
(() => {
  const container = document.getElementById('projects-container');
  const loading = document.getElementById('projects-loading');
  if (!container) return;

  fetch('projects.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load projects.json');
      return res.json();
    })
    .then(projects => {
      loading.style.display = 'none'; // hide loading spinner
      projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card fade-in';
        const links = [`<a href="${p.github}" target="_blank" rel="noopener">GitHub</a>`];
        if (p.live) links.push(`<a href="${p.live}" target="_blank" rel="noopener">Live Demo</a>`);
        card.innerHTML = `
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <p><b>Tech:</b> ${p.tech}</p>
          <div class="project-links">${links.join(' | ')}</div>
        `;
        container.appendChild(card);
      });
      // trigger fade-in for newly added cards
      window.dispatchEvent(new Event('scroll'));
    })
    .catch(err => {
      loading.innerHTML = '⚠️ Unable to load projects. Please check back later.';
      console.error(err);
    });
})();