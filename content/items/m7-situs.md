## Kenapa perlu situs

Satu tautan yang merangkum semua proyek, CV, dan kontak lebih mudah dibagikan daripada tiga tautan repositori. Situs portofolio tidak perlu rumit. Satu halaman yang rapi dan cepat dibuka di HP sudah cukup.

## Pilihan hosting gratis

| Pilihan | Cara kerja | Cocok untuk |
|---|---|---|
| **GitHub Pages** | File HTML di repositori GitHub langsung menjadi situs | Paling sederhana, satu akun dengan portofolio kode |
| **Vercel** | Repositori GitHub dihubungkan, setiap push otomatis terbit | Kalau ingin memakai framework atau domain sendiri nanti |

Panduan di bawah memakai GitHub Pages.

## Langkah 1: buat repositori situs (10 menit)

1. Di GitHub, buat repositori publik baru bernama **`nama-pengguna.github.io`**, dengan nama pengguna GitHub Anda sendiri. Nama ini membuat situs Anda tersedia di `https://nama-pengguna.github.io`.
2. Centang **Add a README file**.

## Langkah 2: tambahkan halaman (30 menit)

Buat file baru bernama `index.html` dengan templat berikut. Ganti semua bagian contoh dengan isi Anda.

```html
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nama Anda · Data Analyst</title>
  <meta name="description" content="Portofolio data analyst: SQL, Python, dan dashboard.">
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #12282c; background: #f3f6f6; }
    main { max-width: 760px; margin: 0 auto; padding: 32px 16px 48px; }
    h1 { margin: 0; font-size: 2rem; }
    .lead { color: #566a6e; margin-top: 4px; }
    nav a { margin-right: 16px; color: #0d6b62; font-weight: 600; }
    .proyek { background: #fff; border: 1px solid #dae3e4; border-radius: 12px; padding: 20px; margin-top: 16px; }
    .proyek img { width: 100%; height: auto; border-radius: 8px; border: 1px solid #dae3e4; }
    .proyek h3 { margin: 12px 0 4px; }
    .alat { font-size: 0.9rem; color: #566a6e; }
    .tautan a { margin-right: 12px; color: #0d6b62; }
  </style>
</head>
<body>
  <main>
    <h1>Nama Anda</h1>
    <p class="lead">Data analyst · SQL, Python (pandas), Tableau, Looker Studio</p>
    <p>Satu atau dua kalimat tentang Anda: latar belakang, pengalaman magang sebagai data analyst di instansi pemerintah, dan jenis masalah yang ingin Anda selesaikan dengan data.</p>
    <nav>
      <a href="cv.pdf">CV (PDF)</a>
      <a href="https://github.com/nama-pengguna">GitHub</a>
      <a href="https://www.linkedin.com/in/nama-anda">LinkedIn</a>
      <a href="mailto:email@contoh.com">Email</a>
    </nav>

    <h2>Proyek</h2>

    <article class="proyek">
      <img src="gambar/thelook.png" alt="Dashboard segmentasi RFM dan retensi kohort">
      <h3>Siapa pelanggan terbaik, dan siapa yang mulai menjauh?</h3>
      <p class="alat">BigQuery (SQL) · Tableau Public</p>
      <p>Segmentasi RFM dan retensi kohort pada data e-commerce theLook. Temuan utama dalam satu kalimat, dan satu rekomendasi.</p>
      <p class="tautan"><a href="#">Dashboard</a><a href="#">Kode dan penjelasan</a></p>
    </article>

    <article class="proyek">
      <img src="gambar/indikator.png" alt="Dashboard indikator daerah">
      <h3>Judul yang menyatakan temuan proyek indikator daerah</h3>
      <p class="alat">Python (pandas) · Tableau Public atau Looker Studio · data BPS</p>
      <p>Satu kalimat temuan, satu kalimat siapa yang terbantu.</p>
      <p class="tautan"><a href="#">Dashboard</a><a href="#">Notebook</a></p>
    </article>

    <article class="proyek">
      <h3>Memangkas waktu penyusunan laporan bulanan dari satu hari menjadi satu jam</h3>
      <p class="alat">Google Sheets · pivot table · Looker Studio</p>
      <p>Studi kasus magang di instansi pemerintah, tanpa data internal.</p>
      <p class="tautan"><a href="#">Baca studi kasus</a></p>
    </article>
  </main>
</body>
</html>
```

Templat ini sudah diuji tampil rapi di lebar HP dan desktop.

## Langkah 3: tambahkan gambar dan CV (15 menit)

1. Ambil tangkapan layar setiap dashboard (Cmd + Shift + 4 di Mac), beri nama pendek seperti `thelook.png`, lalu unggah ke folder `gambar/` di repositori (**Add file**, **Upload files**, ketik `gambar/` di depan nama file).
2. Ekspor CV ke PDF, beri nama `cv.pdf`, dan unggah ke akar repositori.
3. Ganti setiap `href="#"` dengan tautan yang sebenarnya.

## Langkah 4: aktifkan dan periksa (10 menit)

1. Di repositori, buka **Settings**, **Pages**. Pastikan sumbernya cabang `main`. Untuk repositori bernama `nama-pengguna.github.io`, situs biasanya aktif otomatis.
2. Tunggu beberapa menit, lalu buka `https://nama-pengguna.github.io`.
3. Buka juga di HP. Klik setiap tautan, termasuk CV.

> [!tip] Teks alternatif gambar
> Atribut `alt` pada gambar dibaca oleh pembaca layar dan tampil kalau gambar gagal dimuat. Tulis isi gambarnya secara singkat, misalnya "Dashboard segmentasi RFM dan retensi kohort".

> [!warning] Jangan unggah data sensitif
> Repositori situs bersifat publik. Jangan menaruh nomor telepon pribadi, alamat rumah, atau dokumen apa pun dari tempat magang. Email cukup sebagai kontak.
