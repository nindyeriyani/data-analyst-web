## Brief

Buat dashboard publik tentang satu indikator pembangunan di tingkat provinsi atau kabupaten/kota, dari data terbuka BPS atau Satu Data Indonesia. Pembacanya adalah warga atau pegawai pemerintah daerah yang bukan ahli statistik.

Proyek ini sangat relevan untuk pengalaman magang Anda di instansi pemerintah, sekaligus menunjukkan kemampuan bekerja dengan data publik yang biasanya berantakan.

## Memilih indikator

Pilih satu indikator utama, ditambah satu indikator pendamping kalau sempat. Contoh:

| Indikator | Arti singkat |
|---|---|
| Tingkat Pengangguran Terbuka (TPT) | Persentase angkatan kerja yang sedang menganggur |
| Persentase penduduk miskin | Persentase penduduk dengan pengeluaran per kapita di bawah garis kemiskinan |
| Indeks Pembangunan Manusia (IPM) | Indeks gabungan dimensi kesehatan, pendidikan, dan standar hidup |
| Angka partisipasi sekolah | Persentase anak usia sekolah yang bersekolah, per kelompok usia |

Bacalah definisi resmi indikator di halaman BPS (biasanya ada di bagian konsep dan definisi atau metadata), lalu tulis ulang dengan bahasa awam untuk dashboard.

## Langkah

1. **Unduh data (30 menit).** Cari tabel indikator di bps.go.id atau data.go.id untuk wilayah yang Anda pilih, misalnya semua kabupaten/kota di satu provinsi, minimal lima tahun. Catat judul tabel, tautan, tanggal unduh, dan satuan.
2. **Rapikan data (60 menit).** Tabel BPS biasanya berbentuk lebar (tahun sebagai kolom) dan punya judul bertingkat serta catatan kaki. Ubah menjadi bentuk panjang di Colab:

```python
import pandas as pd

lebar = pd.read_excel("tpt_kabkota.xlsx", skiprows=3)   # sesuaikan baris judul
panjang = lebar.melt(id_vars="wilayah", var_name="tahun", value_name="tpt")
panjang["tahun"] = pd.to_numeric(panjang["tahun"], errors="coerce")
panjang["tpt"] = pd.to_numeric(panjang["tpt"], errors="coerce")
panjang = panjang.dropna(subset=["tahun"])
```

   Periksa hal yang sering muncul di data BPS: tanda `-` atau `…` untuk data tidak tersedia, koma sebagai desimal, baris total provinsi yang tercampur dengan kabupaten, dan perubahan nama atau pemekaran wilayah.
3. **Dokumentasikan pembersihan** di notebook, simpan CSV bersih.
4. **Bangun dashboard (90 menit)** di Tableau Public atau Looker Studio, dengan isi:
   - kartu skor nilai terbaru untuk provinsi atau wilayah pilihan,
   - grafik garis tren waktu,
   - grafik batang perbandingan antarwilayah di tahun terbaru, diurutkan,
   - kotak teks "Cara membaca indikator ini" untuk pembaca awam,
   - sumber data lengkap dengan tautan dan tanggal unduh.
5. **Tulis README (30 menit)** di folder `02-indikator-daerah/`.

> [!warning] Perhatikan perubahan metode dan definisi
> Beberapa indikator BPS pernah mengalami perubahan metode penghitungan atau perubahan tahun dasar. Angka sebelum dan sesudah perubahan bisa tidak sebanding. Baca catatan di tabel atau metadata, dan sebutkan di dashboard kalau rentang waktu Anda melewati perubahan seperti itu.

> [!tip] Hindari peringkat yang menyesatkan
> Perbedaan kecil antarwilayah, misalnya 0,1 poin persen, bisa saja masih dalam batas ketidakpastian survei. Hindari judul seperti "Kabupaten A terburuk" kalau selisihnya sangat kecil. Tulis lebih netral, misalnya "Lima wilayah dengan TPT tertinggi".

## Yang dikumpulkan

Tautan dashboard (Tableau Public atau Looker Studio) dan tautan folder GitHub berisi notebook pembersihan dan README, ditempel di kolom **Tautan hasil kerja**.
