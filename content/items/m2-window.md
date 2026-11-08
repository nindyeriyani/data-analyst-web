## Apa bedanya dengan GROUP BY

`GROUP BY` meringkas banyak baris menjadi satu baris per kelompok. **Window function** menghitung sesuatu dari sekumpulan baris terkait, tetapi **tetap mempertahankan setiap baris**. Dengan window function, Anda bisa memberi peringkat, membandingkan dengan periode sebelumnya, dan membuat total berjalan.

Bentuk umumnya:

```sql
FUNGSI() OVER (PARTITION BY kelompok ORDER BY urutan)
```

- `PARTITION BY` membagi baris menjadi kelompok, mirip GROUP BY tetapi tanpa meringkas. Boleh dihilangkan.
- `ORDER BY` di dalam `OVER` menentukan urutan perhitungan di setiap kelompok.

Contoh memakai tabel `latihan.penjualan_buku`.

## ROW_NUMBER: pesanan terbesar di setiap kategori

```sql
WITH berperingkat AS (
  SELECT kategori, id_pesanan,
         jumlah * harga_satuan AS pendapatan,
         ROW_NUMBER() OVER (
           PARTITION BY kategori
           ORDER BY jumlah * harga_satuan DESC, id_pesanan
         ) AS urutan
  FROM latihan.penjualan_buku
)
SELECT kategori, id_pesanan, pendapatan
FROM berperingkat
WHERE urutan = 1
ORDER BY kategori;
```

| kategori | id_pesanan | pendapatan |
|---|---|---|
| Bisnis | B001 | 380.000 |
| Buku anak | B003 | 220.000 |
| Komik | B028 | 160.000 |
| Novel | B009 | 340.000 |

Window function tidak bisa ditulis langsung di `WHERE`, karena `WHERE` dikerjakan sebelum window function dihitung. Karena itu peringkat dihitung dulu di CTE, lalu difilter di query luar.

> [!tip] Seri dan pengurut kedua
> Di Buku anak ada enam pesanan senilai Rp220.000. `ROW_NUMBER` tetap memberi nomor 1 hanya ke satu baris. Tanpa pengurut kedua (`id_pesanan`), baris yang terpilih bisa berbeda setiap kali query dijalankan.

## RANK dan DENSE_RANK

Keduanya memberi peringkat yang sama untuk nilai seri. Bedanya ada pada nomor setelah seri. Contoh untuk kategori Bisnis, diurutkan dari jumlah eksemplar terbanyak:

| id_pesanan | jumlah | ROW_NUMBER | RANK | DENSE_RANK |
|---|---|---|---|---|
| B001 | 4 | 1 | 1 | 1 |
| B004 | 2 | 2 | 2 | 2 |
| B015 | 2 | 3 | 2 | 2 |
| B013 | 1 | 4 | 4 | 3 |
| B016 | 1 | 5 | 4 | 3 |
| B021 | 1 | 6 | 4 | 3 |

`RANK` melompat dari 2 ke 4 karena ada dua baris di peringkat 2. `DENSE_RANK` tidak melompat. Pakai `ROW_NUMBER` kalau butuh tepat satu baris per kelompok, dan `RANK` atau `DENSE_RANK` kalau nilai seri harus diperlakukan sama.

## LAG: membandingkan dengan periode sebelumnya

```sql
WITH per_bulan AS (
  SELECT FORMAT_DATE('%Y-%m', tanggal) AS bulan,
         SUM(jumlah * harga_satuan) AS pendapatan
  FROM latihan.penjualan_buku
  GROUP BY bulan
)
SELECT bulan,
       pendapatan,
       LAG(pendapatan) OVER (ORDER BY bulan) AS bulan_lalu,
       pendapatan - LAG(pendapatan) OVER (ORDER BY bulan) AS selisih,
       ROUND(100 * (pendapatan - LAG(pendapatan) OVER (ORDER BY bulan))
             / LAG(pendapatan) OVER (ORDER BY bulan), 1) AS persen_perubahan
FROM per_bulan
ORDER BY bulan;
```

| bulan | pendapatan | bulan_lalu | selisih | persen_perubahan |
|---|---|---|---|---|
| 2026-07 | 2.610.000 | NULL | NULL | NULL |
| 2026-08 | 2.215.000 | 2.610.000 | -395.000 | -15,1 |
| 2026-09 | 1.710.000 | 2.215.000 | -505.000 | -22,8 |

Bulan pertama tidak punya bulan sebelumnya, sehingga hasilnya NULL. `LEAD` bekerja sebaliknya: mengambil nilai baris berikutnya.

## SUM OVER: total berjalan

```sql
WITH per_bulan AS (
  SELECT FORMAT_DATE('%Y-%m', tanggal) AS bulan,
         SUM(jumlah * harga_satuan) AS pendapatan
  FROM latihan.penjualan_buku
  GROUP BY bulan
)
SELECT bulan, pendapatan,
       SUM(pendapatan) OVER (ORDER BY bulan) AS kumulatif
FROM per_bulan
ORDER BY bulan;
```

Hasil kumulatifnya 2.610.000, lalu 4.825.000, lalu 6.535.000. Total berjalan sering dipakai untuk memantau capaian target sepanjang tahun.

> [!warning] Window function di dalam GROUP BY
> Contoh `LAG` dan `SUM OVER` di atas meringkas per bulan dulu di CTE, baru menghitung window function di query luar. Memisahkan kedua langkah ini membuat query lebih mudah dibaca dan menghindari galat.

## Latihan

1. Tampilkan pesanan pertama (tanggal paling awal) dari setiap kota.
2. Untuk setiap kota, kategori mana yang pendapatannya terbesar?
3. Tampilkan pesanan dari Medan beserta total berjalan pendapatannya, urut tanggal.

<details><summary>Cek jawaban</summary>

```sql
-- 1
WITH urut AS (
  SELECT kota, id_pesanan, tanggal,
         ROW_NUMBER() OVER (PARTITION BY kota ORDER BY tanggal, id_pesanan) AS n
  FROM latihan.penjualan_buku
)
SELECT kota, id_pesanan, tanggal FROM urut WHERE n = 1 ORDER BY kota;
-- Bandung B006 (6 Jul), Jakarta B003 (5 Jul), Medan B002 (3 Jul), Surabaya B001 (1 Jul)

-- 2
WITH per_kota_kategori AS (
  SELECT kota, kategori, SUM(jumlah * harga_satuan) AS pendapatan
  FROM latihan.penjualan_buku
  GROUP BY kota, kategori
),
berperingkat AS (
  SELECT *, RANK() OVER (PARTITION BY kota ORDER BY pendapatan DESC) AS r
  FROM per_kota_kategori
)
SELECT kota, kategori, pendapatan FROM berperingkat WHERE r = 1 ORDER BY kota;
-- Bandung: Novel 510.000; Jakarta: Buku anak 1.100.000;
-- Medan: Buku anak 275.000; Surabaya: Novel 1.870.000

-- 3
SELECT id_pesanan, tanggal,
       jumlah * harga_satuan AS pendapatan,
       SUM(jumlah * harga_satuan) OVER (ORDER BY tanggal, id_pesanan) AS kumulatif
FROM latihan.penjualan_buku
WHERE kota = 'Medan'
ORDER BY tanggal, id_pesanan;
-- 110.000 → 300.000 → 380.000 → 490.000 → 570.000 → 625.000
```

</details>
