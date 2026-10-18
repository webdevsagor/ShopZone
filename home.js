/* Home page */
document.addEventListener('shopzone:ready', () => {
  /* Hero slider */
  const slides = [
    { pid: 6, eyebrow: 'Trending Now', a: 'Step Into', b: 'Better Style', text: 'Discover premium quality products, designed for comfort, style and everyday performance.', cta: 'shop.html?cat=sneakers' },
    { pid: 13, eyebrow: 'New Season', a: 'Hear Every', b: 'Little Detail', text: 'Studio-tuned sound with adaptive noise cancelling, built for focus and long listening sessions.', cta: 'shop.html?cat=headphones' },
    { pid: 3, eyebrow: 'Best Seller', a: 'Smarter Days', b: 'Start Here', text: 'Track workouts, sleep and notifications with a smartwatch that keeps up with your life.', cta: 'shop.html?cat=smartwatches' }
  ];
  const hero = $('#hero');
  hero.innerHTML = slides.map((s, i) => {
    const p = getProduct(s.pid);
    return `
    <div class="hero-slide ${i === 0 ? 'on' : ''}" aria-hidden="${i !== 0}">
      <div class="hero-copy">
        <span class="eyebrow">${s.eyebrow}</span>
        <h1>${s.a}<em>${s.b}</em></h1>
        <p>${s.text}</p>
        <a href="${s.cta}" class="btn btn-primary">Shop Now ${icon('arrow-right')}</a>
      </div>
      <div class="hero-visual"><div class="hero-ring"><div class="inner"><img src="${unsplash(IMG_IDS[p.cat][0], 900)}" alt="${p.name}" onerror="imgFallback(this)"></div></div></div>
      <div class="hero-info">
        <h3>${p.name}</h3>
        <div class="tags">${p.tags.map((t, k) => (k ? '<i></i>' : '') + `<span>${t}</span>`).join('')}</div>
        <div class="price"><b style="color:#fff">${money(p.price)}</b></div>
        <a href="product.html?id=${p.id}" class="btn btn-ghost btn-sm">View Details ${icon('arrow-right')}</a>
      </div>
    </div>`;
  }).join('') + `<div class="hero-dots">${slides.map((_, i) => `<button class="${i === 0 ? 'on' : ''}" aria-label="Slide ${i + 1}"></button>`).join('')}</div>`;

  const els = $$('.hero-slide', hero), dots = $$('.hero-dots button', hero);
  let cur = 0, timer;
  const go = n => {
    cur = (n + els.length) % els.length;
    els.forEach((e, i) => { e.classList.toggle('on', i === cur); e.setAttribute('aria-hidden', i !== cur); });
    dots.forEach((d, i) => d.classList.toggle('on', i === cur));
  };
  const start = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 6000); };
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); start(); }));
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', start);
  start();

  /* Category strip */
  $('#cat-strip').innerHTML = CATEGORIES.map(c => {
    const n = PRODUCTS.filter(p => p.cat === c.id).length;
    return `<a class="cat-tile reveal" href="shop.html?cat=${c.id}"><div class="cat-ico">${icon(c.icon)}</div><div><b>${c.name}</b><small>${n} Products</small></div></a>`;
  }).join('');

  /* Product grids */
  renderProducts($('#featured'), FEATURED_IDS.map(getProduct));
  renderProducts($('#arrivals'), PRODUCTS.filter(p => p.isNew).slice(-4).reverse());

  /* Countdown — resets every 3 days from a stable anchor so it never hits a dead end */
  const period = 3 * 864e5;
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const left = period - (Date.now() % period);
    $('#cd-d').textContent = pad(Math.floor(left / 864e5));
    $('#cd-h').textContent = pad(Math.floor(left % 864e5 / 36e5));
    $('#cd-m').textContent = pad(Math.floor(left % 36e5 / 6e4));
    $('#cd-s').textContent = pad(Math.floor(left % 6e4 / 1e3));
  };
  tick(); setInterval(tick, 1000);
});
