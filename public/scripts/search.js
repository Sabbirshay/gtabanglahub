(() => {
  const input = document.querySelector('[data-search-input]');
  const status = document.querySelector('[data-search-status]');
  const clear = document.querySelector('[data-search-clear]');
  const empty = document.querySelector('[data-search-empty]');
  const items = [...document.querySelectorAll('[data-search-item]')];
  if (!input || !status || !clear || !empty) return;
  const update = () => {
    const query = input.value.trim().toLocaleLowerCase('bn-BD');
    let visible = 0;
    items.forEach((item) => {
      const show = !query || (item.dataset.search ?? '').includes(query);
      item.hidden = !show;
      if (show) visible += 1;
    });
    clear.hidden = !query;
    empty.hidden = visible !== 0;
    status.textContent = query ? `${visible}টি ফলাফল পাওয়া গেছে` : `${visible}টি ফলাফল প্রস্তুত`;
  };
  input.addEventListener('input', update);
  clear.addEventListener('click', () => { input.value = ''; update(); input.focus(); });
})();
