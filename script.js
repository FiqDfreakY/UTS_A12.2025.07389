'use strict';
document.documentElement.classList.add('js');
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Tema gelap/terang ===== */
const themeBtn = $('#themeBtn');
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  document.documentElement.dataset.bsTheme = t;
  themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
  const sun = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const moon = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  themeBtn.innerHTML = t === 'dark' ? sun : moon;
  themeBtn.setAttribute('aria-label', t === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap');
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () =>
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

/* ===== Menu mobile ===== */
const menuBtn = $('#menuBtn'), nav = $('#nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

/* ===== Progress scroll + tombol ke atas ===== */
const bar = $('#progress'), toTop = $('#toTop');
function onScroll() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  toTop.classList.toggle('show', h.scrollTop > 600);
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

/* ===== Link nav aktif + efek muncul ===== */
const links = $$('#nav a[href^="#"]');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      links.forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => secObs.observe(s));


/* ===== Slider sangrai ===== */
const roasts = [
  { name: 'Terang',        bg: '#c9a27a', fg: '#1d1a18', notes: 'Floral, jeruk, teh',                acid: 'Tinggi',        body: 'Ringan' },
  { name: 'Medium terang', bg: '#b07f55', fg: '#ffffff', notes: 'Buah manis, madu, karamel tipis',   acid: 'Sedang-tinggi', body: 'Ringan-sedang' },
  { name: 'Medium',        bg: '#8a5a38', fg: '#ffffff', notes: 'Karamel, kacang, cokelat susu',     acid: 'Sedang',        body: 'Sedang' },
  { name: 'Medium gelap',  bg: '#5a3724', fg: '#ffffff', notes: 'Cokelat pekat, rempah, gula bakar', acid: 'Rendah',        body: 'Tebal' },
  { name: 'Gelap',         bg: '#2b1810', fg: '#ffffff', notes: 'Pahit, smoky, arang',               acid: 'Sangat rendah', body: 'Sangat tebal' }
];
const lv = [[90, 25, 10], [75, 40, 22], [55, 55, 38], [35, 75, 62], [15, 90, 90]];
const bitter = ['Hampir tidak ada', 'Tipis', 'Sedang', 'Jelas', 'Dominan'];
const roast = $('#roast');
function updateRoast() {
  const r = roasts[Number(roast.value)];
  const st = document.documentElement.style;
  st.setProperty('--roast-bg', r.bg);
  st.setProperty('--roast-fg', r.fg);
  $('#roastName').textContent = r.name;
  $('#roastNotes').textContent = r.notes;
  $('#roastAcid').textContent = r.acid;
  $('#roastBody').textContent = r.body;
  const i = Number(roast.value);
  $('#roastBitter').textContent = bitter[i];
  ['Acid', 'Body', 'Bitter'].forEach((n, k) => $('#roast' + n).style.setProperty('--lv', lv[i][k] + '%'));
}
roast.addEventListener('input', updateRoast);
updateRoast();

/* ===== Data kopi nusantara =====
   Foto: taruh di folder resource/ dengan nama sesuai properti "foto".
   Kalau file belum ada, otomatis tampil ilustrasi SVG. */
const FOTO_DIR = 'resource/'; // ganti kalau foldermu beda, mis. 'assets/images/'
const kopi = [
  { id: 'gayo', nama: 'Gayo', daerah: 'Dataran Tinggi Gayo, Aceh', region: 'Sumatra', jenis: 'Arabika', tinggi: 'Sekitar 1.200-1.600 mdpl', rasa: 'Body tebal, asam rendah, aroma rempah dan herbal.', cerita: 'Ditanam petani kecil di sekitar Takengon dan Bener Meriah. Cocok buat yang tidak suka kopi terlalu asam.', profil: 'earthy', proses: 'Giling basah', notes: ['Rempah', 'Herbal', 'Cokelat'], seduh: 'French press atau V60', fakta: 'Termasuk kopi Indonesia yang punya indikasi geografis.', foto: FOTO_DIR + 'gayo.jpg' },
  { id: 'mandailing', nama: 'Mandailing', daerah: 'Tapanuli, Sumatra Utara', region: 'Sumatra', jenis: 'Arabika', tinggi: 'Sekitar 1.000-1.500 mdpl', rasa: 'Earthy, cokelat, body tebal, asam rendah.', cerita: 'Kopi Sumatra klasik yang sering diproses giling basah, hasilnya rasa yang dalam dan bulat.', profil: 'earthy', proses: 'Giling basah', notes: ['Earthy', 'Cokelat', 'Tembakau'], seduh: 'French press atau tubruk', fakta: 'Cocok jadi dasar kopi susu karena body-nya kuat.', foto: FOTO_DIR + 'mandailing.jpg' },
  { id: 'lampung', nama: 'Robusta Lampung', daerah: 'Lampung', region: 'Sumatra', jenis: 'Robusta', tinggi: 'Dataran rendah-menengah', rasa: 'Pahit tegas, body tebal, aroma cokelat gelap.', cerita: 'Lampung salah satu sentra robusta terbesar di Indonesia, sering jadi dasar kopi tubruk dan campuran espresso.', profil: 'bold', proses: 'Natural (kering)', notes: ['Pahit', 'Cokelat gelap', 'Kacang'], seduh: 'Tubruk atau espresso', fakta: 'Kafeinnya hampir dua kali lipat arabika.', foto: FOTO_DIR + 'lampung.jpg' },
  { id: 'meranti', nama: 'Liberika Meranti', daerah: 'Kepulauan Meranti, Riau', region: 'Sumatra', jenis: 'Liberika', tinggi: 'Lahan gambut dataran rendah', rasa: 'Aroma nangka, smoky, sedikit herbal.', cerita: 'Liberika tumbuh baik di lahan gambut dan punya karakter unik yang beda dari arabika.', profil: 'bold', proses: 'Bervariasi', notes: ['Nangka', 'Smoky', 'Herbal'], seduh: 'Tubruk atau V60', fakta: 'Bijinya lebih besar dan bentuknya agak tidak simetris.', foto: FOTO_DIR + 'meranti.jpg' },
  { id: 'java', nama: 'Java Preanger', daerah: 'Jawa Barat', region: 'Jawa', jenis: 'Arabika', tinggi: 'Sekitar 1.000-1.600 mdpl', rasa: 'Bersih, manis, cokelat dan sedikit rempah.', cerita: 'Kopi dari Jawa punya sejarah panjang sejak masa kolonial, sampai kata "java" identik dengan kopi.', profil: 'sweet', proses: 'Basah penuh', notes: ['Manis', 'Cokelat', 'Rempah tipis'], seduh: 'V60 atau espresso', fakta: 'Salah satu kopi tertua yang dikenal di perdagangan dunia.', foto: FOTO_DIR + 'java.jpg' },
  { id: 'ijen', nama: 'Ijen', daerah: 'Bondowoso, Jawa Timur', region: 'Jawa', jenis: 'Arabika', tinggi: 'Sekitar 900-1.600 mdpl', rasa: 'Manis, karamel, sedikit buah dan floral.', cerita: 'Tumbuh di lereng kawasan Ijen yang dingin dan subur, cocok diseduh pour over.', profil: 'sweet', proses: 'Basah dan natural', notes: ['Karamel', 'Buah', 'Floral'], seduh: 'V60', fakta: 'Tumbuh di sekitar kawasan gunung api aktif yang tanahnya subur.', foto: FOTO_DIR + 'ijen.jpg' },
  { id: 'kintamani', nama: 'Kintamani', daerah: 'Kintamani, Bali', region: 'Bali & Nusa Tenggara', jenis: 'Arabika', tinggi: 'Sekitar 1.000-1.600 mdpl', rasa: 'Asam segar seperti jeruk, buah, body ringan-sedang.', cerita: 'Ditanam bareng jeruk di kebun yang dikelola sistem subak abian, dan punya indikasi geografis.', profil: 'fruity', proses: 'Basah penuh', notes: ['Jeruk', 'Buah', 'Segar'], seduh: 'V60 atau aeropress', fakta: 'Ditanam berdampingan dengan pohon jeruk di kebun yang sama.', foto: FOTO_DIR + 'kintamani.jpg' },
  { id: 'bajawa', nama: 'Flores Bajawa', daerah: 'Ngada, Flores', region: 'Bali & Nusa Tenggara', jenis: 'Arabika', tinggi: 'Sekitar 1.200-1.550 mdpl', rasa: 'Manis, cokelat, nutty, sedikit floral.', cerita: 'Tumbuh di tanah vulkanik sekitar Gunung Inerie, rasanya seimbang dan mudah disukai.', profil: 'sweet', proses: 'Basah dan natural', notes: ['Manis', 'Kacang', 'Floral'], seduh: 'V60 atau French press', fakta: 'Rasanya seimbang, jadi sering dipakai buat pemula.', foto: FOTO_DIR + 'bajawa.jpg' },
  { id: 'toraja', nama: 'Toraja', daerah: 'Tana Toraja, Sulawesi Selatan', region: 'Sulawesi', jenis: 'Arabika', tinggi: 'Sekitar 1.400-1.800 mdpl', rasa: 'Rempah, cokelat, body tebal, asam lembut.', cerita: 'Kopi dataran tinggi Toraja dikenal bersih dan kompleks, sering dicari pasar internasional.', profil: 'earthy', proses: 'Giling basah', notes: ['Rempah', 'Cokelat', 'Body tebal'], seduh: 'French press atau espresso', fakta: 'Salah satu kopi Indonesia yang paling dikenal di luar negeri.', foto: FOTO_DIR + 'toraja.jpg' },
  { id: 'wamena', nama: 'Wamena', daerah: 'Lembah Baliem, Papua', region: 'Papua', jenis: 'Arabika', tinggi: 'Sekitar 1.500-2.000 mdpl', rasa: 'Bersih, manis, asam lembut, aroma buah.', cerita: 'Ditanam di lembah tinggi oleh petani lokal dengan pemupukan yang relatif minim.', profil: 'fruity', proses: 'Basah penuh', notes: ['Bersih', 'Manis', 'Buah'], seduh: 'V60', fakta: 'Banyak dikelola petani kecil di dataran tinggi pedalaman.', foto: FOTO_DIR + 'wamena.jpg' }
];
const regions = ['Semua', ...new Set(kopi.map(k => k.region))];
const byId = id => kopi.find(k => k.id === id);

/* ===== Foto + fallback ilustrasi ===== */
const warna = { fruity: '#e4b363', sweet: '#d79a6a', earthy: '#8fa68a', bold: '#9aa7b8' };
function art(k) {
  return `<svg viewBox="0 0 200 125" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustrasi biji kopi ${k.nama}">
    <rect width="200" height="125" fill="${warna[k.profil]}"/>
    <g transform="translate(78 66) rotate(-28)"><ellipse rx="34" ry="22" fill="#3b2216"/><path d="M-30 2 Q0 -14 30 2" stroke="${warna[k.profil]}" stroke-width="4" fill="none"/></g>
    <g transform="translate(130 72) rotate(24)"><ellipse rx="28" ry="18" fill="#4d2e1c"/><path d="M-24 2 Q0 -11 24 2" stroke="${warna[k.profil]}" stroke-width="3.5" fill="none"/></g>
  </svg>`;
}
const foto = k => `<figure class="photo"><img src="${k.foto}" alt="Biji dan seduhan kopi ${k.nama}" loading="lazy" width="800" height="600" data-id="${k.id}"></figure>`;
document.addEventListener('error', e => {
  const t = e.target;
  if (t.tagName === 'IMG' && t.dataset.id) {
    const w = document.createElement('div');
    w.className = 'ph';
    w.innerHTML = art(byId(t.dataset.id));
    t.replaceWith(w);
  }
}, true);

/* ===== Slider kopi: geser kiri-kanan ===== */
const grid = $('#kopiGrid'), chipsBox = $('#chips');
const prevBtn = $('#prevBtn'), nextBtn = $('#nextBtn'), sBar = $('#sBar');
let region = 'Semua', query = '';
let favs;
try { favs = new Set(JSON.parse(localStorage.getItem('favs') || '[]')); } catch (e) { favs = new Set(); }
const saveFavs = () => { try { localStorage.setItem('favs', JSON.stringify([...favs])); } catch (e) {} };
const toastEl = document.createElement('div');
toastEl.className = 'kp-toast'; toastEl.setAttribute('role', 'status');
document.body.append(toastEl);
let toastT;
function toast(msg) {
  toastEl.textContent = msg; toastEl.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 1800);
}

