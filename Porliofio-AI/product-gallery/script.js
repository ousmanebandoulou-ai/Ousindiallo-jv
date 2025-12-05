// Theme toggle and simple accessibility helpers
(function(){
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Create a hidden live region for accessibility announcements
  let live = document.getElementById('pg-live');
  if(!live){
    live = document.createElement('div');
    live.id = 'pg-live';
    live.style.position = 'absolute';
    live.style.left = '-9999px';
    live.style.width = '1px';
    live.style.height = '1px';
    live.setAttribute('aria-live','polite');
    document.body.appendChild(live);
  }

  // Load saved preference
  const saved = localStorage.getItem('pg_theme');
  if(saved === 'dark') body.classList.add('dark');

  function updateButton(){
    const isDark = body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    live.textContent = isDark ? 'Thème sombre activé' : 'Thème clair activé';
  }

  updateButton();

  // Smooth theme transition helper: add a temporary class then remove it
  function applyThemeTransition(){
    body.classList.add('theme-transition');
    window.setTimeout(()=> body.classList.remove('theme-transition'), 500);
  }

  themeToggle.addEventListener('click', function(){
    applyThemeTransition();
    body.classList.toggle('dark');
    const nowDark = body.classList.contains('dark');
    localStorage.setItem('pg_theme', nowDark ? 'dark' : 'light');
    updateButton();
  });

  // Reveal cards on scroll using IntersectionObserver (staggered)
  const cards = Array.from(document.querySelectorAll('.card'));
  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const el = entry.target;
          // add in-view after a small timeout to create stagger
          const index = cards.indexOf(el);
          const delay = Math.min(250 + index * 80, 600);
          setTimeout(()=> el.classList.add('in-view'), delay);
          observer.unobserve(el);
        }
      });
    },{threshold:0.15});

    cards.forEach(c => observer.observe(c));
  } else {
    // Fallback: reveal all
    cards.forEach((c,i)=> setTimeout(()=> c.classList.add('in-view'), 100 + i*80));
  }

  // keyboard: allow Enter/Space to focus primary button on cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        const btn = card.querySelector('.btn.primary');
        if(btn) btn.focus();
      }
    });
  });

})();