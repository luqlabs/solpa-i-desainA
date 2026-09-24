'use strict';

(() => {
  const shades = window.SOLPACI_SHADES;
  const page = document.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const CART_KEY = 'solpaci-a-demo-cart-v1';
  const LANG_KEY = 'solpaci-a-lang';
  let storageAvailable = true;
  function read(key) {
    try { return localStorage.getItem(key); } catch { storageAvailable = false; return null; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, value); } catch { storageAvailable = false; }
  }
  const lang = (params.get('lang') || read(LANG_KEY)) === 'en' ? 'en' : 'id';
  const t = (id, en) => lang === 'en' ? en : id;
  const text = pair => pair[lang === 'en' ? 1 : 0];
  const money = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  const url = (name, query = {}) => `${name}.html?${new URLSearchParams({ ...query, lang })}`;
  const arrow = '<span aria-hidden="true">↗</span>';
  const link = (name, title, secondary = false, query = {}) => `<a class="button${secondary ? ' secondary' : ''}" href="${url(name, query)}">${title}${arrow}</a>`;
  const find = id => shades.find(shade => shade.id === id);
  const normalize = raw => Array.isArray(raw) ? shades.flatMap(shade => {
    const item = raw.find(entry => entry && entry.id === shade.id && Number.isInteger(entry.qty) && entry.qty > 0);
    return item ? [{ id: shade.id, qty: Math.min(10, item.qty) }] : [];
  }) : [];
  let cart = [];
  try { cart = normalize(JSON.parse(read(CART_KEY) || '[]')); } catch { cart = []; }
  const count = () => cart.reduce((sum, item) => sum + item.qty, 0);
  const total = () => cart.reduce((sum, item) => sum + find(item.id).price * item.qty, 0);
  const main = document.querySelector('#main');
  let toastTimer;
  function announce(message) {
    const toast = document.querySelector('#toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
  }
  function save() {
    write(CART_KEY, JSON.stringify(cart));
    updateCount();
  }
  function updateCount() {
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = count(); });
    document.querySelector('#storage-note').hidden = storageAvailable;
  }
  function add(id, qty = 1) {
    if (!find(id) || !Number.isInteger(qty) || qty < 1) return;
    const item = cart.find(entry => entry.id === id);
    if ((item ? item.qty : 0) + qty > 10) {
      announce(t('Batas simulasi: 10 item per shade.', 'Demo limit: 10 items per shade.'));
      return;
    }
    if (item) item.qty += qty; else cart.push({ id, qty });
    save();
    announce(`${find(id).name} ${t('ditambahkan ke keranjang demo.', 'added to your demo bag.')}`);
  }
  function breadcrumb(title) {
    return `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="${url('index')}">${t('Beranda', 'Home')}</a><span aria-hidden="true">/</span><span aria-current="page">${title}</span></nav>`;
  }
  function heading(kicker, title, description) {
    return `<header class="page-heading"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p>${description}</p></header>`;
  }
  function faqItem(question, answer) {
    return `<details><summary>${question}</summary><p>${answer}</p></details>`;
  }
  const productNote = t('Nama, harga, kemasan, dan warna adalah contoh untuk review desain. Ilustrasi bukan foto atau acuan warna produk asli.', 'Names, prices, packaging and colors are samples for design review. Illustrations are not photographs or accurate product color references.');
  function card(shade) {
    return `<article class="product-card">
      <a class="product-image" href="${url('product', { shade: shade.id })}" aria-label="${t('Lihat shade', 'View shade')} ${shade.name}">
        <img src="images/shade-${shade.id}.svg" alt="${t('Ilustrasi botol', 'Bottle illustration')}: ${shade.name}" width="600" height="700" loading="lazy">
        <span class="image-index">0${Number(shade.id)} —</span><span class="image-label">${t('ILUSTRASI', 'ILLUSTRATION')}</span>
      </a>
      <div class="product-meta"><div><h3><a href="${url('product', { shade: shade.id })}">${shade.name}</a></h3><p class="small">${text(shade.label)}</p></div><span class="swatch-dot" style="--shade:${shade.color}" aria-hidden="true"></span></div>
      <div class="card-bottom"><span>${money(shade.price)} <span class="caption">/ demo</span></span><button class="quick-add" data-add="${shade.id}" aria-label="${t('Tambah', 'Add')} ${shade.name} ${t('ke keranjang demo', 'to demo bag')}">+</button></div>
    </article>`;
  }
  function shell() {
    const nav = [['index', t('Beranda', 'Home'), 'home'], ['shop', t('Koleksi', 'Shop'), 'shop'], ['about', t('Cerita kami', 'About'), 'about'], ['faq', 'FAQ', 'faq']];
    document.documentElement.lang = lang;
    document.querySelector('.skip-link').textContent = t('Lewati ke konten', 'Skip to content');
    document.querySelector('#site-top').innerHTML = `<div class="preview-bar"><span>A / SOFT EDITORIAL</span><span>${t('Preview desain · bukan toko aktif', 'Design preview · not a live store')}</span></div>
      <header class="site-header"><a class="wordmark" href="${url('index')}" aria-label="Solpaċi — ${t('beranda', 'home')}">solpaċi</a>
        <nav id="site-nav" aria-label="${t('Navigasi utama', 'Main navigation')}">${nav.map(([file, title, name]) => `<a href="${url(file)}"${page === name ? ' aria-current="page"' : ''}>${title}</a>`).join('')}</nav>
        <div class="header-actions"><button class="language-switch" id="language-switch" aria-label="${t('Switch to English', 'Ganti ke Bahasa Indonesia')}">${lang === 'id' ? '<strong>ID</strong> <span>/ EN</span>' : '<span>ID /</span> <strong>EN</strong>'}</button>
          <a class="bag-link" href="${url('cart')}" aria-label="${t('Keranjang demo', 'Demo bag')}"><svg viewBox="0 0 24 26" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M4 8h16l1 15H3L4 8Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg><span data-cart-count>${count()}</span></a>
          <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu <span aria-hidden="true">+</span></button>
        </div>
      </header><p id="storage-note" class="storage-note"${storageAvailable ? ' hidden' : ''}>${t('Penyimpanan browser tidak tersedia. Keranjang hanya bertahan pada halaman ini; perpindahan halaman dapat mengosongkannya.', 'Browser storage is unavailable. The bag only lasts on this page; navigating away may clear it.')}</p>`;
    document.querySelector('#site-bottom').innerHTML = `<footer><div class="footer-top"><div><a class="wordmark" href="${url('index')}">solpaċi</a><p class="small">${t('Sedikit warna. Banyak cerita.<br>Sebuah ruang kecil untuk menjadi dirimu.', 'A little color. A lot of stories.<br>A little space to be yourself.')}</p></div>
      <nav aria-label="${t('Jelajahi', 'Explore')}"><p class="eyebrow">${t('Jelajahi', 'Explore')}</p><a href="${url('shop')}">${t('Semua warna', 'All shades')}</a><a href="${url('about')}">${t('Cerita Solpaċi', 'Our story')}</a><a href="${url('cart')}">${t('Keranjang demo', 'Demo bag')}</a></nav>
      <nav aria-label="${t('Informasi', 'Information')}"><p class="eyebrow">${t('Baik untuk tahu', 'Good to know')}</p><a href="${url('faq')}">FAQ</a><a href="${url('faq')}#shopping">${t('Belanja & pengiriman', 'Shopping & shipping')}</a><a href="${url('faq')}#preview">${t('Tentang preview & privasi', 'Preview & privacy')}</a></nav></div>
      <div class="footer-bottom"><span>© 2026 Solpaċi · ${t('Studi desain A', 'Design study A')}</span><span>${t('Wordmark, ilustrasi, shade, harga & copy masih contoh.', 'Wordmark, illustrations, shades, prices & copy are samples.')}</span></div></footer>`;
    const titles = { home: t('Beranda', 'Home'), shop: t('Koleksi warna', 'Shop shades'), product: t('Detail shade', 'Shade details'), cart: t('Keranjang', 'Your bag'), checkout: t('Checkout simulasi', 'Demo checkout'), about: t('Cerita kami', 'Our story'), faq: 'FAQ' };
    document.title = `${titles[page] || 'Home'} — Solpaċi / Soft Editorial`;
  }
  const commonFaq = () => [
    [t('Bagaimana menemukan warna favorit?', 'How do I find my shade?'), t('Mulai dari warna yang terasa dekat denganmu. Jelajahi keluarga lembut atau berani, lalu lihat ilustrasi botol dan swatch pada detail shade. Warna layar belum mewakili warna produk asli.', 'Start with a color that feels like you. Explore soft or bold shades, then view bottle and swatch illustrations on the shade page. Screen colors do not represent actual product colors.')],
    [t('Apakah produk ini sudah bisa dibeli?', 'Can I purchase these products?'), t('Belum. Ini preview desain dengan empat shade dan harga contoh. Keranjang serta checkout hanya untuk mencoba alur; tidak membuat pesanan atau menerima pembayaran.', 'Not yet. This is a design preview with four sample shades and prices. The bag and checkout let you explore the flow; they do not create orders or accept payments.')],
    [t('Di mana informasi formula dan ketahanan?', 'Where can I find formula and wear information?'), t('Detail formula, volume, cara penggunaan, dan klaim ketahanan menunggu data resmi klien. Preview ini tidak membuat klaim performa atau sertifikasi produk.', 'Formula, volume, directions and wear claims await official client information. This preview makes no product performance or certification claims.')],
  ];
  function home() {
    main.innerHTML = `<section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">THE SOLPAĊI COLOR EDIT</p><h1 id="hero-title">${t('Sedikit warna.<br><em>Banyak cerita.</em>', 'A little color.<br><em>A lot of you.</em>')}</h1><p class="hero-description">${t('Dari lembut yang menemani hari, hingga berani yang mencuri perhatian. Temukan warna yang terasa seperti dirimu.', 'From soft shades for slow days to bold colors that make a moment. Find a shade that feels like you.')}</p>${link('shop', t('Jelajahi warna', 'Explore the shades'))}<p class="hero-footnote">${t('Sebuah ruang untuk warna & ekspresi diri.', 'A little space for color & self-expression.')}</p></div>
      <figure class="hero-art"><img src="images/editorial.svg" alt="${t('Ilustrasi dua botol kutek pink dan berry di atas bidang cream', 'Illustration of pink and berry polish bottles on a cream composition')}" width="720" height="760" fetchpriority="high"><span class="art-corner" aria-hidden="true">01 —<br>THE SOFT EDIT</span><figcaption>${t('STUDI KOMPOSISI / ILUSTRASI, BUKAN FOTO PRODUK', 'COMPOSITION STUDY / ILLUSTRATION, NOT PRODUCT PHOTOGRAPHY')}</figcaption></figure></section>
      <div class="editorial-strip"><span>YOUR SHADE. YOUR STORY.</span><span aria-hidden="true">✳</span><span>A LITTLE MOMENT OF COLOR.</span><span aria-hidden="true">✳</span><span>MAKE IT YOURS.</span></div>
      <section class="section" id="collection" aria-labelledby="collection-title"><div class="section-heading"><div><p class="eyebrow">${t('PALET PILIHAN / STUDI WARNA', 'THE COLOR EDIT / SAMPLE PALETTE')}</p><h2 id="collection-title">${t('Warna untuk<br><em>setiap sisi dirimu.</em>', 'A shade for<br><em>every side of you.</em>')}</h2></div><p>${t('Empat warna, banyak kemungkinan.<br>Mana yang terasa seperti kamu hari ini?', 'Four colors, endless possibilities.<br>Which one feels like you today?')}</p></div><div class="product-grid">${shades.map(card).join('')}</div><p class="catalog-note">${productNote}</p><div class="section-end">${link('shop', t('Lihat semua warna', 'Discover all shades'), true)}</div></section>
      ${storyBlock()}
      <section class="section faq-home" aria-labelledby="home-faq"><div><p class="eyebrow">A LITTLE CLARITY</p><h2 id="home-faq">${t('Sebelum memilih<br><em>warnamu.</em>', 'Before you find<br><em>your shade.</em>')}</h2><a class="text-link" href="${url('faq')}">${t('Semua pertanyaan', 'All your questions')}${arrow}</a></div><div>${commonFaq().map(entry => faqItem(...entry)).join('')}</div></section>`;
  }
  function storyBlock() {
    return `<section class="story" aria-labelledby="story-title"><figure class="story-art"><img src="images/swatch-01.svg" alt="${t('Studi swatch warna pink Petal', 'Petal pink swatch study')}" width="600" height="700" loading="lazy"><figcaption>${t('STUDI WARNA / ILUSTRASI DEMO', 'COLOR STUDY / DEMO ILLUSTRATION')}</figcaption></figure><div class="story-copy"><p class="eyebrow">THE LITTLE THINGS, IN COLOR</p><h2 id="story-title">${t('Bukan sekadar warna.<br><em>Sebuah cara bercerita.</em>', 'More than a color.<br><em>A way to tell your story.</em>')}</h2><p>${t('Ada hari untuk tampil lembut. Ada hari untuk sedikit lebih berani. Dalam cerita yang kami bayangkan untuk Solpaċi, warna menjadi detail kecil yang sepenuhnya milikmu.', 'Some days call for softness. Others, a little more boldness. In the story we imagine for Solpaċi, color is a small detail that is entirely yours.')}</p><a class="text-link" href="${url('about')}">${t('Kenali Solpaċi', 'Meet Solpaċi')}${arrow}</a><p class="caption">${t('Arah cerita brand — menunggu persetujuan klien.', 'Proposed brand narrative — awaiting client approval.')}</p></div></section>`;
  }
  function shop() {
    main.innerHTML = `${breadcrumb(t('Koleksi', 'Shop'))}${heading('FIND YOUR EVERYDAY COLOR', t('Temukan <em>warnamu.</em>', 'Find <em>your shade.</em>'), t('Dari lembut hingga berani. Mulai dari warna yang terasa dekat, atau coba sisi baru dirimu.', 'From soft to bold. Start with something familiar, or explore a new side of you.'))}
      <section class="section shop-section" aria-label="${t('Katalog demo', 'Demo catalog')}"><div class="shop-tools"><div class="filters" role="group" aria-label="${t('Keluarga warna', 'Color family')}">${[['all', t('Semua warna', 'All shades')], ['soft', t('Lembut', 'Soft')], ['bold', t('Berani', 'Bold')]].map(([id, title]) => `<button data-filter="${id}" aria-pressed="${id === 'all'}">${title}</button>`).join('')}</div><div class="shop-inputs"><label class="field" for="search">${t('Cari shade', 'Search shades')}<input type="search" id="search" placeholder="Petal, Berry…" maxlength="80"></label><label class="field" for="sort">${t('Urutkan', 'Sort by')}<select id="sort"><option value="edit">${t('Urutan koleksi', 'Collection order')}</option><option value="az">${t('Nama A–Z', 'Name A–Z')}</option><option value="za">${t('Nama Z–A', 'Name Z–A')}</option></select></label></div></div>
      <div class="results-line"><p id="result-count" role="status" aria-live="polite"></p><span>${t('SEMUA HARGA DEMO', 'ALL PRICES ARE DEMO')}</span></div><div id="product-grid" class="product-grid"></div><div class="empty-state" id="no-results" hidden><h2>${t('Belum menemukan warna?', 'No shades found?')}</h2><p>${t('Coba kata kunci lain atau lihat kembali seluruh palet.', 'Try a different search, or return to the full palette.')}</p><button class="button secondary" id="reset-filters">${t('Reset filter', 'Reset filters')}${arrow}</button></div><p class="catalog-note">${productNote}</p></section>`;
    let family = ['soft', 'bold'].includes(params.get('family')) ? params.get('family') : 'all';
    const search = document.querySelector('#search');
    const sort = document.querySelector('#sort');
    function render() {
      const query = search.value.trim().toLocaleLowerCase();
      let list = shades.filter(shade => (family === 'all' || shade.family === family) && `${shade.name} ${text(shade.label)}`.toLocaleLowerCase().includes(query));
      if (sort.value !== 'edit') list = [...list].sort((a, b) => a.name.localeCompare(b.name) * (sort.value === 'za' ? -1 : 1));
      document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === family)));
      document.querySelector('#product-grid').innerHTML = list.map(card).join('');
      document.querySelector('#no-results').hidden = list.length !== 0;
      document.querySelector('#result-count').textContent = `${list.length} ${t('shade contoh', 'sample shades')}`;
    }
    document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { family = button.dataset.filter; render(); }));
    search.addEventListener('input', render);
    sort.addEventListener('change', render);
    document.querySelector('#reset-filters').addEventListener('click', () => { family = 'all'; search.value = ''; sort.value = 'edit'; render(); search.focus(); });
    render();
  }
  function product() {
    const shade = find(params.get('shade') || '01');
    if (!shade) {
      main.innerHTML = `${breadcrumb(t('Shade tidak ditemukan', 'Shade not found'))}<section class="section"><div class="empty-state"><h1>${t('Warna belum ditemukan.', 'Shade not found.')}</h1><p>${t('Tautan shade ini tidak ada dalam katalog demo.', 'This shade link is not in the demo catalog.')}</p>${link('shop', t('Kembali ke koleksi', 'Back to the shades'))}</div></section>`;
      return;
    }
    document.title = `${shade.name} — Solpaċi / Soft Editorial`;
    let qty = 1;
    main.innerHTML = `${breadcrumb(shade.name)}<section class="section product-detail"><div class="gallery"><div class="gallery-stage" style="--tile:${shade.tile}"><img id="product-art" src="images/shade-${shade.id}.svg" alt="${t('Ilustrasi botol', 'Bottle illustration')}: ${shade.name}" width="600" height="700"><span class="caption">${t('ILUSTRASI / BUKAN FOTO PRODUK', 'ILLUSTRATION / NOT A PRODUCT PHOTO')}</span></div><div class="gallery-controls" role="group" aria-label="${t('Tampilan ilustrasi', 'Illustration view')}"><button data-view="shade" aria-pressed="true">${t('Botol', 'Bottle')}</button><button data-view="swatch" aria-pressed="false">Swatch</button></div></div>
      <div class="detail-copy"><p class="eyebrow">THE COLOR EDIT / ${shade.id}</p><h1>${shade.name}</h1><p class="muted">${text(shade.label)} · ${t('Studi warna', 'Color study')}</p><p class="price">${money(shade.price)}<small>${t('harga contoh', 'sample price')}</small></p><p class="description">${text(shade.description)}</p><p class="eyebrow">${t('PILIH WARNA', 'CHOOSE A SHADE')}</p><div class="shade-links">${shades.map(item => `<a href="${url('product', { shade: item.id })}" aria-label="${item.name}"${item.id === shade.id ? ' aria-current="page"' : ''}><span class="swatch-dot" style="--shade:${item.color}" aria-hidden="true"></span></a>`).join('')}</div>
      <div class="purchase-controls"><div class="quantity" role="group" aria-label="${t('Jumlah produk', 'Product quantity')}"><button id="qty-minus" aria-label="${t('Kurangi jumlah', 'Decrease quantity')}" disabled>−</button><output id="quantity" aria-live="polite">1</output><button id="qty-plus" aria-label="${t('Tambah jumlah', 'Increase quantity')}">+</button></div><button class="button" id="add-product">${t('Tambah ke keranjang', 'Add to demo bag')}${arrow}</button></div><p class="small">${t('Simulasi saja · maksimal 10 per shade · tanpa transaksi.', 'Simulation only · maximum 10 per shade · no transactions.')}</p><a class="text-link" href="${url('cart')}">${t('Lihat keranjang', 'View your bag')}${arrow}</a>
      ${faqItem(t('Catatan warna & produk', 'Color & product notes'), productNote)}${faqItem(t('Formula & cara penggunaan', 'Formula & directions'), t('Komposisi, volume, petunjuk penggunaan, dan klaim produk akan diisi setelah data resmi diterima. Tidak ada klaim formula pada preview ini.', 'Ingredients, volume, directions and product claims will be added after official information is received. This preview makes no formula claims.'))}${faqItem(t('Pengiriman & pengembalian', 'Shipping & returns'), t('Tarif, estimasi pengiriman, dan kebijakan pengembalian belum ditetapkan. Checkout hanya menampilkan pilihan simulasi.', 'Shipping rates, delivery estimates and returns policies are not yet defined. Checkout only shows simulated options.'))}</div></section>
      <section class="section related"><div class="section-heading"><div><p class="eyebrow">ANOTHER SIDE OF YOU</p><h2>${t('Kenali warna <em>lainnya.</em>', 'Meet the <em>other shades.</em>')}</h2></div></div><div class="product-grid">${shades.filter(item => item.id !== shade.id).map(card).join('')}</div></section>`;
    document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
      const image = document.querySelector('#product-art');
      image.src = `images/${button.dataset.view}-${shade.id}.svg`;
      image.alt = `${button.dataset.view === 'shade' ? t('Ilustrasi botol', 'Bottle illustration') : t('Ilustrasi swatch', 'Swatch illustration')}: ${shade.name}`;
    }));
    function change(delta) {
      qty = Math.max(1, Math.min(10, qty + delta));
      document.querySelector('#quantity').textContent = qty;
      document.querySelector('#qty-minus').disabled = qty === 1;
      document.querySelector('#qty-plus').disabled = qty === 10;
    }
    document.querySelector('#qty-minus').addEventListener('click', () => change(-1));
    document.querySelector('#qty-plus').addEventListener('click', () => change(1));
    document.querySelector('#add-product').addEventListener('click', () => add(shade.id, qty));
  }
  function emptyBag() {
    return `<section class="section"><div class="empty-state"><p class="eyebrow">A LITTLE ROOM FOR COLOR</p><h2>${t('Warnamu belum ada di sini.', 'Your shades are waiting.')}</h2><p>${t('Keranjang demo masih kosong. Temukan warna yang ingin kamu coba, lalu kembali ke sini.', 'Your demo bag is empty. Find a shade you would like to try, then come back here.')}</p>${link('shop', t('Jelajahi warna', 'Explore the shades'))}</div></section>`;
  }
  function summary(checkout = false) {
    return `<aside class="order-summary" aria-labelledby="summary-title"><h2 id="summary-title">${t('Ringkasan pilihanmu', 'Your color edit')}</h2>${checkout ? cart.map(item => `<div class="summary-row"><span>${find(item.id).name} × ${item.qty}</span><span>${money(find(item.id).price * item.qty)}</span></div>`).join('') : ''}<div class="summary-row"><span>Subtotal (${count()} ${t('item', 'items')})</span><span>${money(total())}</span></div><div class="summary-row"><span>${t('Pengiriman', 'Shipping')}</span><span>${t('Belum dihitung', 'Not calculated')}</span></div><div class="summary-row"><span>${t('Pajak / biaya lainnya', 'Tax / other fees')}</span><span>${t('Belum ditetapkan', 'Not defined')}</span></div><div class="summary-row summary-total"><span>${t('Subtotal demo', 'Demo subtotal')}</span><strong>${money(total())}</strong></div>${!checkout ? `<a class="button wide" href="${url('checkout')}">${t('Coba checkout', 'Try checkout')}${arrow}</a>` : ''}<p class="small">${t('Hanya harga produk contoh, bukan total yang harus dibayar. Ongkir, pajak, dan biaya lain belum dihitung. Tidak ada transaksi nyata.', 'Sample product prices only, not an amount due. Shipping, tax and other fees are not calculated. No real transaction takes place.')}</p></aside>`;
  }
  function cartPage(focus = null) {
    main.innerHTML = `${breadcrumb(t('Keranjang', 'Your bag'))}${heading('YOUR LITTLE COLOR EDIT', t('Pilihan <em>warnamu.</em>', 'A bag full of <em>you.</em>'), t('Simpan yang kamu suka. Coba alurnya, tanpa melakukan pembelian.', 'Keep the shades you love. Explore the flow, without making a purchase.'))}${cart.length ? `<section class="section commerce-layout"><div><div id="cart-items">${cart.map(item => {
      const shade = find(item.id);
      return `<article class="cart-item"><a href="${url('product', { shade: shade.id })}"><img src="images/shade-${shade.id}.svg" alt="${t('Ilustrasi', 'Illustration')}: ${shade.name}" width="600" height="700"></a><div><h2><a href="${url('product', { shade: shade.id })}">${shade.name}</a></h2><p class="small">${text(shade.label)} · ${money(shade.price)}</p><div class="cart-controls"><div class="quantity" role="group" aria-label="${t('Jumlah', 'Quantity')} ${shade.name}"><button data-change="-1" data-id="${shade.id}" aria-label="${t('Kurangi', 'Decrease')} ${shade.name}"${item.qty === 1 ? ' disabled' : ''}>−</button><output aria-label="${t('Jumlah', 'Quantity')} ${shade.name}">${item.qty}</output><button data-change="1" data-id="${shade.id}" aria-label="${t('Tambah', 'Increase')} ${shade.name}"${item.qty === 10 ? ' disabled' : ''}>+</button></div><button class="remove" data-remove="${shade.id}" aria-label="${t('Hapus', 'Remove')} ${shade.name}">${t('Hapus', 'Remove')}</button></div></div><p class="line-total">${money(shade.price * item.qty)}</p></article>`;
    }).join('')}</div><a class="text-link" href="${url('shop')}">← ${t('Kembali memilih warna', 'Keep exploring')}</a><p class="small">${t('Maksimal 10 item per shade. Keranjang disimpan lokal di browser jika tersedia.', 'Maximum 10 items per shade. Your bag is saved locally in this browser when available.')}</p></div>${summary()}</section>` : emptyBag()}`;
    document.querySelectorAll('[data-change]').forEach(button => button.addEventListener('click', () => {
      const item = cart.find(entry => entry.id === button.dataset.id);
      item.qty = Math.max(1, Math.min(10, item.qty + Number(button.dataset.change)));
      save();
      cartPage({ id: item.id, delta: button.dataset.change });
      announce(`${find(item.id).name}: ${item.qty}. ${t('Subtotal demo', 'Demo subtotal')}: ${money(total())}`);
    }));
    document.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => {
      const name = find(button.dataset.remove).name;
      cart = cart.filter(item => item.id !== button.dataset.remove);
      save();
      cartPage();
      const target = document.querySelector('[data-remove]') || main;
      target.focus({ preventScroll: true });
      announce(`${name} ${t('dihapus dari keranjang.', 'removed from your bag.')}`);
    }));
    if (focus) {
      const target = document.querySelector(`[data-id="${focus.id}"][data-change="${focus.delta}"]:not(:disabled)`) || document.querySelector(`[data-id="${focus.id}"]:not(:disabled)`);
      if (target) target.focus({ preventScroll: true });
    }
  }
  function checkout() {
    main.innerHTML = `${breadcrumb(t('Checkout simulasi', 'Demo checkout'))}${heading('ONE MORE LITTLE STEP', t('Coba alur <em>checkout.</em>', 'One more <em>little step.</em>'), t('Ini simulasi. Gunakan data contoh yang tersedia — jangan masukkan data pribadi.', 'This is a simulation. Use the provided sample details — do not enter personal information.'))}`;
    if (!cart.length) { main.insertAdjacentHTML('beforeend', emptyBag()); return; }
    main.insertAdjacentHTML('beforeend', `<section class="section commerce-layout"><form class="checkout-form" id="checkout-form"><fieldset><legend><span>01</span>${t('Detail contoh', 'Sample details')}</legend><p class="small">${t('Kolom dikunci untuk menjaga privasi. Tidak ada data yang dikirim ke server.', 'Fields are locked for privacy. No information is sent to a server.')}</p><div class="form-grid"><label class="field">${t('Nama contoh', 'Sample name')}<input value="${t('Pengunjung Demo', 'Demo Visitor')}" readonly autocomplete="off"></label><label class="field">${t('Email contoh', 'Sample email')}<input type="email" value="demo@example.invalid" readonly autocomplete="off"></label><label class="field full">${t('Alamat contoh', 'Sample address')}<input value="${t('Alamat ilustratif — bukan tujuan pengiriman', 'Illustrative address — not a delivery destination')}" readonly autocomplete="off"></label><label class="field">${t('Kota contoh', 'Sample city')}<input value="Jakarta (demo)" readonly autocomplete="off"></label><label class="field">${t('Kode pos contoh', 'Sample postal code')}<input value="00000" readonly autocomplete="off"></label></div></fieldset>
      <fieldset><legend><span>02</span>${t('Pilihan pengiriman', 'Shipping options')}</legend><label class="choice"><input type="radio" name="shipping" value="standard" checked><span>${t('Reguler — simulasi', 'Standard — simulated')}<small>${t('Tarif dan estimasi belum tersedia.', 'Rates and delivery estimates are not available.')}</small></span></label><label class="choice"><input type="radio" name="shipping" value="express"><span>${t('Ekspres — simulasi', 'Express — simulated')}<small>${t('Bukan layanan kurir yang sudah terhubung.', 'Not a connected courier service.')}</small></span></label></fieldset>
      <fieldset><legend><span>03</span>${t('Pilihan pembayaran', 'Payment options')}</legend><label class="choice"><input type="radio" name="payment" value="va" checked><span>Virtual Account <small>${t('Contoh tampilan — tanpa nomor rekening.', 'Visual sample — no bank account number.')}</small></span></label><label class="choice"><input type="radio" name="payment" value="qris"><span>QRIS <small>${t('Contoh tampilan — tidak membuat kode pembayaran.', 'Visual sample — no payment code is generated.')}</small></span></label></fieldset>
      <aside class="demo-note"><strong>${t('Tidak ada pesanan atau pembayaran nyata.', 'No real order or payment.')}</strong><p>${t('Tombol berikut hanya menampilkan layar konfirmasi. Keranjang demo tidak dikosongkan. Tidak terhubung ke payment gateway atau layanan pengiriman.', 'The button below only displays a confirmation screen. Your demo bag will not be cleared. No payment gateway or shipping service is connected.')}</p></aside><label class="consent"><input id="demo-consent" type="checkbox" required><span>${t('Saya memahami bahwa ini simulasi desain, bukan pembelian produk.', 'I understand this is a design simulation, not a product purchase.')}</span></label><button class="button wide" type="submit">${t('Selesaikan simulasi', 'Complete simulation')}${arrow}</button></form>${summary(true)}</section>`);
    document.querySelector('#checkout-form').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const payment = new FormData(form).get('payment') === 'qris' ? 'QRIS' : 'Virtual Account';
      const shipping = new FormData(form).get('shipping') === 'express' ? t('Ekspres', 'Express') : t('Reguler', 'Standard');
      main.innerHTML = `<section class="section success"><div class="success-mark" aria-hidden="true">✓</div><p class="eyebrow">PREVIEW COMPLETE / NO ORDER CREATED</p><h1>${t('Sedikit warna.<br><em>Sampai jumpa lagi.</em>', 'A little color.<br><em>See you again.</em>')}</h1><p>${t('Alur simulasi selesai. Tidak ada pesanan yang dibuat dan tidak ada pembayaran yang diproses.', 'Your simulation is complete. No order was created and no payment was processed.')}</p><div class="demo-note"><p><strong>${t('Ringkasan simulasi', 'Simulation summary')}</strong></p><p>${count()} ${t('item', 'items')} · ${t('Subtotal produk contoh', 'Sample product subtotal')}: ${money(total())}</p><p>${shipping} · ${payment} (${t('pilihan demo saja', 'demo choices only')})</p><p>${t('Keranjang tetap tersimpan. Detail contoh tidak dikirim atau disimpan.', 'Your bag is kept. Sample details are neither submitted nor stored.')}</p></div>${link('shop', t('Kembali ke warna', 'Back to the shades'))}</section>`;
      main.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
      announce(t('Simulasi selesai. Tidak ada pesanan dibuat.', 'Simulation complete. No order created.'));
    });
  }
  function about() {
    main.innerHTML = `${breadcrumb(t('Cerita kami', 'Our story'))}<div class="about-intro">${heading('A LITTLE COLOR, ALL YOURS', t('Cerita kecil.<br><em>Sepenuhnya dirimu.</em>', 'Little stories.<br><em>Entirely yours.</em>'), t('Kami membayangkan Solpaċi sebagai ruang untuk merayakan detail kecil. Warna bukan aturan — melainkan pilihan yang terasa personal.', 'We imagine Solpaċi as a space to celebrate little details. Color is not a rule — it is a choice that feels personal.'))}</div>${storyBlock()}<section class="section brand-values" aria-label="${t('Arah cerita brand', 'Proposed brand values')}"><article><p class="eyebrow">01 / YOUR EVERYDAY</p><h3>${t('Untuk hari biasa.', 'For ordinary days.')}</h3><p>${t('Tak perlu menunggu momen besar untuk memilih warna. Detail sederhana pun bisa menjadi bagian dari ceritamu.', 'You do not need a grand occasion to choose a color. Even a simple detail can become part of your story.')}</p></article><article><p class="eyebrow">02 / YOUR EXPRESSION</p><h3>${t('Dengan caramu.', 'On your own terms.')}</h3><p>${t('Lembut hari ini, berani esok hari. Tak ada satu palet yang harus mendefinisikan siapa dirimu.', 'Soft today, bold tomorrow. No single palette needs to define who you are.')}</p></article><article><p class="eyebrow">03 / YOUR LITTLE RITUAL</p><h3>${t('Ruang untuk diri.', 'A moment for yourself.')}</h3><p>${t('Memilih warna bisa menjadi jeda kecil. Sebuah kesempatan untuk melihat apa yang kamu sukai saat ini.', 'Choosing a color can be a little pause. A chance to notice what you are drawn to right now.')}</p></article></section><section class="section editorial-quote"><p class="eyebrow">YOUR SHADE. YOUR STORY.</p><h2>${t('Tak harus selalu sama.<br><em>Cukup terasa seperti kamu.</em>', 'You do not have to stay the same.<br><em>Just feel like yourself.</em>')}</h2>${link('shop', t('Temukan warnamu', 'Find your shade'))}</section><section class="section"><aside class="demo-note"><strong>${t('Catatan cerita brand', 'Brand narrative note')}</strong><p>${t('Seluruh narasi di halaman ini adalah usulan copy untuk review. Bukan sejarah perusahaan, pernyataan pendiri, atau klaim produk yang telah dikonfirmasi. Logo dan fotografi final menunggu aset klien.', 'All narrative on this page is proposed copy for review. It is not confirmed company history, a founder statement or a product claim. Final logo and photography await client assets.')}</p></aside></section>`;
    const storyLink = main.querySelector('.story .text-link');
    storyLink.href = url('shop');
    storyLink.innerHTML = `${t('Jelajahi warna Solpaċi', 'Explore Solpaċi shades')}${arrow}`;
  }
  function faq() {
    const groups = [
      ['colors', t('Warna & produk', 'Colors & products'), commonFaq()],
      ['shopping', t('Belanja & pengiriman', 'Shopping & shipping'), [
        [t('Bagaimana cara mencoba checkout?', 'How do I try checkout?'), t('Tambahkan shade contoh ke keranjang, lalu pilih Coba checkout. Detail pelanggan sudah berisi data rekaan dan tidak dapat diedit. Pilih opsi demo, centang persetujuan simulasi, dan lihat layar konfirmasi.', 'Add a sample shade to your bag and choose Try checkout. Customer details use locked fictional data. Select demo options, acknowledge the simulation and view the confirmation screen.')],
        [t('Apakah ongkir sudah termasuk?', 'Is shipping included?'), t('Tidak. Jumlah yang ditampilkan hanya subtotal produk contoh. Ongkir, pajak, dan biaya lain belum dihitung. Tidak ada janji tarif atau waktu pengiriman.', 'No. The displayed amount is only a sample product subtotal. Shipping, taxes and other fees are not calculated. No rates or delivery times are promised.')],
        [t('Apa kebijakan pengembalian produk?', 'What is the returns policy?'), t('Kebijakan pengembalian, batas waktu, bukti yang dibutuhkan, serta kontak bantuan menunggu persetujuan klien. Preview ini tidak menetapkan kebijakan toko.', 'Returns conditions, time limits, required evidence and support contacts await client approval. This preview does not establish store policies.')],
      ]],
      ['preview', t('Preview & privasi', 'Preview & privacy'), [
        [t('Data apa yang disimpan?', 'What information is stored?'), t('Hanya ID shade, jumlah item, dan pilihan bahasa yang disimpan lokal di browser jika tersedia. Tidak ada data pribadi yang diminta atau dikirim. Pilihan form checkout tidak disimpan. Data lokal bisa dihapus melalui pengaturan browser; keranjang juga bisa dikosongkan dengan menghapus semua item.', 'Only shade IDs, quantities and your language preference are saved locally in this browser when available. No personal information is requested or transmitted. Checkout form choices are not saved. Clear local data in browser settings; you can also empty your bag by removing all items.')],
        [t('Mengapa keranjang tidak tersimpan?', 'Why is my bag not saved?'), t('Browser dapat membatasi penyimpanan pada file lokal atau mode privat. Jika muncul peringatan penyimpanan, gunakan preview melalui server lokal. Dukungan file lokal berbeda antarbrowser.', 'Browsers may restrict storage for local files or private browsing. If you see a storage warning, open the preview through a local server. Local-file support varies between browsers.')],
        [t('Apakah ini toko WordPress final?', 'Is this the final WordPress store?'), t('Belum. Ini preview HTML, CSS, dan JavaScript mandiri. Implementasi produksi tetap WordPress/WooCommerce; bilingual, pembayaran, dan pengiriman perlu dibangun serta diuji terpisah.', 'Not yet. This is a standalone HTML, CSS and JavaScript preview. Production remains WordPress/WooCommerce; bilingual content, payments and shipping need separate implementation and testing.')],
      ]],
    ];
    main.innerHTML = `${breadcrumb('FAQ')}${heading('A LITTLE CLARITY', t('Ada <em>pertanyaan?</em>', 'A little <em>clarity.</em>'), t('Tentang warna, alur belanja, dan hal-hal yang masih berupa contoh.', 'About colors, the shopping flow, and what is still a sample.'))}<section class="section faq-layout"><nav class="faq-nav" aria-label="${t('Topik FAQ', 'FAQ topics')}">${groups.map(([id, title], i) => `<a href="#${id}"><span>0${i + 1}</span>${title} ↘</a>`).join('')}</nav><div>${groups.map(([id, title, entries], i) => `<section class="faq-group" id="${id}" aria-labelledby="${id}-title"><p class="eyebrow">0${i + 1} / GOOD TO KNOW</p><h2 id="${id}-title">${title}</h2>${entries.map(entry => faqItem(...entry)).join('')}</section>`).join('')}<aside class="demo-note"><strong>${t('Kontak bantuan menyusul.', 'Support details to follow.')}</strong><p>${t('Kontak resmi akan ditambahkan setelah diterima dari klien. Tidak ada nomor, email layanan, atau tautan WhatsApp rekaan.', 'Official support contacts will be added when supplied by the client. No invented phone numbers, support emails or WhatsApp links are used.')}</p></aside></div></section>`;
  }
  shell();
  // Lenis smooth scroll + sticky header backdrop toggle.
  (function () {
    const s = document.createElement('script');
    s.src = 'lenis.min.js';
    s.async = true;
    s.onload = () => {
      // Lenis untuk scrollTo saja (smooth anchor jumps); wheel pakai native.
      // Quizabl pakai duration:1.2 + easing juga terasa lambat di wheel burst.
      const lenis = new Lenis({
        duration: 0.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: false,
      });
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      // Toggle backdrop class pada .site-header via native scroll (Lenis wheel
      // tidak fire scroll event kalau smoothWheel:false).
      const header = document.querySelector('.site-header');
      if (header) {
        const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
        window.addEventListener('scroll', update, { passive: true });
        update();
      }
    };
    document.head.appendChild(s);
  })();
  ({ home, shop, product, cart: cartPage, checkout, about, faq }[page] || home)();
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-add]');
    if (button) add(button.dataset.add);
  });
  document.querySelector('#language-switch').addEventListener('click', () => {
    const nextLang = lang === 'id' ? 'en' : 'id';
    write(LANG_KEY, nextLang);
    const next = new URL(location.href);
    next.searchParams.set('lang', nextLang);
    location.href = next.href;
  });
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    menu.querySelector('span').textContent = '+';
    nav.classList.remove('is-open');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.querySelector('span').textContent = open ? '−' : '+';
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menu.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
  window.addEventListener('storage', event => {
    if (event.key !== CART_KEY && event.key !== null) return;
    try { cart = normalize(JSON.parse(read(CART_KEY) || '[]')); } catch { cart = []; }
    updateCount();
    if (page === 'cart') cartPage();
    if (page === 'checkout') checkout();
  });
  if (location.hash) {
    const anchor = document.getElementById(location.hash.slice(1));
    if (anchor) requestAnimationFrame(() => anchor.scrollIntoView());
  }
})();