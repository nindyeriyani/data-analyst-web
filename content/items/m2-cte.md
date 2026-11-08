## Kenapa perlu menyusun query bertahap

Pertanyaan seperti "berapa persen pendapatan yang disumbang setiap kota?" butuh dua langkah: hitung pendapatan per kota, lalu bagi dengan total. Ada tiga alat untuk menyusun langkah seperti ini: subquery, CTE, dan CASE.

Contoh memakai tabel `latihan.penjualan_buku`.

## Subquery

Subquery adalah query di dalam query. Contoh: pesanan yang pendapatannya di atas rata-rata.

```sql
SELECT id_pesanan, jumlah * harga_satuan AS pendapatan
FROM latihan.penjualan_buku
WHERE jumlah * harga_satuan > (
  SELECT AVG(jumlah * harga_satuan) FROM latihan.penjualan_buku
);
```

Rata-ratanya sekitar Rp181.528, dan ada **17** pesanan di atasnya. Subquery dalam kurung dijalankan dulu, lalu hasilnya dipakai sebagai angka pembanding.

## CTE dengan WITH

CTE (common table expression) memberi nama pada setiap langkah, sehingga query dibaca dari atas ke bawah seperti resep.

```sql
WITH per_kota AS (
  SELECT kota, SUM(jumlah * harga_satuan) AS pendapatan
  FROM latihan.penjualan_buku
  GROUP BY kota
),
total AS (
  SELECT SUM(pendapatan) AS semua FROM per_kota
)
SELECT kota,
       pendapatan,
       ROUND(100 * pendapatan / semua, 1) AS persen
FROM per_kota
CROSS JOIN total
ORDER BY pendapatan DESC;
```

| kota | pendapatan | persen |
|---|---|---|
| Surabaya | 2.495.000 | 38,2 |
| Jakarta | 1.730.000 | 26,5 |
| Bandung | 1.685.000 | 25,8 |
| Medan | 625.000 | 9,6 |

`CROSS JOIN total` menempelkan satu baris `total` ke setiap baris `per_kota`, sehingga angka `semua` tersedia di setiap baris.

> [!tip] Bangun CTE selangkah demi selangkah
> Tulis CTE pertama, lalu jalankan dengan `SELECT * FROM per_kota` di bagian akhir untuk memastikan hasilnya benar. Baru tambahkan CTE berikutnya. Kalau ada galat, Anda tahu persis langkah mana yang salah.

## CASE: membuat kategori

`CASE` bekerja seperti IF bertingkat di spreadsheet.

```sql
SELECT
  CASE
    WHEN jumlah * harga_satuan >= 300000 THEN 'Besar'
    WHEN jumlah * harga_satuan >= 150000 THEN 'Sedang'
    ELSE 'Kecil'
  END AS ukuran_pesanan,
  COUNT(*) AS pesanan,
  SUM(jumlah * harga_satuan) AS pendapatan
FROM latihan.penjualan_buku
GROUP BY ukuran_pesanan
ORDER BY pendapatan DESC;
```

| ukuran_pesanan | pesanan | pendapatan |
|---|---|---|
| Sedang | 16 | 3.290.000 |
| Besar | 6 | 2.080.000 |
| Kecil | 14 | 1.165.000 |

Syarat dibaca dari atas ke bawah, dan yang pertama terpenuhi yang dipakai. Karena itu urutkan dari batas tertinggi ke terendah.

CASE juga berguna di dalam fungsi agregat untuk membuat kolom seperti pivot table:

```sql
SELECT kanal,
       SUM(CASE WHEN kategori = 'Novel' THEN jumlah * harga_satuan ELSE 0 END) AS pendapatan_novel,
       SUM(jumlah * harga_satuan) AS pendapatan_total
FROM latihan.penjualan_buku
GROUP BY kanal
ORDER BY kanal;
```

> [!warning] Lupa ELSE
> Tanpa `ELSE`, baris yang tidak memenuhi syarat mana pun bernilai NULL. Di dalam `SUM` biasanya tidak masalah, tetapi sebagai label kategori, NULL membuat kelompok "kosong" yang membingungkan.

## Latihan

1. Dengan CTE, tampilkan kota yang banyak pesanannya di atas rata-rata banyak pesanan per kota.
2. Dari query pivot dengan CASE di atas, berapa pendapatan Novel di setiap kanal? Kanal mana yang paling bergantung pada Novel?

<details><summary>Cek jawaban</summary>

```sql
-- 1
WITH per_kota AS (
  SELECT kota, COUNT(*) AS pesanan
  FROM latihan.penjualan_buku
  GROUP BY kota
)
SELECT kota, pesanan
FROM per_kota
WHERE pesanan > (SELECT AVG(pesanan) FROM per_kota);
-- Rata-rata 9 pesanan per kota. Bandung (11) dan Surabaya (10).
```

2. Marketplace 595.000 dari 3.055.000; Situs 1.020.000 dari 1.540.000; Toko fisik 1.275.000 dari 1.940.000. Situs paling bergantung pada Novel: sekitar dua pertiga pendapatannya (66%) berasal dari Novel.

</details>
