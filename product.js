/* Product detail page */
document.addEventListener('shopzone:ready', () => {
  const id = +new URLSearchParams(location.search).get('id');
  const p = getProduct(id);
  const root = $('#pd');

  if (!p) {
    root.innerHTML = `<div class="empty panel" style="padding:80px 20px"><h3>Product not found</h3><p>The product you're looking for doesn't exist.</p><a class="btn btn-primary" style="margin-top:20px" href="shop.html">Back to Shop</a></div>`;
    $('#related').closest('section').remove();
    return;
  }

  const cat = getCategory(p.cat);
  document.title = `${p.name} — ShopZone`;
  $('#crumbs').innerHTML = `<a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <a href="shop.html?cat=${cat.id}">${cat.name}</a> / <span>${p.name}</span>`;

  let size = p.sizes[0] || '', qty = 1, color = COLORS[0][0];
  const reviews = [
    ['Rafiq A.', 5, 'Exactly as described and arrived quickly. Great value for the price.'],
    ['Nusrat J.', 4.5, 'Quality feels premium. Packaging was neat and secure.'],
    ['Tanvir H.', 4, 'Very happy overall. Would have liked slightly more colour options.']
  ];

  root.innerHTML = `
  <div class="pd">
    <div class="pd-gallery panel">
      <div class="pd-main"><img id="pd-main" src="${p.gallery[0]}" alt="${p.name}" onerror="imgFallback(this)"></div>
      <div class="pd-thumbs">${p.gallery.map((g, i) => `<button class="${i === 0 ? 'on' : ''}" data-src="${g}" aria-label="View image ${i + 1}"><img src="${g.replace('w=800', 'w=200')}" alt="" onerror="imgFallback(this)"></button>`).join('')}</div>
    </div>
    <div class="pd-info">
      <span class="eyebrow">${cat.name}</span>
      <h1>${p.name}</h1>
      <div class="rating">${stars(p.rating)}<span>${p.rating} · ${p.reviews} reviews</span></div>
      <div class="price" style="margin-top:14px"><b>${money(p.price)}</b><s>${money(p.old)}</s><span class="save-tag">Save ${p.off}%</span></div>
      <p class="pd-desc">${p.desc}</p>

      ${p.sizes.length ? `<div class="opt-label">Size</div><div class="opts" id="sizes">${p.sizes.map((s, i) => `<button class="opt ${i === 0 ? 'on' : ''}" data-size="${s}">${s}</button>`).join('')}</div>` : ''}
      <div class="opt-label">Colour: <span id="color-name" style="color:var(--muted);font-weight:400">${color}</span></div>
      <div class="opts" id="colors">${COLORS.map(([n, c], i) => `<button class="opt swatch ${i === 0 ? 'on' : ''}" style="background:${c}" data-color="${n}" aria-label="${n}"></button>`).join('')}</div>

      <div class="buy-row">
        <div class="qty"><button id="q-minus" aria-label="Decrease">${icon('minus')}</button><span id="q-val">1</span><button id="q-plus" aria-label="Increase">${icon('plus')}</button></div>
        <button class="btn btn-primary" id="add" style="flex:1;min-width:180px">${icon('cart')} Add to Cart</button>
        <button class="btn btn-ghost wish-btn ${Wish.has(p.id) ? 'on' : ''}" data-wish="${p.id}" aria-label="Wishlist">${icon('heart')}</button>
      </div>
      <button class="btn btn-outline btn-block" id="buy-now">Buy it now</button>

      <div class="perks panel" style="margin-top:24px">
        <div>${icon('truck')} Free shipping on orders over $100</div>
        <div>${icon('refresh')} 30-day easy returns</div>
        <div>${icon('shield')} Secure checkout &amp; 12-month support</div>
      </div>
    </div>
  </div>

  <div style="margin-top:56px">
    <div class="tabs" role="tablist">
      <button class="tab on" data-tab="t1">Description</button>
      <button class="tab" data-tab="t2">Specifications</button>
      <button class="tab" data-tab="t3">Reviews (${p.reviews})</button>
    </div>
    <div class="tab-pane on" id="t1">
      <p style="color:#c8d7e8;max-width:760px;margin-bottom:14px">${p.desc} Designed to blend into your routine, the ${p.name} focuses on the details that matter: comfort, durability and clean looks.</p>
      <ul class="dot">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
    </div>
    <div class="tab-pane" id="t2"><table class="spec">${p.specs.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table></div>
    <div class="tab-pane" id="t3">${reviews.map(([n, r, t]) => `<div class="review"><div class="who"><div class="avatar">${n[0]}</div><div><b>${n}</b>${stars(r)}</div></div><p>${t}</p></div>`).join('')}</div>
  </div>`;

  hydrateIcons(root);
  observeReveal();

  /* gallery */
  $$('.pd-thumbs button').forEach(b => b.addEventListener('click', () => {
    $('#pd-main').src = b.dataset.src;
    $$('.pd-thumbs button').forEach(x => x.classList.toggle('on', x === b));
  }));
  /* options */
  $('#sizes')?.addEventListener('click', e => {
    const b = e.target.closest('[data-size]'); if (!b) return;
    size = b.dataset.size; $$('#sizes .opt').forEach(x => x.classList.toggle('on', x === b));
  });
  $('#colors').addEventListener('click', e => {
    const b = e.target.closest('[data-color]'); if (!b) return;
    color = b.dataset.color; $('#color-name').textContent = color;
    $$('#colors .opt').forEach(x => x.classList.toggle('on', x === b));
  });
  /* qty */
  const setQ = n => { qty = Math.max(1, Math.min(10, n)); $('#q-val').textContent = qty; };
  $('#q-minus').addEventListener('click', () => setQ(qty - 1));
  $('#q-plus').addEventListener('click', () => setQ(qty + 1));
  /* buy */
  $('#add').addEventListener('click', () => Cart.add(p.id, qty, size));
  $('#buy-now').addEventListener('click', () => { Cart.add(p.id, qty, size); location.href = 'cart.html'; });
  /* tabs */
  $$('.tab').forEach(t => t.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.toggle('on', x === t));
    $$('.tab-pane').forEach(x => x.classList.toggle('on', x.id === t.dataset.tab));
  }));

  renderProducts($('#related'), PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4));
});
