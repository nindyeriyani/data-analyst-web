## Situasi

Sebuah kedai kopi dengan tiga cabang mengirim rekap transaksi minggu pertama November yang dikumpulkan dari tiga kasir berbeda (data rekaan). Pemiliknya bertanya: **berapa total penjualan setiap cabang?** Datanya berantakan. Tugas Anda adalah merapikannya dulu, baru menjawab.

## Data mentah

Buat spreadsheet baru bernama `Lab pembersihan`, beri nama sheet pertama `mentah`, lalu tempel data ini di A1. Pisahkan menjadi kolom kalau perlu, lewat menu **Data** (Split text to columns).

```csv
id_transaksi,tanggal,kota,produk,jumlah,harga
T001,2026-11-02,Bandung,Kopi susu,2,25000
T002,03/11/2026, bandung ,Americano,1,22000
T003,4 Nov 2026,SURABAYA,Kopi susu,3,25000
T004,2026-11-04,Surabaya,Teh tarik,2,18000
T004,2026-11-04,Surabaya,Teh tarik,2,18000
T005,05/11/2026,Medan,Americano,1,Rp 22.000
T006,2026-11-05,medan,Kopi susu,4,25000
T007,6 Nov 2026,Bandung,Teh tarik,,18000
T008,2026-11-07,Bandung ,Kopi susu,1,Rp 25.000
T009,07/11/2026,Surabaya,Americano,2,22000
T009,07/11/2026,Surabaya,Americano,2,22000
T010,2026-11-08,Medan,Teh tarik,3,18000
T011,08/11/2026,BANDUNG,Americano,2,22000
T012,9 Nov 2026,Surabaya,Kopi susu,1,25000
```

> [!tip] Jangan mengubah data mentah
> Gandakan sheet `mentah` (klik kanan pada tab, **Duplikat**), lalu beri nama `bersih`. Semua perbaikan dilakukan di `bersih`. Kalau ada langkah yang keliru, data aslinya masih ada.

## Langkah 1: kenali masalahnya (15 menit)

Sebelum memperbaiki apa pun, tulis daftar masalah yang Anda lihat di sheet baru bernama `catatan`. Coba temukan sendiri dulu, lalu bandingkan dengan daftar di bawah.

<details><summary>Daftar masalah</summary>

1. Dua baris duplikat persis: T004 dan T009.
2. Penulisan kota tidak seragam: spasi di depan atau belakang (` bandung `, `Bandung `) dan huruf kapital berbeda (`SURABAYA`, `medan`, `BANDUNG`).
3. Tiga format tanggal: `2026-11-02`, `03/11/2026`, dan `4 Nov 2026`.
4. Dua harga tersimpan sebagai teks dengan "Rp" dan titik ribuan: T005 dan T008.
5. Satu jumlah kosong: T007.

</details>

## Langkah 2: hapus duplikat (10 menit)

Di sheet `bersih`, pilih seluruh data lalu buka **Data**, **Pembersihan data** (Data cleanup), **Hapus duplikat** (Remove duplicates). Centang **Data memiliki baris header**. Google Sheets akan melaporkan 2 baris duplikat dihapus, sehingga tersisa 12 transaksi.

> [!warning] Duplikat yang tidak persis sama
> Fitur ini hanya menghapus baris yang identik di semua kolom. Di data sungguhan, dua baris dengan `id_transaksi` sama tetapi isi berbeda juga perlu diperiksa. Cek dengan `=COUNTIF(A:A; A2)>1` di kolom bantu.

## Langkah 3: seragamkan kota (15 menit)

1. Buka **Data**, **Pembersihan data**, **Pangkas spasi kosong** (Trim whitespace), atau pakai rumus `=TRIM(C2)`.
2. Di kolom bantu, tulis `=PROPER(TRIM(C2))`, tarik ke bawah, lalu salin dan **tempel nilai saja** (Paste values only, Cmd + Shift + V) ke kolom C.
3. Periksa dengan `=UNIQUE(C2:C13)`. Hasilnya harus tepat tiga kota: Bandung, Surabaya, Medan.

## Langkah 4: seragamkan tanggal (15 menit)