function stepWidth() {
  const card = $('.kcard', grid);
  if (!card) return 0;
  return card.offsetWidth + (parseFloat(getComputedStyle(grid).columnGap) || 0);
}
function updateSlider() {
  const max = grid.scrollWidth - grid.clientWidth;
  prevBtn.disabled = grid.scrollLeft <= 2;
  nextBtn.disabled = grid.scrollLeft >= max - 2;
  sBar.style.width = (max > 0 ? Math.min(100, (grid.scrollLeft / max) * 100) : 100) + '%';
  const total = $$('.kcard', grid).length;
  const step = stepWidth();
  if (!total || !step) { $('#slideInfo').textContent = ''; return; }
  if (max <= 2) { $('#slideInfo').textContent = `Semua ${total} kopi terlihat`; return; }
  const first = prevBtn.disabled ? 1 : Math.min(total, Math.round(grid.scrollLeft / step) + 1);
  const visible = Math.max(1, Math.floor(grid.clientWidth / step + 0.2));
  const last = nextBtn.disabled ? total : Math.min(total, first + visible - 1);
  $('#slideInfo').textContent = `Kopi ${first}-${last} dari ${total}`;
}
function slide(dir) {
  const step = stepWidth();
  if (!step) return;
  const n = Math.max(1, Math.floor(grid.clientWidth / step));
  grid.scrollBy({ left: dir * step * n, behavior: reduce ? 'auto' : 'smooth' });
}
prevBtn.addEventListener('click', () => slide(-1));
nextBtn.addEventListener('click', () => slide(1));
grid.addEventListener('scroll', updateSlider, { passive: true });
grid.addEventListener('keydown', e => {
  if (e.target !== grid) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); slide(1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); slide(-1); }
});
addEventListener('resize', updateSlider);
let dragX = 0, startL = 0, down = false, moved = false;
grid.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  down = true; moved = false; dragX = e.clientX; startL = grid.scrollLeft;
});
addEventListener('pointermove', e => {
  if (!down) return;
  const dx = e.clientX - dragX;
  if (!moved && Math.abs(dx) > 6) { moved = true; grid.classList.add('drag'); }
  if (moved) grid.scrollLeft = startL - dx;
});
addEventListener('pointerup', () => {
  if (!down) return;
  down = false;
  if (moved) {
    grid.classList.remove('drag');
    const st = stepWidth();
    if (st) grid.scrollTo({ left: Math.round(grid.scrollLeft / st) * st, behavior: reduce ? 'auto' : 'smooth' });
    addEventListener('click', ev => ev.stopPropagation(), { capture: true, once: true });
  }
});

