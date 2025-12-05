// Theme toggle and simple accessibility helpers
(function(){
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const body = document.body;

  // Load saved preference
  const saved = localStorage.getItem('pg_theme');
  if(saved === 'dark') body.classList.add('dark');

  function updateButton(){
    const isDark = body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  }

  updateButton();

  themeToggle.addEventListener('click', function(){
    body.classList.toggle('dark');
    const nowDark = body.classList.contains('dark');
    localStorage.setItem('pg_theme', nowDark ? 'dark' : 'light');
    updateButton();
  });

  // keyboard: allow Enter/Space to activate buttons on cards
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