1. Di kolom bantu, tulis `=ISNUMBER(B2)` dan tarik ke bawah. `TRUE` berarti Google Sheets sudah mengenali sel itu sebagai tanggal.
2. Untuk sel yang `FALSE`, ketik ulang tanggalnya dalam format `2026-11-04`. Dengan data sekecil ini, mengetik ulang lebih cepat dan lebih pasti daripada rumus.
3. Pilih kolom B, lalu **Format**, **Angka**, **Format tanggal dan waktu kustom**, dan pilih pola tahun-bulan-hari agar semua tampil seperti `2026-11-02`.
4. Pastikan setiap tanggal masuk akal: semuanya harus antara 2 dan 9 November 2026.

> [!warning] 03/11/2026 itu 3 November atau 11 Maret?
> Tergantung lokal. Dengan lokal Indonesia artinya 3 November, dengan lokal Amerika artinya 11 Maret. Konteks data ini adalah minggu pertama November, jadi 3 November yang benar. Selalu periksa tanggal yang hasilnya di luar rentang yang wajar.

## Langkah 5: ubah harga menjadi angka (10 menit)

Coba dulu `=SUM(F2:F13)` sebelum memperbaiki apa pun. Hasilnya **220000**, padahal seharusnya **267000**. Dua harga teks diabaikan tanpa pesan galat. Inilah alasan langkah pembersihan itu penting.

Perbaiki dengan kolom bantu:

```
=VALUE(SUBSTITUTE(SUBSTITUTE(F2; "Rp"; ""); "."; ""))
```

Tempel nilai saja ke kolom F, lalu cek lagi dengan `=SUM(F2:F13)`. Hasilnya harus 267000.

## Langkah 6: putuskan nilai kosong (5 menit)

T007 tidak punya jumlah. Ada tiga pilihan: tanyakan ke kasir, isi dengan perkiraan, atau keluarkan dari perhitungan. Menebak angka penjualan tidak bisa dipertanggungjawabkan. Untuk lab ini, **biarkan kosong, jangan ikutkan dalam total**, lalu tulis keputusan itu di sheet `catatan`.

## Langkah 7: hitung dan jawab (20 menit)

1. Tambahkan kolom G `total` dengan rumus `=IF(E2=""; ""; E2*F2)`.
2. Buat pivot table: Baris `kota`, Nilai `total` dengan SUM.
3. Tulis jawaban untuk pemilik kedai dalam dua atau tiga kalimat di sheet `catatan`.

<details><summary>Cek jawaban</summary>

Data bersih (12 transaksi):

```csv
id_transaksi,tanggal,kota,produk,jumlah,harga,total
T001,2026-11-02,Bandung,Kopi susu,2,25000,50000
T002,2026-11-03,Bandung,Americano,1,22000,22000
T003,2026-11-04,Surabaya,Kopi susu,3,25000,75000
T004,2026-11-04,Surabaya,Teh tarik,2,18000,36000
T005,2026-11-05,Medan,Americano,1,22000,22000
T006,2026-11-05,Medan,Kopi susu,4,25000,100000
T007,2026-11-06,Bandung,Teh tarik,,18000,
T008,2026-11-07,Bandung,Kopi susu,1,25000,25000
T009,2026-11-07,Surabaya,Americano,2,22000,44000
T010,2026-11-08,Medan,Teh tarik,3,18000,54000
T011,2026-11-08,Bandung,Americano,2,22000,44000
T012,2026-11-09,Surabaya,Kopi susu,1,25000,25000
```

Total penjualan per cabang:

| kota | total |
|---|---|
| Bandung | 141.000 |
| Medan | 176.000 |
| Surabaya | 180.000 |
| **Total** | **497.000** |

Contoh jawaban: "Selama 2–9 November, Surabaya mencatat penjualan tertinggi, Rp180.000, disusul Medan Rp176.000 dan Bandung Rp141.000, dengan total Rp497.000. Satu transaksi Teh tarik di Bandung (T007) tidak tercatat jumlahnya sehingga belum masuk total; mohon dicek ke kasir. Dua transaksi tercatat ganda dan sudah dihapus."

Bonus: produk terlaris berdasarkan jumlah cangkir adalah Kopi susu (11), lalu Americano (6) dan Teh tarik (5, belum termasuk T007).

</details>

## Hasil lab

- Spreadsheet `Lab pembersihan` dengan sheet `mentah`, `bersih`, dan `catatan`.
- Sheet `catatan` berisi daftar masalah, langkah perbaikan, keputusan untuk T007, dan jawaban untuk pemilik kedai.

Kebiasaan mencatat langkah pembersihan ini akan dinilai di proyek mini minggu ini.