/* ===== Filter wilayah (dengan jumlah per wilayah) ===== */
chipsBox.innerHTML = regions.map(r => {
  const n = r === 'Semua' ? kopi.length : kopi.filter(k => k.region === r).length;
  return `<button class="chip" type="button" data-region="${r}" aria-pressed="${r === 'Semua'}"><span>${r}</span><b>${n}</b></button>`;
}).join('');

function renderKopi(reset) {
  const keep = grid.scrollLeft;
  const only = $('#onlyFav').checked;
  const key = $('#sort').value;
  const list = kopi.filter(k =>
    (region === 'Semua' || k.region === region) &&
    (!only || favs.has(k.id)) &&
    (k.nama + ' ' + k.daerah + ' ' + k.rasa + ' ' + k.jenis + ' ' + k.notes.join(' ')).toLowerCase().includes(query))
    .sort((a, b) => a[key].localeCompare(b[key], 'id') || a.nama.localeCompare(b.nama, 'id'));
  grid.innerHTML = list.length ? list.map(k => `
    <article class="kcard" data-id="${k.id}" data-region="${k.region}" aria-roledescription="slide">
      ${foto(k)}
      <div class="kbody">
        <p class="tag"><span>${k.region}</span><em>${k.jenis}</em></p>
        <h3>${k.nama}</h3>
        <p>${k.rasa}</p>
        <ul class="notes">${k.notes.map(n => `<li>${n}</li>`).join('')}</ul>
        <div class="kactions">
          <button class="link" type="button" data-detail="${k.id}">Lihat detail</button>
          <button class="cmp" type="button" data-cmp="${k.id}">Bandingkan</button>
          <button class="fav" type="button" data-fav="${k.id}" aria-pressed="${favs.has(k.id)}" aria-label="Favorit ${k.nama}">${favs.has(k.id) ? '&#9829;' : '&#9825;'}</button>
        </div>
      </div>
    </article>`).join('') : '<p class="empty">Belum ada yang cocok, coba kata kunci atau filter lain.</p>';
  grid.scrollTo({ left: reset ? 0 : keep, behavior: 'instant' });
  $('#count').textContent = `${list.length} kopi ditampilkan`;
  $('#favCount').textContent = favs.size;
  updateSlider();
}
chipsBox.addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  region = b.dataset.region;
  $$('.chip').forEach(c => c.setAttribute('aria-pressed', String(c === b)));
  renderKopi(true);
});
$('#search').addEventListener('input', e => { query = e.target.value.trim().toLowerCase(); renderKopi(true); });
$('#onlyFav').addEventListener('change', () => renderKopi(true));
$('#sort').addEventListener('change', () => renderKopi(true));
grid.addEventListener('click', e => {
  const d = e.target.closest('[data-detail]'), f = e.target.closest('[data-fav]'), c = e.target.closest('[data-cmp]');
  if (d) openDetail(d.dataset.detail);
  else if (c) {
    if (cmpA.value === c.dataset.cmp) cmpA.value = cmpB.value === 'gayo' ? 'toraja' : 'gayo';
    cmpB.value = c.dataset.cmp; renderCmp();
    toast(byId(c.dataset.cmp).nama + ' masuk ke perbandingan');
    $('#bandingkan').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  } else if (!f && e.target.closest('.kcard')) openDetail(e.target.closest('.kcard').dataset.id);
  if (f) {
    const id = f.dataset.fav;
    favs.has(id) ? favs.delete(id) : favs.add(id);
    saveFavs();
    toast(byId(id).nama + (favs.has(id) ? ' disimpan ke favorit' : ' dihapus dari favorit'));
    if ($('#onlyFav').checked) {
      renderKopi(false);
    } else {
      const on = favs.has(id);
      f.setAttribute('aria-pressed', String(on));
      f.innerHTML = on ? '&#9829;' : '&#9825;';
      $('#favCount').textContent = favs.size;
    }
  }
});
renderKopi(true);

