(() => {
  const controls = document.querySelector('[data-filter-controls]');
  const cards = [...document.querySelectorAll('[data-record]')];
  const status = document.querySelector('[data-filter-status]');
  if (!controls || !status || cards.length === 0) return;
  controls.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-filter]') : null;
    if (!button) return;
    const filter = button.dataset.filter;
    controls.querySelectorAll('[data-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    let visible = 0;
    cards.forEach((card) => {
      const show = filter === 'all' || card.dataset.type === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    status.textContent = `${visible}টি রেকর্ড দেখানো হচ্ছে`;
  });
})();
