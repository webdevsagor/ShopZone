/* Shop page: filtering, sorting, search */
document.addEventListener('shopzone:ready', () => {
  const params = new URLSearchParams(location.search);
  const state = {
    cats: new Set(params.get('cat') ? [params.get('cat')] : []),
    q: params.get('q') || '',
    sort: params.get('sort') || 'featured',
    max: 200, rating: 0, sale: false
  };

  const catBox = $('#cat-filters');
  catBox.innerHTML = CATEGORIES.map(c => `
    <label class="check"><input type="checkbox" value="${c.id}" ${state.cats.has(c.id) ? 'checked' : ''}> ${c.name}
      <span class="n">${PRODUCTS.filter(p => p.cat === c.id).length}</span></label>`).join('');

  $('#shop-q').value = state.q;
  $('#sort').value = state.sort;

  function apply() {
    let list = PRODUCTS.filter(p =>
      (!state.cats.size || state.cats.has(p.cat)) &&
      p.price <= state.max &&
      p.rating >= state.rating &&
      (!state.sale || p.off >= 20) &&
      (!state.q || (p.name + ' ' + p.cat + ' ' + p.desc).toLowerCase().includes(state.q.toLowerCase()))
    );
    const sorters = {
      featured: (a, b) => a.id - b.id,
      new: (a, b) => (b.isNew - a.isNew) || b.id - a.id,
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      discount: (a, b) => b.off - a.off
    };
    list.sort(sorters[state.sort] || sorters.featured);
    renderProducts($('#shop-grid'), list);
    $('#result-count').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;

    const only = state.cats.size === 1 ? getCategory([...state.cats][0]) : null;
    $('#shop-title').textContent = state.q ? `Results for “${state.q}”` : only ? only.name : 'All Products';
    document.title = `${$('#shop-title').textContent} — ShopZone`;
  }

  catBox.addEventListener('change', e => {
    e.target.checked ? state.cats.add(e.target.value) : state.cats.delete(e.target.value);
    apply();
  });
  $('#price').addEventListener('input', e => { state.max = +e.target.value; $('#price-val').textContent = '$' + state.max; apply(); });
  $$('input[name=rating]').forEach(r => r.addEventListener('change', () => { state.rating = +r.value; apply(); }));
  $('#on-sale').addEventListener('change', e => { state.sale = e.target.checked; apply(); });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; apply(); });
  let t;
  $('#shop-q').addEventListener('input', e => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value.trim(); apply(); }, 200); });
  $('#reset').addEventListener('click', () => {
    state.cats.clear(); state.q = ''; state.max = 200; state.rating = 0; state.sale = false; state.sort = 'featured';
    $$('#cat-filters input').forEach(i => i.checked = false);
    $('#price').value = 200; $('#price-val').textContent = '$200';
    $('input[name=rating][value="0"]').checked = true;
    $('#on-sale').checked = false; $('#shop-q').value = ''; $('#sort').value = 'featured';
    apply();
  });

  /* mobile filter drawer */
  const f = $('#filters'), closeBtn = $('#close-filters');
  const mq = window.matchMedia('(max-width:960px)');
  const syncClose = () => closeBtn.style.display = mq.matches ? 'grid' : 'none';
  syncClose(); mq.addEventListener('change', syncClose);
  $('#open-filters').addEventListener('click', () => f.classList.add('open'));
  closeBtn.addEventListener('click', () => f.classList.remove('open'));

  apply();
});