/* ===== Modal detail ===== */
const dlg = $('#modal');
function openDetail(id) {
  const k = byId(id);
  if (!k) return;
  $('#mTitle').textContent = k.nama;
  $('#mBody').innerHTML = `<div class="mphoto">${foto(k)}</div>
    <p>${k.cerita}</p>
    <ul class="notes">${k.notes.map(n => `<li>${n}</li>`).join('')}</ul>
    <dl>
      <div><dt>Daerah</dt><dd>${k.daerah}</dd></div>
      <div><dt>Jenis</dt><dd>${k.jenis}</dd></div>
      <div><dt>Ketinggian</dt><dd>${k.tinggi}</dd></div>
      <div><dt>Proses umum</dt><dd>${k.proses}</dd></div>
      <div><dt>Rasa</dt><dd>${k.rasa}</dd></div>
      <div><dt>Cocok diseduh</dt><dd>${k.seduh}</dd></div>
      <div><dt>Fakta</dt><dd>${k.fakta}</dd></div>
    </dl>`;
  dlg.showModal();
}
$('#mClose').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

/* ===== Bandingkan dua kopi ===== */
const cmpA = $('#cmpA'), cmpB = $('#cmpB');
const opts = kopi.map(k => `<option value="${k.id}">${k.nama}</option>`).join('');
cmpA.innerHTML = opts; cmpB.innerHTML = opts;
cmpA.value = 'gayo'; cmpB.value = 'kintamani';
function renderCmp() {
  const a = byId(cmpA.value), b = byId(cmpB.value);
  if (a.id === b.id) { $('#cmpOut').innerHTML = '<p class="status">Pilih dua kopi yang berbeda untuk dibandingkan.</p>'; return; }
  const rows = [['Daerah', 'daerah'], ['Jenis', 'jenis'], ['Ketinggian', 'tinggi'], ['Proses umum', 'proses'], ['Rasa', 'rasa'], ['Cocok diseduh', 'seduh']];
  $('#cmpOut').innerHTML = `<table><thead><tr><th scope="col">Aspek</th><th scope="col">${a.nama}</th><th scope="col">${b.nama}</th></tr></thead><tbody>` +
    rows.map(r => `<tr><th scope="row">${r[0]}</th><td>${a[r[1]]}</td><td>${b[r[1]]}</td></tr>`).join('') + '</tbody></table>';
}
cmpA.addEventListener('change', renderCmp);
cmpB.addEventListener('change', renderCmp);
renderCmp();

