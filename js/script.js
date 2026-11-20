'use strict';

document.addEventListener('DOMContentLoaded', function () {
  menuMobile();
  formKontak();
  lightboxGaleri();
  kalkulatorHarga();
  animasiAngka();
  statusBuka();
});

function menuMobile() {
  var cek = document.getElementById('silfa_menu_cek');
  if (!cek) return;

  document.querySelectorAll('#silfa_nav a').forEach(function (a) {
    a.addEventListener('click', function () { cek.checked = false; });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 700) cek.checked = false;
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cek.checked = false;
  });
}

function tombolKeAtas() {
  var btn = document.createElement('button');
  btn.id = 'silfa_atas';
  btn.type = 'button';
  btn.textContent = '↑ Atas';
  btn.setAttribute('aria-label', 'Kembali ke atas halaman');
  btn.style.display = 'none';
  document.body.appendChild(btn);

  function atur() {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  }
  window.addEventListener('scroll', atur, { passive: true });
  atur();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function formKontak() {
  var form = document.getElementById('silfa_form');
  if (!form) return;

  var tujuan = form.getAttribute('action'); 
  var tombol = form.querySelector('button[type="submit"]');
  var kolomPesan = document.getElementById('silfa_pesan');

  var error = document.createElement('span');
  error.className = 'silfa_error';
  error.setAttribute('role', 'alert');
  kolomPesan.insertAdjacentElement('afterend', error);

  var sukses = document.createElement('p');
  sukses.id = 'silfa_sukses';
  sukses.setAttribute('role', 'status');
  tombol.insertAdjacentElement('afterend', sukses);

  function ambil(id) {
    return document.getElementById(id).value.trim();
  }

  kolomPesan.addEventListener('input', function () { error.textContent = ''; });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (ambil('silfa_nama').length < 3) {
      alert('Nama minimal 3 karakter.');
      document.getElementById('silfa_nama').focus();
      return;
    }
    if (ambil('silfa_pesan').length < 10) {
      error.textContent = 'Keluhan minimal 10 karakter supaya mekanik paham masalahnya.';
      kolomPesan.focus();
      return;
    }

    var teks = [
      'Halo PT Sumber Pilar Armada, saya ingin booking servis.',
      '',
      'Nama: ' + ambil('silfa_nama'),
      'Email: ' + ambil('silfa_email'),
      'No. HP: ' + ambil('silfa_hp'),
      'Tipe mobil: ' + ambil('silfa_kendaraan'),
      'Keluhan: ' + ambil('silfa_pesan')
    ].join('\n');

    window.open(tujuan + '?text=' + encodeURIComponent(teks), '_blank', 'noopener');

    sukses.textContent = 'Terima kasih! WhatsApp akan terbuka, tinggal tekan kirim.';
    form.reset();
    setTimeout(function () { sukses.textContent = ''; }, 8000);
  });
}

function lightboxGaleri() {
  var foto = Array.prototype.slice.call(
    document.querySelectorAll('#silfa_galeri .silfa_foto')
  );
  if (!foto.length) return;

  var gaya = document.createElement('style');
  gaya.textContent =
    '#silfa_lightbox{position:fixed;inset:0;z-index:100;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,.9);padding:20px}' +
    '#silfa_lightbox.silfa_buka{display:flex}' +
    '#silfa_lightbox img{max-width:min(92vw,900px);max-height:78vh;object-fit:contain;border-radius:4px;border-bottom:4px solid var(--merah)}' +
    '#silfa_lightbox p{color:#fff;margin:14px 0 0;font-weight:600;text-align:center}' +
    '.silfa_lb_tombol{position:absolute;background:var(--merah);color:#fff;border:0;border-radius:4px;padding:10px 14px;font-weight:700;cursor:pointer}' +
    '.silfa_lb_tombol:hover{background:var(--merah-gelap)}' +
    '#silfa_lb_tutup{top:18px;right:18px}' +
    '#silfa_lb_prev{left:14px;top:50%}' +
    '#silfa_lb_next{right:14px;top:50%}';
  document.head.appendChild(gaya);

  var kotak = document.createElement('div');
  kotak.id = 'silfa_lightbox';
  kotak.setAttribute('role', 'dialog');
  kotak.setAttribute('aria-modal', 'true');
  kotak.setAttribute('aria-label', 'Pratinjau foto');
  kotak.innerHTML =
    '<button type="button" class="silfa_lb_tombol" id="silfa_lb_tutup" aria-label="Tutup">✕</button>' +
    '<button type="button" class="silfa_lb_tombol" id="silfa_lb_prev" aria-label="Foto sebelumnya">‹</button>' +
    '<img alt="">' +
    '<p></p>' +
    '<button type="button" class="silfa_lb_tombol" id="silfa_lb_next" aria-label="Foto berikutnya">›</button>';
  document.body.appendChild(kotak);

  var gambar = kotak.querySelector('img');
  var keterangan = kotak.querySelector('p');
  var sekarang = 0;

  function tampil(i) {
    sekarang = (i + foto.length) % foto.length;
    var img = foto[sekarang].querySelector('img');
    gambar.src = img.src;
    gambar.alt = img.alt;
    keterangan.textContent = foto[sekarang].querySelector('figcaption').textContent;
  }
  function buka(i) {
    tampil(i);
    kotak.classList.add('silfa_buka');
    document.body.style.overflow = 'hidden';
    document.getElementById('silfa_lb_tutup').focus();
  }
  function tutup() {
    kotak.classList.remove('silfa_buka');
    document.body.style.overflow = '';
    foto[sekarang].focus();
  }

  foto.forEach(function (f, i) {
    f.addEventListener('click', function () { buka(i); });
    f.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        buka(i);
      }
    });
  });

  document.getElementById('silfa_lb_tutup').addEventListener('click', tutup);
  document.getElementById('silfa_lb_prev').addEventListener('click', function () { tampil(sekarang - 1); });
  document.getElementById('silfa_lb_next').addEventListener('click', function () { tampil(sekarang + 1); });

  kotak.addEventListener('click', function (e) {
    if (e.target === kotak) tutup();
  });

  document.addEventListener('keydown', function (e) {
    if (!kotak.classList.contains('silfa_buka')) return;
    if (e.key === 'Escape') tutup();
    if (e.key === 'ArrowLeft') tampil(sekarang - 1);
    if (e.key === 'ArrowRight') tampil(sekarang + 1);
  });
}

