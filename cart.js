/* Cart page */
document.addEventListener('shopzone:ready', () => {
  const root = $('#cart-root');
  const FREE_AT = 100, SHIP = 5.99;
  let coupon = store.get('shopzone_coupon', '');

  const totals = () => {
    const sub = Cart.subtotal();
    const disc = coupon === 'SHOP10' ? sub * 0.1 : 0;
    const ship = sub === 0 || sub - disc >= FREE_AT ? 0 : SHIP;
    return { sub, disc, ship, total: sub - disc + ship };
  };

  function render() {
    const items = Cart.get();
    if (!items.length) {
      root.innerHTML = `<div class="panel empty" style="padding:80px 20px">${icon('cart')}<h3 style="margin-top:12px">Your cart is empty</h3><p>Looks like you haven't added anything yet.</p><a href="shop.html" class="btn btn-primary" style="margin-top:22px">Start Shopping</a></div>`;
      hydrateIcons(root); return;
    }
    const t = totals();
    const pct = Math.min(100, (t.sub - t.disc) / FREE_AT * 100);
    root.innerHTML = `
    <div class="cart-layout">
      <div class="panel">
        ${items.map(i => {
          const p = getProduct(i.id); if (!p) return '';
          return `
          <div class="cart-item" data-id="${i.id}" data-size="${i.size || ''}">
            <a href="product.html?id=${p.id}"><img src="${p.img}" alt="${p.name}" onerror="imgFallback(this)"></a>
            <div>
              <h4><a href="product.html?id=${p.id}">${p.name}</a></h4>
              <small>${getCategory(p.cat).name}${i.size ? ' · Size ' + i.size : ''}</small>
              <div class="price" style="margin-top:6px"><b style="font-size:1rem">${money(p.price)}</b><s>${money(p.old)}</s></div>
            </div>
            <div class="ci-right">
              <b>${money(p.price * i.qty)}</b>
              <div class="qty"><button data-act="minus" aria-label="Decrease">${icon('minus')}</button><span>${i.qty}</span><button data-act="plus" aria-label="Increase">${icon('plus')}</button></div>
              <button class="remove" data-act="remove">${icon('trash')} Remove</button>
            </div>
          </div>`;
        }).join('')}
      </div>

      <aside class="summary panel">
        <h3>Order Summary</h3>
        <div class="hint">${t.ship === 0 ? 'You\'ve unlocked free shipping 🎉' : `Add ${money(FREE_AT - (t.sub - t.disc))} more for free shipping`}</div>
        <div class="free-ship"><i style="width:${pct}%"></i></div>
        <div class="coupon">
          <input id="coupon" placeholder="Coupon code" value="${coupon}" aria-label="Coupon code">
          <button class="btn btn-outline btn-sm" id="apply">Apply</button>
        </div>
        <div class="sum-row"><span>Subtotal</span><span>${money(t.sub)}</span></div>
        ${t.disc ? `<div class="sum-row disc"><span>Discount (SHOP10)</span><span>−${money(t.disc)}</span></div>` : ''}
        <div class="sum-row"><span>Shipping</span><span>${t.ship ? money(t.ship) : 'Free'}</span></div>
        <div class="sum-row total"><span>Total</span><span>${money(t.total)}</span></div>
        <button class="btn btn-primary btn-block" id="checkout-btn" style="margin-top:18px">Proceed to Checkout ${icon('arrow-right')}</button>
        <a href="shop.html" class="btn btn-ghost btn-block" style="margin-top:10px">Continue Shopping</a>
      </aside>
    </div>`;
  }

  root.addEventListener('click', e => {
    const row = e.target.closest('.cart-item');
    const act = e.target.closest('[data-act]');
    if (row && act) {
      const id = +row.dataset.id, size = row.dataset.size;
      const line = Cart.get().find(i => i.id === id && (i.size || '') === size);
      if (act.dataset.act === 'plus') Cart.setQty(id, size, Math.min(10, line.qty + 1));
      if (act.dataset.act === 'minus') Cart.setQty(id, size, line.qty - 1);
      if (act.dataset.act === 'remove') { Cart.setQty(id, size, 0); toast('Item removed'); }
      render(); return;
    }
    if (e.target.closest('#apply')) {
      const v = $('#coupon').value.trim().toUpperCase();
      if (v === 'SHOP10') { coupon = v; store.set('shopzone_coupon', v); toast('Coupon applied: 10% off'); }
      else if (!v) { coupon = ''; store.set('shopzone_coupon', ''); }
      else toast('Invalid coupon code', 'err');
      render(); return;
    }
    if (e.target.closest('#checkout-btn')) {
      $('#co-total').textContent = money(totals().total);
      $('#co-form-wrap').hidden = false; $('#co-success').hidden = true;
      $('#checkout').classList.add('open');
      $('#co-name').focus();
    }
  });

  /* checkout modal */
  const modal = $('#checkout');
  const closeModal = () => modal.classList.remove('open');
  $('#co-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  const user = store.get('shopzone_user', null);
  if (user) { $('#co-name').value = user.name || ''; $('#co-email').value = user.email || ''; }

  const form = $('#co-form');
  form.addEventListener('input', e => e.target.closest('.field')?.classList.remove('bad'));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    ['name', 'phone', 'email', 'address'].forEach(n => {
      const f = form[n], bad = !f.checkValidity() || !f.value.trim();
      f.closest('.field').classList.toggle('bad', bad); if (bad) ok = false;
    });
    if (!ok) return;
    const num = 'SZ-' + Date.now().toString().slice(-7);
    const orders = store.get('shopzone_orders', []);
    orders.push({ num, items: Cart.get(), total: totals().total, date: new Date().toISOString() });
    store.set('shopzone_orders', orders);
    Cart.clear(); store.set('shopzone_coupon', ''); coupon = '';
    $('#co-num').textContent = num;
    $('#co-form-wrap').hidden = true; $('#co-success').hidden = false;
    render();
  });

  render();
});
