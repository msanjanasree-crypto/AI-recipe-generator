/* ============================================
   AI RECIPE GENERATOR — Interactions
   ============================================ */
// Page loader
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 400);
});
// Scroll progress + navbar shadow + back to top
const navbar = document.getElementById('navbar');
const scrollBar = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  if (scrollBar) scrollBar.style.width = pct + '%';
  if (navbar) navbar.classList.toggle('scrolled', h.scrollTop > 20);
  if (backToTop) backToTop.classList.toggle('show', h.scrollTop > 400);
});
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const applyTheme = (t) => {
  document.body.classList.toggle('dark', t === 'dark');
  if (themeToggle) themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
};
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);
themeToggle?.addEventListener('click', () => {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
});
// Cursor glow (desktop only)
const cursor = document.getElementById('cursorGlow');
if (cursor && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
  });
}
// Typing animation
const typingEl = document.getElementById('typing');
if (typingEl) {
  const phrases = ['in seconds.', 'from anything.', 'made just for you.', 'with zero waste.'];
  let pi = 0, ci = 0, deleting = false;
  const tick = () => {
    const p = phrases[pi];
    typingEl.textContent = p.slice(0, ci);
    if (!deleting && ci < p.length) { ci++; setTimeout(tick, 70); }
    else if (deleting && ci > 0) { ci--; setTimeout(tick, 35); }
    else {
      deleting = !deleting;
      if (!deleting) pi = (pi + 1) % phrases.length;
      setTimeout(tick, deleting ? 1600 : 300);
    }
  };
  tick();
}
// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
// Generate recipe — handled by the recipeForm submit listener below
// (localStorage.setItem + redirect to recipe.html)
// Popular recipes (rendered dynamically)
const popular = [
  { name: 'Truffle Mushroom Risotto', emoji: '🍚', time: '35 min', rating: '4.9' },
  { name: 'Spicy Ramen Bowl', emoji: '🍜', time: '25 min', rating: '4.8' },
  { name: 'Margherita Pizza', emoji: '🍕', time: '40 min', rating: '4.9' },
  { name: 'Rainbow Buddha Bowl', emoji: '🥗', time: '20 min', rating: '4.7' },
  { name: 'Butter Chicken', emoji: '🍛', time: '45 min', rating: '4.9' },
  { name: 'Berry Pancakes', emoji: '🥞', time: '15 min', rating: '4.8' },
  { name: 'Grilled Salmon', emoji: '🐟', time: '25 min', rating: '4.9' },
  { name: 'Chocolate Lava', emoji: '🍫', time: '20 min', rating: '5.0' },
];
const popRow = document.getElementById('popularRow');
if (popRow) {
  popRow.innerHTML = popular.map(r => `
    <article class="recipe-card">
      <div class="recipe-media"><span>${r.emoji}</span></div>
      <div class="recipe-body">
        <h4>${r.name}</h4>
        <div class="recipe-meta">
          <span>⏱ ${r.time} · ⭐ ${r.rating}</span>
          <button class="like-btn" aria-label="Like">🤍</button>
        </div>
      </div>
    </article>
  `).join('');
  popRow.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const liked = btn.textContent === '❤️';
      btn.textContent = liked ? '🤍' : '❤️';
      btn.classList.add('liked');
      setTimeout(() => btn.classList.remove('liked'), 500);
    });
  });
}
// Testimonials (duplicated for seamless loop)
const testimonials = [
  { name: 'Aarav Sharma', role: 'Home Chef', text: 'Genuinely mind-blowing. I threw in random leftovers and got a restaurant-quality dinner.', avatar: '👨' },
  { name: 'Emma Wilson', role: 'Food Blogger', text: 'The UI is gorgeous and the recipes are actually good. My new secret weapon.', avatar: '👩' },
  { name: 'Rohit Verma', role: 'Student', text: 'Saves me time, money, and food waste. Truly a game-changer for my tiny kitchen.', avatar: '🧑' },
  { name: 'Sofia Rossi', role: 'Nutritionist', text: 'The healthy suggestions are on point. I recommend it to all my clients now.', avatar: '👩‍⚕️' },
  { name: 'Kenji Tanaka', role: 'Foodie', text: 'Feels like ChatGPT but for cooking. Insanely well designed.', avatar: '👨‍🍳' },
];
const track = document.getElementById('testiTrack');
if (track) {
  const cardHTML = (t) => `
    <div class="testi-card">
      <div class="testi-head">
        <div class="testi-avatar">${t.avatar}</div>
        <div>
          <div class="testi-name">${t.name}</div>
          <div class="testi-role">${t.role}</div>
        </div>
      </div>
      <div class="testi-stars">★★★★★</div>
      <p class="testi-text">"${t.text}"</p>
    </div>
  `;
  track.innerHTML = [...testimonials, ...testimonials].map(cardHTML).join('');
}
const form = document.getElementById("recipeForm");
const ingredientInput = document.getElementById("ingredientInput");
const generateBtn = document.getElementById("generateBtn");

const goToRecipePage = (e) => {
  if (e) e.preventDefault();

  const ingredient = ingredientInput?.value.trim() || "";
  localStorage.setItem("ingredient", ingredient);
  window.location.assign("recipe.html");
};

if (form) {
  form.addEventListener("submit", goToRecipePage);
}

if (generateBtn) {
  generateBtn.addEventListener("click", goToRecipePage);
}
// Filter chips
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});