function kalkulatorHarga() {
  var tabel = document.getElementById('silfa_tabel_harga');
  if (!tabel) return;

  var wadah = tabel.closest('.silfa_wadah');
  var cta = wadah.querySelector('.silfa_cta');

  var kalk = document.createElement('div');
  kalk.id = 'silfa_kalkulator';
  kalk.innerHTML =
    '<h2>Kalkulator Estimasi</h2>' +
    '<p>Centang layanan yang dibutuhkan untuk melihat perkiraan biaya jasa.</p>' +
    '<fieldset><legend>Pilih layanan</legend><div id="silfa_pilihan"></div></fieldset>' +
    '<p class="silfa_total">Estimasi jasa: <strong id="silfa_total_angka">Rp 0</strong></p>' ;

  if (cta) wadah.insertBefore(kalk, cta);
  else wadah.appendChild(kalk);

  function rupiah(n) {
    return 'Rp ' + n.toLocaleString('id-ID');
  }

  var pilihan = document.getElementById('silfa_pilihan');
  var angka = document.getElementById('silfa_total_angka');

  tabel.querySelectorAll('tbody tr').forEach(function (baris) {
    var sel = baris.querySelectorAll('td');
    var nama = sel[0].textContent.trim();
    var harga = parseInt(sel[1].textContent.replace(/\D/g, ''), 10);

    var label = document.createElement('label');
    var cek = document.createElement('input');
    cek.type = 'checkbox';

    if (isNaN(harga)) {
      cek.disabled = true; 
      label.append(cek, ' ' + nama + ' (hubungi kami)');
    } else {
      cek.value = harga;
      label.append(cek, ' ' + nama + ' - ' + rupiah(harga));
    }
    pilihan.appendChild(label);
  });

  pilihan.addEventListener('change', function () {
    var total = 0;
    pilihan.querySelectorAll('input:checked').forEach(function (c) {
      total += Number(c.value);
    });
    angka.textContent = rupiah(total);
  });
}

function animasiAngka() {
  var daftar = document.querySelectorAll('.silfa_angka strong');
  if (!daftar.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var pengamat = new IntersectionObserver(function (entri) {
    entri.forEach(function (en) {
      if (!en.isIntersecting) return;
      pengamat.unobserve(en.target);
      hitung(en.target);
    });
  }, { threshold: 0.6 });

  daftar.forEach(function (el) { pengamat.observe(el); });

  function hitung(el) {
    var cocok = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!cocok) return;
    var target = parseInt(cocok[1], 10);
    var akhiran = cocok[2];
    var mulai = null;

    function langkah(waktu) {
      if (mulai === null) mulai = waktu;
      var p = Math.min((waktu - mulai) / 1000, 1);
      el.textContent = Math.round(target * p) + akhiran;
      if (p < 1) requestAnimationFrame(langkah);
    }
    requestAnimationFrame(langkah);
  }
}

function statusBuka() {
  var peta = document.querySelector('.silfa_kolom2 .silfa_peta');
  if (!peta) return;

  var status = document.createElement('p');
  peta.insertAdjacentElement('beforebegin', status);

  function perbarui() {
    var bagian = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(new Date());

    var jam = 0, menit = 0;
    bagian.forEach(function (b) {
      if (b.type === 'hour') jam = parseInt(b.value, 10);
      if (b.type === 'minute') menit = parseInt(b.value, 10);
    });

    var total = jam * 60 + menit;
    var buka = total >= 9 * 60 && total < 17 * 60;

    status.innerHTML = buka
      ? '<strong style="color:#237a3b">● Buka sekarang</strong> (tutup pukul 17.00 WIB)'
      : '<strong style="color:#c62828">● Tutup sekarang</strong> (buka pukul 09.00 WIB)';
  }

  perbarui();
  setInterval(perbarui, 60000);
}