// ===== 0. Tandai bahwa JavaScript aktif (untuk animasi) =====
document.documentElement.classList.add('gibran_js');

// ===== 1. Menu hamburger (mobile) =====
const gibran_toggle = document.getElementById('gibran_toggle');
const gibran_menu   = document.getElementById('gibran_menu');

gibran_toggle.addEventListener('click', function () {
  gibran_menu.classList.toggle('gibran_open');
});

document.querySelectorAll('.gibran_menu a').forEach(function (link) {
  link.addEventListener('click', function () {
    gibran_menu.classList.remove('gibran_open');
  });
});

// ===== 2. Efek saat scroll =====
const gibran_sections = document.querySelectorAll('section[id]');
const gibran_links    = document.querySelectorAll('.gibran_menu a');
const gibran_header   = document.getElementById('gibran_header');
const gibran_top      = document.getElementById('gibran_top');

window.addEventListener('scroll', function () {
  let aktif = '';

  gibran_sections.forEach(function (sec) {
    if (window.scrollY >= sec.offsetTop - 120) {
      aktif = sec.id;
    }
  });

  gibran_links.forEach(function (link) {
    link.classList.toggle('gibran_active', link.getAttribute('href') === '#' + aktif);
  });

  gibran_header.classList.toggle('gibran_bayangan', window.scrollY > 20);
  gibran_top.classList.toggle('gibran_show', window.scrollY > 400);
});

// ===== 3. Animasi muncul saat di-scroll =====
const gibran_reveals = document.querySelectorAll('.gibran_reveal');

if ('IntersectionObserver' in window) {
  const gibran_observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('gibran_muncul');
        gibran_observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  gibran_reveals.forEach(function (el) {
    gibran_observer.observe(el);
  });
} else {
  // Browser lama: langsung tampilkan semua
  gibran_reveals.forEach(function (el) {
    el.classList.add('gibran_muncul');
  });
}

// ===== 4. Counter angka statistik =====
function gibran_hitung(el) {
  const target  = parseInt(el.getAttribute('data-target'));
  const akhiran = el.getAttribute('data-akhiran') || '';
  const durasi  = 2000;                 // lama animasi (milidetik)
  const mulai   = performance.now();

  function langkah(waktu) {
    const progres = Math.min((waktu - mulai) / durasi, 1);
    const nilai   = Math.floor(progres * target);
    el.textContent = nilai.toLocaleString('id-ID') + akhiran;

    if (progres < 1) {
      requestAnimationFrame(langkah);
    } else {
      el.textContent = target.toLocaleString('id-ID') + akhiran;
    }
  }

  requestAnimationFrame(langkah);
}

const gibran_counterObs = new IntersectionObserver(function (entries, obs) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      gibran_hitung(entry.target);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.gibran_angka').forEach(function (el) {
  gibran_counterObs.observe(el);
});

// ===== 5. Galeri + modal =====
const gibran_modal      = document.getElementById('gibran_modal');
const gibran_modalIsi   = document.getElementById('gibran_modal_isi');
const gibran_modalJudul = document.getElementById('gibran_modal_judul');

document.querySelectorAll('.gibran_item_galeri').forEach(function (item) {
  item.addEventListener('click', function () {
    const gambar = item.querySelector('img').getAttribute('src');
    gibran_modalIsi.innerHTML = '<img src="' + gambar + '" alt="">';
    gibran_modalJudul.textContent = item.getAttribute('data-judul');
    gibran_modal.classList.add('gibran_tampil');
  });
});

function gibran_tutupModal() {
  gibran_modal.classList.remove('gibran_tampil');
}

document.getElementById('gibran_tutup').addEventListener('click', gibran_tutupModal);
gibran_modal.addEventListener('click', function (e) {
  if (e.target === gibran_modal) gibran_tutupModal();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') gibran_tutupModal();
});

// ===== 6. Gambar cadangan kalau link gambar rusak =====
document.querySelectorAll('img').forEach(function (img) {
  img.addEventListener('error', function () {
    img.onerror = null; // cegah looping
    img.src = 'https://placehold.co/600x400?text=Gambar+Tidak+Tersedia';
  });
});

// ===== 7. Validasi form kontak =====
const gibran_form = document.getElementById('gibran_form');

gibran_form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nama   = document.getElementById('gibran_nama').value.trim();
  const email  = document.getElementById('gibran_email').value.trim();
  const subjek = document.getElementById('gibran_subjek').value;
  const pesan  = document.getElementById('gibran_pesan').value.trim();
  let valid = true;

  document.getElementById('gibran_err_nama').textContent  = '';
  document.getElementById('gibran_err_email').textContent = '';
  document.getElementById('gibran_err_pesan').textContent = '';
  document.getElementById('gibran_sukses').textContent    = '';

  if (nama.length < 3) {
    document.getElementById('gibran_err_nama').textContent = 'Nama minimal 3 karakter.';
    valid = false;
  }

  const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!polaEmail.test(email)) {
    document.getElementById('gibran_err_email').textContent = 'Format email tidak valid.';
    valid = false;
  }

  if (pesan.length < 10) {
    document.getElementById('gibran_err_pesan').textContent = 'Pesan minimal 10 karakter.';
    valid = false;
  }

  if (!valid) return;

  // Kirim lewat aplikasi email (mailto) ke pemilik website
  const tujuan = 'gibranaji93@gmail.com'; 
  const isi = 'Nama: ' + nama + '\nEmail: ' + email + '\n\n' + pesan;
  window.location.href = 'mailto:' + tujuan +
    '?subject=' + encodeURIComponent(subjek) +
    '&body=' + encodeURIComponent(isi);

  document.getElementById('gibran_sukses').textContent =
    'Terima kasih, ' + nama + '! Pesan Anda siap dikirim.';
  gibran_form.reset();
});