/* ShopZone — shared behaviour: header, footer, cart, wishlist, helpers */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => '$' + Number(n).toFixed(2);

const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

/* ---------- Icons ---------- */
const ICONS = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  truck: '<rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  refresh: '<path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/>',
  headset: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  'map-pin': '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  twitter: '<path d="M23 3a10.9 10.9 0 0 1-3.1 1.5 4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 3 4s-4 9 5 13a13 13 0 0 1-8 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.1-.8A7.7 7.7 0 0 0 23 3z"/>',
  youtube: '<path d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.8 4 12 4 12 4s-6.8 0-8.5.4a2.8 2.8 0 0 0-2 2C1 8.1 1 12 1 12s0 3.9.5 5.6a2.8 2.8 0 0 0 2 2C5.2 20 12 20 12 20s6.8 0 8.5-.4a2.8 2.8 0 0 0 2-2C23 15.9 23 12 23 12s0-3.9-.5-5.6z"/><path d="m10 15 5-3-5-3z"/>',
  shoe: '<path d="M2 17v-3l5-2 3 2 4-1 2-4 4 3v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>',
  watch: '<circle cx="12" cy="12" r="6"/><path d="M12 9v3l1.5 1.5M16.5 17.5l-.5 3.5H8l-.5-3.5M7.5 6.5 8 3h8l.5 3.5"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  glasses: '<circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M10 15a2 2 0 0 1 4 0M2 15 4 6M22 15l-2-9"/>',
  shirt: '<path d="M20.4 3.5 16 2a4 4 0 0 1-8 0L3.6 3.5 1 8l4 2v12h14V10l4-2z"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><path d="M7 7h.01"/>'
};
const icon = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
function hydrateIcons(root = document) {
  $$('[data-i]', root).forEach(el => { el.outerHTML = icon(el.dataset.i, el.className); });
}

