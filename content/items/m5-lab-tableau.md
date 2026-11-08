## Tujuan

Membuat dashboard Tableau pertama dari data toko buku, dengan pesan utama dari bacaan storytelling: **penurunan pendapatan berasal dari marketplace, sementara situs tumbuh**. Lalu mempublikasikannya ke profil Tableau Public Anda.

## Persiapan (15 menit)

1. Pasang **Tableau Desktop Public Edition** (gratis) untuk Mac dari situs Tableau Public, lalu masuk dengan akun Tableau Public yang dibuat di minggu 1.
2. Siapkan `penjualan_buku.csv` dari modul SQL.

> [!warning] Semua yang disimpan ke Tableau Public bersifat publik
> Dokumentasi Tableau menyebutkan bahwa workbook dan data yang disimpan ke profil Tableau Public dapat diakses siapa saja. Hanya pakai data latihan atau data publik. Untuk data yang tidak boleh terbuka, simpan workbook di komputer saja, jangan disimpan ke Tableau Public.

## Langkah 1: hubungkan data (10 menit)

1. Di layar awal, di bagian **Connect**, pilih **Text file**, lalu pilih `penjualan_buku.csv`.
2. Di halaman Data Source, periksa tipe setiap kolom (ikon di atas nama kolom). `tanggal` harus bertipe tanggal, `jumlah` dan `harga_satuan` bertipe angka. Ubah lewat ikon tipe kalau perlu.
3. Klik **Sheet 1** di bawah untuk mulai membuat grafik.

Tableau mungkin menampilkan nama kolom dengan huruf kapital dan spasi, misalnya `Harga Satuan`. Itu hanya tampilan.

## Langkah 2: buat kolom pendapatan (5 menit)

Buka **Analysis**, **Create Calculated Field**. Beri nama `Pendapatan` dan tulis:

```
[Jumlah] * [Harga Satuan]
```

Sesuaikan nama di dalam kurung siku dengan nama kolom yang tampil di panel Data.

## Langkah 3: tiga sheet (40 menit)

**Sheet "Tren per kanal"** (grafik garis)
- Seret `Tanggal` ke Columns. Klik kanan dan pilih tingkat **Month** agar muncul per bulan.
- Seret `Pendapatan` ke Rows.
- Seret `Kanal` ke **Color** di kartu Marks.
- Judul: "Marketplace turun tajam, Situs terus naik".

**Sheet "Kategori"** (batang horizontal)
- `Kategori` ke Rows, `Pendapatan` ke Columns.
- Urutkan menurun dengan tombol urut di toolbar.
- Judul: "Novel menyumbang pendapatan terbesar".

**Sheet "Kota"** (batang horizontal)
- `Kota` ke Rows, `Pendapatan` ke Columns, urutkan menurun.
- Judul yang menyatakan temuan, misalnya tentang Surabaya dan Medan.

Ganti nama setiap sheet dengan klik dua kali pada tab di bawah.

> [!tip] Show Me
> Tombol **Show Me** di kanan atas menyarankan jenis grafik berdasarkan kolom yang dipilih. Berguna untuk mencoba, tetapi tetap pilih grafik berdasarkan pertanyaannya.

## Langkah 4: susun dashboard (20 menit)

1. Klik ikon **New Dashboard** di bawah.
2. Dari daftar **Sheets** di kiri, seret ketiga sheet ke area dashboard. Letakkan "Tren per kanal" di atas karena itu pesan utamanya.
3. Tambahkan objek **Text** di paling atas dengan judul dashboard yang menyatakan temuan, misalnya: "Penjualan triwulan III turun karena marketplace; situs tumbuh pesat".
4. Pilih sheet "Kategori" di dashboard, lalu aktifkan **Use as Filter** di pojok atasnya. Sekarang mengklik satu kategori akan memfilter grafik lain.

## Langkah 5: publikasikan (10 menit)

1. Buka **Server**, **Tableau Public**, **Save to Tableau Public**.
2. Masuk ke akun Tableau Public bila diminta, beri nama workbook, lalu **Save**.
3. Viz terbuka di browser. Salin tautannya.

Proses ini membuat salinan data (extract) yang ikut tersimpan di Tableau Public.

## Hasil lab

- Dashboard berisi tiga grafik, judul yang menyatakan temuan, dan satu filter interaktif.
- Tautan Tableau Public tersimpan di catatan belajar. Dashboard ini bisa dikembangkan menjadi proyek minggu ini.
