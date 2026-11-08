## Bentuk dasar query

```sql
SELECT kolom1, kolom2
FROM dataset.tabel
WHERE syarat
ORDER BY kolom
LIMIT jumlah;
```

Bacanya: ambil kolom ini, dari tabel itu, hanya baris yang memenuhi syarat, urutkan, lalu batasi jumlahnya. Semua contoh memakai tabel `latihan.penjualan_buku` dari pengantar modul.

## SELECT dan FROM

```sql
SELECT id_pesanan, tanggal, kota, kategori
FROM latihan.penjualan_buku;
```

- `SELECT *` mengambil semua kolom. Nyaman untuk melihat isi tabel kecil, tetapi di BigQuery biaya dan kuota dihitung dari kolom yang dipindai. Biasakan menyebut kolom yang dibutuhkan saja.
- Kolom bisa dihitung dan diberi nama baru dengan `AS`:

```sql
SELECT id_pesanan, jumlah, harga_satuan,
       jumlah * harga_satuan AS pendapatan
FROM latihan.penjualan_buku;
```

- `SELECT DISTINCT kanal` menampilkan nilai unik: Marketplace, Situs, Toko fisik.

## WHERE: memfilter baris

```sql
SELECT id_pesanan, tanggal, kota, kategori
FROM latihan.penjualan_buku
WHERE kota = 'Bandung' AND kategori = 'Bisnis'
ORDER BY tanggal;
```

Hasilnya empat pesanan: B013, B015, B016, dan B021.

| Operator | Contoh | Arti |
|---|---|---|
| `=`, `<>` | `kanal <> 'Situs'` | sama, tidak sama |
| `>`, `>=`, `<`, `<=` | `jumlah >= 3` | perbandingan |
| `IN` | `kota IN ('Medan', 'Jakarta')` | salah satu dari daftar |
| `BETWEEN` | `tanggal BETWEEN '2026-08-01' AND '2026-08-15'` | di antara, kedua batas ikut |
| `LIKE` | `kategori LIKE 'Buku%'` | pola teks, `%` berarti karakter apa saja |
| `IS NULL` | `kanal IS NULL` | nilai kosong |

> [!warning] AND dikerjakan lebih dulu daripada OR
> `WHERE kota = 'Medan' OR kota = 'Jakarta' AND kanal = 'Situs'` artinya semua pesanan Medan, ditambah pesanan Jakarta lewat situs. Kalau maksudnya "Medan atau Jakarta, lewat situs", pakai kurung: `WHERE (kota = 'Medan' OR kota = 'Jakarta') AND kanal = 'Situs'`, atau lebih ringkas `WHERE kota IN ('Medan', 'Jakarta') AND kanal = 'Situs'`.

Teks ditulis dengan tanda kutip tunggal (`'Bandung'`), dan perbandingan teks di BigQuery peka huruf besar-kecil: `'bandung'` tidak sama dengan `'Bandung'`.

## ORDER BY dan LIMIT

```sql
SELECT id_pesanan, kota, kategori,
       jumlah * harga_satuan AS pendapatan
FROM latihan.penjualan_buku
ORDER BY pendapatan DESC, id_pesanan
LIMIT 5;
```

`DESC` mengurutkan dari besar ke kecil, `ASC` (bawaan) dari kecil ke besar. Hasilnya B001 (Rp380.000), lalu B009, B010, B020, dan B030 (masing-masing Rp340.000).

> [!tip] Hati-hati dengan nilai seri
> Sebenarnya ada lima pesanan senilai Rp340.000; B034 juga. Dengan `LIMIT 5`, hanya empat yang tampil, dan tanpa pengurut kedua (`id_pesanan`), yang terpotong bisa berbeda setiap kali query dijalankan. Tambahkan pengurut kedua agar hasilnya selalu sama, dan periksa apakah ada nilai seri di batas potongan.

## Urutan penulisan dan urutan kerja

Urutan **penulisan** selalu: `SELECT`, `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`. Database **mengerjakannya** dengan urutan lain: `FROM`, lalu `WHERE`, `GROUP BY`, `HAVING`, `SELECT`, `ORDER BY`, `LIMIT`.

Akibatnya: nama alias dari `SELECT` (misalnya `pendapatan`) bisa dipakai di `ORDER BY`, tetapi tidak bisa dipakai di `WHERE`. Di `WHERE`, tulis ulang rumusnya: `WHERE jumlah * harga_satuan > 300000`.

## Latihan

1. Tampilkan pesanan Komik dengan jumlah minimal 3 eksemplar, urut dari tanggal paling awal.
2. Tampilkan tiga pesanan lewat kanal Situs dengan pendapatan terbesar.
3. Berapa pesanan lewat Toko fisik yang bukan dari Jakarta?

<details><summary>Cek jawaban</summary>

```sql
-- 1
SELECT id_pesanan, tanggal, jumlah
FROM latihan.penjualan_buku
WHERE kategori = 'Komik' AND jumlah >= 3
ORDER BY tanggal;
-- B014 (3), B025 (3), B028 (4), B036 (4)

-- 2
SELECT id_pesanan, kota, jumlah * harga_satuan AS pendapatan
FROM latihan.penjualan_buku
WHERE kanal = 'Situs'
ORDER BY pendapatan DESC, id_pesanan
LIMIT 3;
-- B034 (340.000), B017 (255.000), B031 (255.000)

-- 3
SELECT COUNT(*) AS banyak
FROM latihan.penjualan_buku
WHERE kanal = 'Toko fisik' AND kota <> 'Jakarta';
-- 8
```

`COUNT(*)` dibahas lebih lengkap di bacaan agregasi.

</details>