/* ---------- Image fallback ---------- */
function imgFallback(img) {
  img.onerror = null;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><defs><radialGradient id='g' cx='50%' cy='55%' r='70%'><stop offset='0' stop-color='#12407a'/><stop offset='1' stop-color='#06162b'/></radialGradient></defs><rect width='400' height='300' fill='url(#g)'/><g fill='none' stroke='#00b8ff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' opacity='.85' transform='translate(160 100) scale(3.2)'><path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z'/><path d='M3 6h18'/><path d='M16 10a4 4 0 0 1-8 0'/></g></svg>`;
  img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
window.imgFallback = imgFallback;

/* ---------- Cart / wishlist ---------- */
const Cart = {
  get: () => store.get('shopzone_cart', []),
  save(c) { store.set('shopzone_cart', c); Cart.badge(); },
  count: () => Cart.get().reduce((s, i) => s + i.qty, 0),
  add(id, qty = 1, size = '') {
    const c = Cart.get();
    const line = c.find(i => i.id === id && (i.size || '') === size);
    line ? line.qty += qty : c.push({ id, qty, size });
    Cart.save(c);
    const p = getProduct(id);
    toast(`${p.name} added to cart`);
    const b = $('.cart-badge'); if (b) { b.classList.add('bump'); setTimeout(() => b.classList.remove('bump'), 250); }
  },
  setQty(id, size, qty) {
    let c = Cart.get();
    c = qty <= 0 ? c.filter(i => !(i.id === id && (i.size || '') === size)) : c.map(i => (i.id === id && (i.size || '') === size) ? { ...i, qty } : i);
    Cart.save(c);
  },
  clear() { Cart.save([]); },
  subtotal: () => Cart.get().reduce((s, i) => s + (getProduct(i.id)?.price || 0) * i.qty, 0),
  badge() {
    const n = Cart.count(), b = $('.cart-badge');
    if (b) { b.textContent = n; b.dataset.n = n; }
  }
};
const Wish = {
  get: () => store.get('shopzone_wish', []),
  has: id => Wish.get().includes(id),
  toggle(id) {
    let w = Wish.get(); const had = w.includes(id);
    w = had ? w.filter(x => x !== id) : [...w, id];
    store.set('shopzone_wish', w);
    toast(had ? 'Removed from wishlist' : 'Saved to wishlist');
    return !had;
  }
};

/* ---------- Toast ---------- */
function toast(msg, type = '') {
  let w = $('.toast-wrap');
  if (!w) { w = document.createElement('div'); w.className = 'toast-wrap'; w.setAttribute('role', 'status'); document.body.appendChild(w); }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = icon(type === 'err' ? 'x' : 'check') + `<span>${msg}</span>`;
  w.appendChild(t);
  setTimeout(() => { t.style.opacity = 0; t.style.transform = 'translateX(30px)'; t.style.transition = '.3s'; setTimeout(() => t.remove(), 300); }, 2600);
}

/* ---------- Components ---------- */
const stars = r => `<span class="stars" style="--r:${(r / 5 * 100).toFixed(0)}%" aria-label="${r} out of 5">★★★★★</span>`;
function productCard(p) {
  return `
  <article class="card reveal">
    <a class="card-img" href="product.html?id=${p.id}">
      <span class="badge${p.off ? '' : ' new'}">-${p.off}%</span>
      <img loading="lazy" src="${p.img}" alt="${p.name}" onerror="imgFallback(this)">
    </a>
    <button class="wish ${Wish.has(p.id) ? 'on' : ''}" data-wish="${p.id}" aria-label="Add ${p.name} to wishlist">${icon('heart')}</button>
    <div class="card-body">
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <div class="rating">${stars(p.rating)}<span>${p.rating} (${p.reviews} reviews)</span></div>
      <div class="price"><s>${money(p.old)}</s><b>${money(p.price)}</b></div>
      <button class="btn btn-outline btn-block" data-add="${p.id}">${icon('cart')} Add to Cart</button>
    </div>
  </article>`;
}
function renderProducts(el, list) {
  el.innerHTML = list.length ? list.map(productCard).join('') : `<div class="empty"><h3>No products found</h3><p>Try changing your filters or search term.</p></div>`;
  observeReveal();
}

const NAV = [['index.html', 'Home', 'home'], ['shop.html', 'Shop', 'shop'], ['categories.html', 'Categories', 'categories'], ['about.html', 'About', 'about'], ['contact.html', 'Contact', 'contact']];

function buildHeader() {
  const page = document.body.dataset.page || '';
  const user = store.get('shopzone_user', null);
  const el = $('#site-header');
  if (!el) return;
  el.outerHTML = `
  <div class="promo-bar">Free shipping on orders over $100 &nbsp;•&nbsp; Use code <b>SHOP10</b> for 10% off</div>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo" aria-label="ShopZone home">
        <svg viewBox="0 0 40 40" fill="none"><path d="M10 14h20l-1.6 18a2 2 0 0 1-2 1.8H13.6a2 2 0 0 1-2-1.8L10 14z" stroke="#00b8ff" stroke-width="2.4" stroke-linejoin="round"/><path d="M15 14v-2a5 5 0 0 1 10 0v2" stroke="#00b8ff" stroke-width="2.4" stroke-linecap="round"/><path d="m16 23.5 3 3 5.5-6" stroke="#00b8ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Shop<span>Zone</span>
      </a>
      <form class="search" id="header-search" role="search">
        ${icon('search')}
        <input type="search" name="q" placeholder="Search for products..." aria-label="Search products" autocomplete="off">
      </form>
      <nav class="nav" id="nav" aria-label="Main">
        ${NAV.map(([h, t, k]) => `<a href="${h}" class="${page === k ? 'active' : ''}">${t}</a>`).join('')}
      </nav>
      <div class="header-actions">
        <a class="icon-btn" href="wishlist.html" aria-label="Wishlist" title="Wishlist">${icon('heart')}</a>
        <a class="icon-btn" href="login.html" aria-label="Account" title="${user ? 'Hi, ' + user.name : 'Sign in'}">${icon('user')}</a>
        <a class="icon-btn boxed" href="cart.html" aria-label="Cart">${icon('cart')}<span class="cart-badge" data-n="0">0</span></a>
        <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Toggle menu" aria-expanded="false">${icon('menu')}</button>
      </div>
    </div>
  </header>`;
}

function buildFooter() {
  const el = $('#site-footer');
  if (!el) return;
  el.outerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="foot-grid">
        <div>
          <a href="index.html" class="logo">Shop<span>Zone</span></a>
          <p>Premium quality products, designed for comfort, style and everyday performance. Delivered to your door.</p>
          <div class="socials">
            <a href="#" aria-label="Facebook">${icon('facebook')}</a>
            <a href="#" aria-label="Instagram">${icon('instagram')}</a>
            <a href="#" aria-label="Twitter">${icon('twitter')}</a>
            <a href="#" aria-label="YouTube">${icon('youtube')}</a>
          </div>
        </div>
        <div><h5>Quick Links</h5><ul>
          <li><a href="index.html">Home</a></li><li><a href="shop.html">Shop</a></li><li><a href="categories.html">Categories</a></li><li><a href="about.html">About Us</a></li><li><a href="contact.html">Contact</a></li></ul></div>
        <div><h5>Categories</h5><ul>${CATEGORIES.map(c => `<li><a href="shop.html?cat=${c.id}">${c.name}</a></li>`).join('')}</ul></div>
        <div><h5>Get in touch</h5>
          <div class="contact-li">${icon('map-pin')}<span>350 5th Ave, New York,<br>NY 10118, United States</span></div>
          <div class="contact-li">${icon('phone')}<span>+1 (202) 555-0147</span></div>
          <div class="contact-li">${icon('mail')}<span>support@shopzone.com</span></div>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© ${new Date().getFullYear()} ShopZone. All rights reserved.</span>
        <div class="pay"><span>VISA</span><span>MASTERCARD</span><span>PayPal</span><span>COD</span></div>
      </div>
    </div>
  </footer>
  <button class="to-top" id="to-top" aria-label="Back to top">${icon('arrow-right')}</button>`;
}

/* ---------- Scroll reveal / counters ---------- */
let revealObs;
function observeReveal() {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(e => e.classList.add('in')); return; }
  revealObs = revealObs || new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal:not(.in)').forEach(e => revealObs.observe(e));
}
function counters() {
  const els = $$('[data-count]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  const o = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
    const tick = t => { const k = Math.min((t - t0) / 1400, 1); el.textContent = Math.floor(end * (1 - Math.pow(1 - k, 3))).toLocaleString() + suf; if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick); o.unobserve(el);
  }), { threshold: .5 });
  els.forEach(e => o.observe(e));
}

/* ---------- Global events ---------- */
document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) { e.preventDefault(); Cart.add(+add.dataset.add); return; }
  const w = e.target.closest('[data-wish]');
  if (w) {
    e.preventDefault();
    const on = Wish.toggle(+w.dataset.wish);
    w.classList.toggle('on', on);
    if (document.body.dataset.page === 'wishlist' && !on) w.closest('.card')?.remove();
    return;
  }
  if (e.target.closest('#menu-toggle')) {
    const n = $('#nav'); n.classList.toggle('open');
    $('#menu-toggle').setAttribute('aria-expanded', n.classList.contains('open'));
  }
  if (e.target.closest('#to-top')) window.scrollTo({ top: 0, behavior: 'smooth' });
});
window.addEventListener('scroll', () => $('#to-top')?.classList.toggle('show', scrollY > 600), { passive: true });

document.addEventListener('submit', e => {
  if (e.target.id === 'header-search') {
    e.preventDefault();
    const q = e.target.q.value.trim();
    location.href = 'shop.html' + (q ? '?q=' + encodeURIComponent(q) : '');
  }
  if (e.target.matches('[data-newsletter]')) {
    e.preventDefault();
    const i = e.target.querySelector('input');
    if (i.checkValidity()) { toast('Thanks for subscribing!'); e.target.reset(); } else toast('Please enter a valid email', 'err');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  buildHeader(); buildFooter();
  hydrateIcons();
  Cart.badge();
  const q = new URLSearchParams(location.search).get('q');
  if (q && $('#header-search')) $('#header-search').q.value = q;
  observeReveal(); counters();
  document.dispatchEvent(new Event('shopzone:ready'));
});
