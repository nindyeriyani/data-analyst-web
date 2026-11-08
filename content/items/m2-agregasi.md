## Fungsi agregat

Fungsi agregat meringkas banyak baris menjadi satu nilai.

| Fungsi | Arti |
|---|---|
| `COUNT(*)` | banyaknya baris |
| `COUNT(kolom)` | banyaknya baris yang kolomnya tidak kosong |
| `COUNT(DISTINCT kolom)` | banyaknya nilai unik |
| `SUM(kolom)` | jumlah |
| `AVG(kolom)` | rata-rata |
| `MIN(kolom)`, `MAX(kolom)` | terkecil, terbesar (juga untuk tanggal) |

```sql
SELECT COUNT(*) AS pesanan,
       SUM(jumlah) AS eksemplar,
       SUM(jumlah * harga_satuan) AS pendapatan,
       ROUND(AVG(jumlah * harga_satuan)) AS rata_rata_pesanan,
       MIN(tanggal) AS pertama,
       MAX(tanggal) AS terakhir
FROM latihan.penjualan_buku;
```

Hasilnya satu baris: 36 pesanan, 98 eksemplar, pendapatan Rp6.535.000, rata-rata Rp181.528 per pesanan, dari 1 Juli sampai 25 September 2026.

> [!warning] Agregat mengabaikan NULL
> `SUM`, `AVG`, dan `COUNT(kolom)` melewatkan nilai kosong. Rata-rata dari 100, 200, dan NULL adalah 150, bukan 100. Kalau nilai kosong seharusnya dianggap nol, ubah dulu dengan `COALESCE(kolom, 0)`.

## GROUP BY: ringkasan per kelompok

```sql
SELECT kategori,
       COUNT(*) AS pesanan,
       SUM(jumlah) AS eksemplar,
       SUM(jumlah * harga_satuan) AS pendapatan
FROM latihan.penjualan_buku
GROUP BY kategori
ORDER BY pendapatan DESC;
```

| kategori | pesanan | eksemplar | pendapatan |
|---|---|---|---|
| Novel | 11 | 34 | 2.890.000 |
| Buku anak | 10 | 32 | 1.760.000 |
| Bisnis | 6 | 11 | 1.045.000 |
| Komik | 9 | 21 | 840.000 |

Ini sama dengan pivot table berisi kategori di baris dan tiga nilai.

**Aturan GROUP BY:** setiap kolom di `SELECT` harus berupa fungsi agregat atau ikut disebut di `GROUP BY`. `SELECT kategori, kota, SUM(...) ... GROUP BY kategori` akan galat, karena database tidak tahu kota mana yang harus ditampilkan untuk setiap kategori.

Kelompok bisa lebih dari satu kolom: `GROUP BY kota, kanal` menghasilkan satu baris per kombinasi kota dan kanal (11 kombinasi di data ini).

## HAVING: memfilter hasil ringkasan

`WHERE` memfilter **baris sebelum** dikelompokkan. `HAVING` memfilter **kelompok sesudah** diringkas.

```sql
SELECT kota, SUM(jumlah * harga_satuan) AS pendapatan
FROM latihan.penjualan_buku
GROUP BY kota
HAVING SUM(jumlah * harga_satuan) > 1500000
ORDER BY pendapatan DESC;
```

Hasilnya Surabaya (2.495.000), Jakarta (1.730.000), dan Bandung (1.685.000). Medan (625.000) tersaring.

Keduanya bisa dipakai bersama:

```sql
SELECT kota, COUNT(*) AS pesanan_marketplace
FROM latihan.penjualan_buku
WHERE kanal = 'Marketplace'
GROUP BY kota
HAVING COUNT(*) >= 4
ORDER BY pesanan_marketplace DESC;
```

Hasilnya Bandung (7) dan Jakarta (5). Urutan kerjanya: ambil baris Marketplace saja (`WHERE`), kelompokkan per kota, lalu simpan kota yang punya minimal 4 pesanan (`HAVING`).

> [!tip] Cara memilih WHERE atau HAVING
> Tanyakan: "Apakah syarat ini tentang satu baris, atau tentang ringkasan satu kelompok?" Syarat tentang satu baris (kanal, tanggal, kota) masuk `WHERE`. Syarat tentang hasil `COUNT`, `SUM`, atau `AVG` masuk `HAVING`.

## Mengelompokkan per bulan

Di BigQuery, ubah tanggal menjadi bulan dengan `FORMAT_DATE`:

```sql
SELECT FORMAT_DATE('%Y-%m', tanggal) AS bulan,
       SUM(jumlah * harga_satuan) AS pendapatan
FROM latihan.penjualan_buku
GROUP BY bulan
ORDER BY bulan;
```

BigQuery mengizinkan alias `bulan` dipakai di `GROUP BY`. Tidak semua database mengizinkannya. Di database lain, tulis ulang ekspresinya.

## Latihan

1. Berapa banyak pesanan dan total pendapatan per kanal, urut dari pendapatan terbesar?
2. Berapa rata-rata eksemplar per pesanan untuk setiap kategori? Bulatkan dua desimal.
3. Bagaimana pendapatan per bulan dari Juli sampai September?
4. Kota mana yang pernah membeli keempat kategori?

<details><summary>Cek jawaban</summary>

```sql
-- 1
SELECT kanal, COUNT(*) AS pesanan, SUM(jumlah * harga_satuan) AS pendapatan
FROM latihan.penjualan_buku
GROUP BY kanal
ORDER BY pendapatan DESC;
-- Marketplace 18 / 3.055.000; Toko fisik 10 / 1.940.000; Situs 8 / 1.540.000

-- 2
SELECT kategori, ROUND(AVG(jumlah), 2) AS rata_rata_eksemplar
FROM latihan.penjualan_buku
GROUP BY kategori
ORDER BY rata_rata_eksemplar DESC;
-- Buku anak 3,2; Novel 3,09; Komik 2,33; Bisnis 1,83

-- 3
SELECT FORMAT_DATE('%Y-%m', tanggal) AS bulan, SUM(jumlah * harga_satuan) AS pendapatan
FROM latihan.penjualan_buku
GROUP BY bulan
ORDER BY bulan;
-- 2026-07: 2.610.000; 2026-08: 2.215.000; 2026-09: 1.710.000

-- 4
SELECT kota
FROM latihan.penjualan_buku
GROUP BY kota
HAVING COUNT(DISTINCT kategori) = 4;
-- Bandung dan Surabaya
```

Jawaban nomor 3 memperlihatkan pendapatan yang turun setiap bulan. Ini contoh temuan yang perlu diselidiki lebih lanjut, misalnya kategori atau kanal mana yang paling turun.

</details>