/* ===== Tab (sejarah & proses) ===== */
function buatTab(rootId, data) {
  const root = $('#' + rootId);
  root.innerHTML = `<div class="tablist" role="tablist">${data.map((d, i) =>
    `<button class="tab" role="tab" id="${rootId}-t${i}" aria-selected="${i === 0}" aria-controls="${rootId}-p" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">${d.tab}</button>`).join('')}</div>
    <div class="tabpanel" role="tabpanel" id="${rootId}-p" tabindex="0"></div>`;
  const panel = $('#' + rootId + '-p');
  const tabs = $$('.tab', root);
  function pilih(i) {
    tabs.forEach((t, n) => { t.setAttribute('aria-selected', String(n === i)); t.tabIndex = n === i ? 0 : -1; });
    panel.setAttribute('aria-labelledby', `${rootId}-t${i}`);
    const d = data[i];
    panel.innerHTML = `<h3>${d.judul}</h3><p>${d.isi}</p>` + (d.poin ? `<ul>${d.poin.map(p => `<li>${p}</li>`).join('')}</ul>` : '');
  }
  root.addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) pilih(Number(t.dataset.i)); });
  root.addEventListener('keydown', e => {
    const t = e.target.closest('.tab');
    if (!t || !['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const n = (Number(t.dataset.i) + (e.key === 'ArrowRight' ? 1 : -1) + data.length) % data.length;
    pilih(n); tabs[n].focus();
  });
  pilih(0);
}
const sejarah = [
  { tab: 'Akhir 1600-an', judul: 'Bibit pertama tiba di Jawa', isi: 'Pada akhir abad ke-17 VOC membawa bibit arabika ke Jawa. Percobaan awal sempat gagal, tapi penanaman berikutnya berhasil dan kopi Jawa mulai dikirim ke Eropa.' },
  { tab: '1830-an', judul: 'Masa tanam paksa', isi: 'Kopi menjadi komoditas andalan pemerintah kolonial. Petani diwajibkan menanam kopi, dan hasilnya banyak dinikmati pihak kolonial, bukan petani.' },
  { tab: 'Akhir 1800-an', judul: 'Karat daun menyerang', isi: 'Penyakit karat daun merusak banyak kebun arabika di dataran rendah. Pemerintah kolonial mencoba liberika, lalu beralih ke robusta yang lebih tahan penyakit pada awal abad ke-20.' },
  { tab: 'Abad ke-20', judul: 'Robusta meluas', isi: 'Robusta menyebar luas, terutama di dataran rendah seperti Sumatra bagian selatan. Sebagian besar kopi Indonesia ditanam petani kecil, bukan perkebunan besar.' },
  { tab: 'Sekarang', judul: 'Era kopi spesialti', isi: 'Perhatian bergeser ke asal kebun, proses, dan kualitas rasa. Beberapa kopi Indonesia memiliki indikasi geografis, termasuk Kintamani dan Gayo, dan kedai kopi lokal tumbuh pesat.' }
];
const proses = [
  { tab: 'Natural', judul: 'Natural (kering)', isi: 'Buah kopi utuh dijemur sampai kering, baru kulitnya dibuang.', poin: ['Rasa: manis, fruity, body lebih berat', 'Risiko: fermentasi berlebihan kalau penjemuran kurang terkontrol'] },
  { tab: 'Basah penuh', judul: 'Fully washed (basah penuh)', isi: 'Kulit dan lendir buah dibuang lewat fermentasi dan pencucian sebelum biji dijemur.', poin: ['Rasa: bersih, asam jelas, karakter daerah lebih terasa', 'Butuh banyak air bersih'] },
  { tab: 'Giling basah', judul: 'Giling basah (wet-hulled)', isi: 'Metode khas Indonesia. Kulit tanduk dikupas saat biji masih lembap, lalu dikeringkan lagi.', poin: ['Rasa: body tebal, asam rendah, earthy dan rempah', 'Banyak dipakai di Sumatra dan Sulawesi', 'Biji hijau yang dihasilkan biasanya kebiruan atau kehijauan gelap'] },
  { tab: 'Honey', judul: 'Honey process', isi: 'Kulit buah dibuang tapi sebagian lendir dibiarkan menempel saat biji dijemur. Namanya "honey" karena lendirnya lengket, bukan karena ditambah madu.', poin: ['Rasa: manis, body sedang, asam lembut'] }
];
buatTab('tabSejarah', sejarah);
buatTab('tabProses', proses);

/* ===== Kuis rekomendasi ===== */
const soal = [
  { q: 'Rasa kopi seperti apa yang kamu suka?', o: [['Segar dan asam buah', 'fruity'], ['Manis dan seimbang', 'sweet'], ['Dalam, rempah, cokelat', 'earthy'], ['Pahit dan kuat', 'bold']] },
  { q: 'Kamu biasa minum kopi dengan apa?', o: [['Hitam tanpa gula', 'fruity'], ['Susu dan sedikit gula', 'sweet'], ['Hitam, ampasnya ikut (tubruk)', 'bold'], ['Gula aren', 'earthy']] },
  { q: 'Kapan biasanya kamu ngopi?', o: [['Pagi santai', 'fruity'], ['Sambil kerja siang hari', 'sweet'], ['Pas hujan', 'earthy'], ['Begadang', 'bold']] }
];
const quiz = $('#quiz');
let qi = 0, skor = {};
function renderQuiz() {
  if (qi >= soal.length) {
    const top = Object.keys(skor).sort((a, b) => skor[b] - skor[a])[0];
    const cocok = kopi.filter(k => k.profil === top);
    quiz.innerHTML = `<p class="qnum">Hasilnya</p><h3>${cocok[0].nama}</h3>
      <p>${cocok[0].rasa} Alternatif lain: ${cocok.slice(1).map(k => k.nama).join(', ') || 'belum ada'}.</p>
      <button class="btn" type="button" data-detail="${cocok[0].id}">Lihat detail</button>
      <button class="ghost" type="button" id="qReset">Ulangi kuis</button>`;
    return;
  }
  const s = soal[qi];
  quiz.innerHTML = `<p class="qnum">Pertanyaan ${qi + 1} dari ${soal.length}</p><h3>${s.q}</h3>` +
    s.o.map((o, i) => `<button class="opt" type="button" data-i="${i}">${o[0]}</button>`).join('');
}
quiz.addEventListener('click', e => {
  const opt = e.target.closest('.opt'), det = e.target.closest('[data-detail]');
  if (opt) { const p = soal[qi].o[opt.dataset.i][1]; skor[p] = (skor[p] || 0) + 1; qi++; renderQuiz(); }
  if (det) openDetail(det.dataset.detail);
  if (e.target.id === 'qReset') { qi = 0; skor = {}; renderQuiz(); }
});
renderQuiz();

/* ===== Kalkulator seduh ===== */
const methods = {
  v60:      { perCup: 200, ratio: 16, grind: 'Medium-halus', temp: '92-96°C', time: '2,5-3 menit' },
  fp:       { perCup: 200, ratio: 15, grind: 'Kasar',        temp: '93-96°C', time: '4 menit' },
  tubruk:   { perCup: 150, ratio: 14, grind: 'Halus',        temp: '90-95°C', time: '3-4 menit' },
  espresso: { perCup: 36,  ratio: 2,  grind: 'Sangat halus', temp: '90-96°C', time: '25-30 detik' }
};
const cupsEl = $('#cups');
function hitung() {
  const cups = parseInt(cupsEl.value, 10);
  if (isNaN(cups) || cups < 1 || cups > 12) {
    $('#cupsErr').textContent = 'Isi jumlah cangkir antara 1 sampai 12.';
    cupsEl.setAttribute('aria-invalid', 'true');
    return;
  }
  $('#cupsErr').textContent = '';
  cupsEl.removeAttribute('aria-invalid');
  const m = methods[$('#method').value];
  const ratio = m.ratio * parseFloat($('#strength').value);
  const water = m.perCup * cups;
  $('#outWater').textContent = water;
  $('#outCoffee').textContent = (water / ratio).toFixed(1).replace('.0', '');
  $('#outRatio').textContent = '1 : ' + ratio.toFixed(1).replace('.0', '');
  $('#outGrind').textContent = m.grind;
  $('#outTemp').textContent = m.temp;
  $('#outTime').textContent = m.time;
}
['method', 'strength'].forEach(id => $('#' + id).addEventListener('change', hitung));
cupsEl.addEventListener('input', hitung);
$('#calc').addEventListener('submit', e => e.preventDefault());
hitung();

/* ===== Timer seduh ===== */
let detik = 0, jam = null;
const clock = $('#clock'), tStart = $('#tStart');
const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
tStart.addEventListener('click', () => {
  if (jam) { clearInterval(jam); jam = null; tStart.textContent = 'Lanjut'; return; }
  jam = setInterval(() => { detik++; clock.textContent = fmt(detik); }, 1000);
  tStart.textContent = 'Jeda';
});
$('#tReset').addEventListener('click', () => {
  clearInterval(jam); jam = null; detik = 0;
  clock.textContent = '00:00'; tStart.textContent = 'Mulai';
});

/* ===== Checklist langkah ===== */
const checks = $$('.steps input');
function updateSteps() {
  const n = checks.filter(c => c.checked).length;
  $('#stepBar').style.width = (n / checks.length) * 100 + '%';
  $('#stepText').textContent = n === checks.length ? 'Selesai, selamat menikmati kopimu!' : `${n} dari ${checks.length} langkah`;
}
checks.forEach(c => c.addEventListener('change', updateSteps));

/* ===== Glosarium ===== */
const glos = [
  ['Bloom', 'Tahap awal seduh saat air pertama dituang dan gas karbon dioksida keluar dari kopi, ditandai permukaan yang menggembung.'],
  ['Body', 'Rasa "tebal" atau berat kopi di mulut, dari ringan seperti teh sampai pekat seperti susu.'],
  ['Acidity', 'Rasa asam segar yang menyenangkan, mirip buah. Bukan berarti kopinya asam seperti cuka.'],
  ['Cupping', 'Metode mencicip kopi secara standar untuk menilai aroma, rasa, dan kualitas.'],
  ['Single origin', 'Kopi dari satu daerah atau kebun tertentu, bukan campuran.'],
  ['Blend', 'Campuran beberapa jenis kopi untuk mendapat rasa yang konsisten atau seimbang.'],
  ['Ekstraksi', 'Proses melarutkan zat dari bubuk kopi ke dalam air saat menyeduh.'],
  ['Under-extracted', 'Kopi kurang terekstraksi, rasanya asam tajam dan tipis.'],
  ['Over-extracted', 'Kopi terlalu terekstraksi, rasanya pahit dan kering.'],
  ['Mdpl', 'Singkatan "meter di atas permukaan laut", ukuran ketinggian kebun kopi.'],
  ['Green bean', 'Biji kopi mentah yang belum disangrai.'],
  ['Crema', 'Lapisan busa kecokelatan di atas espresso.'],
  ['Indikasi geografis', 'Tanda yang menunjukkan produk berkualitas khas karena asal daerahnya, misalnya Kopi Kintamani Bali.']
];
function renderGlos() {
  const q = $('#gSearch').value.trim().toLowerCase();
  const list = glos.filter(g => (g[0] + ' ' + g[1]).toLowerCase().includes(q));
  const mark = t => {
    if (!q) return t;
    const i = t.toLowerCase().indexOf(q);
    return i < 0 ? t : t.slice(0, i) + '<mark>' + t.slice(i, i + q.length) + '</mark>' + t.slice(i + q.length);
  };
  $('#glosList').innerHTML = list.map(g => `<div><dt>${mark(g[0])}</dt><dd>${mark(g[1])}</dd></div>`).join('');
  $('#gCount').textContent = list.length ? `${list.length} istilah` : 'Istilah tidak ditemukan.';
}
$('#gSearch').addEventListener('input', renderGlos);
renderGlos();

/* ===== Mitos ===== */
$$('.myth-q').forEach(btn => btn.addEventListener('click', () => {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  panel.hidden = open;
}));

/* ===== Form pendaftaran (validasi gaya Bootstrap) ===== */
const form = $('#formDaftar'), hasil = $('#formHasil');
form.addEventListener('submit', e => {
  e.preventDefault();
  form.classList.add('was-validated');
  if (!form.checkValidity()) return;
  const hobi = $$('input[name="hobi"]:checked', form).map(c => c.value);
  hasil.replaceChildren();
  const judul = document.createElement('strong');
  judul.textContent = 'Terima kasih, ' + form.nama.value.trim() + '!';
  const rinci = document.createElement('span');
  rinci.textContent = ' Data tercatat: ' + form.kota.value + ', hobi ' + (hobi.length ? hobi.join(', ') : 'belum dipilih') + '.';
  hasil.append(judul, rinci);
  hasil.hidden = false;
  toast('Data terkirim');
});
form.addEventListener('reset', () => {
  form.classList.remove('was-validated');
  hasil.hidden = true;
});