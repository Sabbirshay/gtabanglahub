(() => {
  const form = document.querySelector('[data-community-form]');
  const status = document.querySelector('[data-community-status]');
  if (!form || !status) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const kind = String(data.get('kind') || 'কমিউনিটি প্রস্তাব');
    const destination = kind === 'সংশোধন' ? 'corrections@gtabanglahub.com' : 'community@gtabanglahub.com';
    const subject = `[GTA Bangla Hub] ${kind}: ${String(data.get('title') || '')}`;
    const body = [`ধরন: ${kind}`, `বিষয়: ${data.get('title')}`, `উৎস/পাতা: ${data.get('source')}`, `স্পয়লার: ${data.get('spoiler')}`, `কৃতিত্ব: ${data.get('credit')}`, '', 'বিস্তারিত:', String(data.get('details') || '')].join('\n');
    status.textContent = 'ইমেইল অ্যাপ খোলা হচ্ছে—পাঠানোর আগে প্রাপক ও লেখা যাচাই করুন।';
    window.location.href = `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
