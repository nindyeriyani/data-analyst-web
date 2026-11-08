## Brief

Sebuah toko buku menjual lewat tiga kanal: situs sendiri, marketplace, dan toko fisik (data rekaan). Manajer ingin memahami penjualan triwulan Juli–September 2026 sebelum menyusun rencana akhir tahun.

Tugas Anda: rumuskan **tiga pertanyaan analisis**, jawab dengan pivot table atau rumus, buat **minimal dua grafik**, lalu tulis **ringkasan temuan** 3–5 kalimat untuk manajer. Rubrik penilaian ada di bawah halaman ini.

## Data

Salin ke sheet `mentah`. Setiap baris adalah satu pesanan, dan `harga_satuan` dalam rupiah. Data ini sengaja belum bersih.

```csv
id_pesanan,tanggal,kota,kategori,kanal,jumlah,harga_satuan
B001,2026-07-01,Surabaya,Bisnis,Marketplace,4,95000
B002,2026-07-03,Medan,Buku anak,Toko fisik,2,55000
B003,2026-07-05,Jakarta,Buku anak,Situs,4,55000
B004,2026-07-05, medan,Bisnis,Toko fisik,2,95000
B005,2026-07-06,Surabaya,Komik,Situs,1,40000
B006,2026-07-06,Bandung,Buku anak,Marketplace,4,55000
B007,2026-07-08,Medan,Komik,Marketplace,2,40000
B008,2026-07-14,Bandung,Komik,Marketplace,1,40000
B009,2026-07-18,Surabaya,Novel,Toko fisik,4,85000
B009,2026-07-18,Surabaya,Novel,Toko fisik,4,85000
B010,2026-07-18,Surabaya,Novel,Marketplace,4,85000
B011,2026-07-21,MEDAN,Buku anak,Marketplace,2,55000
B012,2026-07-23,Surabaya,Komik,Situs,1,40000
B013,2026-07-25,Bandung,Bisnis,Marketplace,1,95000
B014,2026-07-25,Bandung,Komik,Marketplace,3,40000
B015,2026-07-27,Bandung,Bisnis,Toko fisik,2,95000
B016,2026-07-27,Bandung,Bisnis,Toko fisik,1,95000
B017,2026-08-02,Surabaya,Novel,Situs,3,85000
B018,2026-08-02,Surabaya,Buku anak,Marketplace ,3,55000
B019,2026-08-06,Jakarta,Buku anak,Marketplace,4,55000
B020,2026-08-08,Bandung,Novel,Toko fisik,4,85000
B021,2026-08-11,Bandung,Bisnis,Marketplace,1,95000
B022,2026-08-12,Medan,Komik,Toko fisik,2,40000
B023,2026-08-17,Jakarta,Novel,Marketplace,3,Rp 85.000
B024,2026-08-20,Jakarta,Buku anak,Situs,4,55000
B025,2026-08-20,Jakarta,Komik,Marketplace,3,40000
B026,2026-08-22,Jakarta,Buku anak,Marketplace,4,55000
B026,2026-08-22,Jakarta,Buku anak,Marketplace,4,55000
B027,2026-08-25,Jakarta,Novel,Toko fisik,1,85000
B028,2026-08-27,Bandung,Komik,Marketplace,4,40000
B029,2026-09-02,Bandung,Novel,Situs,2,85000
B030,2026-09-05,Surabaya,novel,Toko fisik,4,85000
B031,2026-09-09,Surabaya,Novel,Situs,3,85000
B032,2026-09-20,Medan,Buku anak,Marketplace,1,55000
B033,2026-09-21,Jakarta,Buku anak,Marketplace,4,55000
B034,2026-09-22,Surabaya,Novel,Situs,4,85000
B035,2026-09-22,Jakarta,Novel,Toko fisik,2,85000
B036,2026-09-25,Bandung,Komik,Marketplace,4,40000
```

> [!tip] Boleh memakai data publik lain
> Kalau ingin tantangan lebih, pakai dataset kecil dari BPS (bps.go.id) atau Satu Data Indonesia (data.go.id) dengan topik yang Anda minati, misalnya jumlah penduduk atau indikator pendidikan per kabupaten. Syaratnya sama: tiga pertanyaan, dua grafik, ringkasan, dan catatan pembersihan.

## Langkah

1. **Bersihkan** (30 menit). Terapkan langkah dari lab. Catat setiap masalah dan perbaikannya di sheet `catatan`. Petunjuk: ada duplikat, penulisan kota dan kategori yang tidak seragam, spasi berlebih di kolom kanal, dan satu harga berbentuk teks. Setelah bersih, data berisi 36 pesanan dengan total pendapatan Rp6.535.000. Pakai angka ini untuk memeriksa hasil Anda.
2. **Tambahkan kolom** `pendapatan` (`jumlah × harga_satuan`) dan `bulan`, misalnya dengan `=TEXT(B2; "yyyy-mm")`.
3. **Rumuskan tiga pertanyaan** (15 menit). Contoh:
   - Kategori mana yang menyumbang pendapatan terbesar?
   - Bagaimana tren pendapatan dari Juli ke September?
   - Kanal mana yang paling besar pendapatannya, dan apakah berbeda antarkota?
4. **Jawab** dengan pivot table, satu sheet per pertanyaan (45 menit).
5. **Buat minimal dua grafik** yang sesuai dengan pertanyaannya (30 menit). Beri judul yang menyatakan temuan.
6. **Tulis ringkasan** di sheet `ringkasan` (20 menit): 3–5 kalimat, berisi angka penting dan satu saran.

## Yang dikumpulkan

1. Atur berbagi spreadsheet: **Bagikan**, **Siapa saja yang memiliki link**, **Pelihat** (Viewer).
2. Tempel tautannya di kolom **Tautan hasil kerja** di bawah.
3. Simpan juga tautan ini di README folder proyek GitHub Anda sebagai latihan portofolio.

> [!warning] Periksa sebelum membagikan
> Pastikan spreadsheet hanya berisi data proyek ini. Jangan memakai file yang pernah berisi data kantor, karena riwayat versi Google Sheets bisa menampilkan isi lama.
