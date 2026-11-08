## Tentang theLook

`thelook_ecommerce` adalah dataset publik BigQuery berisi data toko pakaian daring fiktif buatan Google: pengguna, pesanan, item pesanan, produk, stok, pusat distribusi, dan aktivitas di situs. Datanya rekaan tetapi strukturnya realistis, sehingga cocok untuk portofolio. Dataset ini dipakai untuk proyek SQL minggu ini dan proyek portofolio pertama di minggu 9–10.

Tabel di dataset ini:

| Tabel | Isi |
|---|---|
| `users` | pengguna atau pelanggan |
| `orders` | pesanan (satu baris per pesanan) |
| `order_items` | item di dalam pesanan (satu baris per barang) |
| `products` | katalog produk |
| `inventory_items` | stok barang |
| `distribution_centers` | pusat distribusi |
| `events` | aktivitas pengunjung di situs |

## Langkah 1: buka dataset (10 menit)

1. Buka tautan theLook di kartu di bawah halaman ini, lalu pilih **View dataset**. BigQuery terbuka dengan project `bigquery-public-data` di panel Explorer.
2. Kalau tidak muncul, di Explorer klik **Add**, lalu cari dan tandai project `bigquery-public-data` dengan bintang.
3. Buka `bigquery-public-data`, lalu `thelook_ecommerce`. Klik tabel `order_items`, lalu lihat tab **Schema** (kolom dan tipenya) dan **Preview** (contoh isi).

> [!tip] Preview gratis, LIMIT tidak menghemat
> Tab **Preview** menampilkan contoh baris tanpa memakai kuota query. Sebaliknya, `SELECT * ... LIMIT 10` tetap memindai seluruh kolom yang disebut, karena `LIMIT` baru diterapkan di akhir. Di BigQuery, kuota dihemat dengan menyebut kolom yang dibutuhkan saja, bukan dengan `LIMIT`.

## Langkah 2: baca skema dengan SQL (10 menit)

```sql
SELECT table_name, column_name, data_type
FROM `bigquery-public-data.thelook_ecommerce.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name IN ('orders', 'order_items', 'products', 'users')
ORDER BY table_name, ordinal_position;
```

Simpan hasilnya (misalnya ke Google Sheets lewat **Save results**). Ini peta kolom Anda untuk lab dan proyek. Kalau ada nama kolom di query bawah yang berbeda dari skema ini, ikuti skemanya.

Perhatikan hubungan antartabel:

- `order_items.order_id` merujuk ke `orders.order_id`
- `order_items.product_id` merujuk ke `products.id`
- `order_items.user_id` dan `orders.user_id` merujuk ke `users.id`

## Langkah 3: query pertama (15 menit)

Berapa pesanan untuk setiap status?

```sql
SELECT status, COUNT(*) AS banyak_pesanan
FROM `bigquery-public-data.thelook_ecommerce.orders`
GROUP BY status
ORDER BY banyak_pesanan DESC;
```

Sebelum menekan **Run**, lihat tulisan di kanan atas editor, misalnya "This query will process … when run". Biasakan memeriksanya sebelum menjalankan query.

Catat nilai-nilai `status` yang muncul. Nilai ini dipakai untuk memfilter pesanan yang benar-benar terjual.

## Langkah 4: JOIN pertama (15 menit)

Kategori produk mana yang menghasilkan pendapatan terbesar?

```sql
SELECT p.category,
       COUNT(*) AS item_terjual,
       ROUND(SUM(oi.sale_price), 2) AS pendapatan
FROM `bigquery-public-data.thelook_ecommerce.order_items` AS oi
JOIN `bigquery-public-data.thelook_ecommerce.products` AS p
  ON oi.product_id = p.id
WHERE oi.status = 'Complete'  -- sesuaikan dengan nilai status dari langkah 3
GROUP BY p.category
ORDER BY pendapatan DESC
LIMIT 10;
```

Tulis satu kalimat interpretasi di catatan Anda, misalnya "Kategori X menyumbang pendapatan terbesar, sekitar Y dari total item yang selesai."

> [!warning] Angka Anda bisa berbeda dari orang lain
> Data theLook bisa berubah dari waktu ke waktu, dan hasilnya bergantung pada kapan query dijalankan. Karena itu kunci jawaban di kursus ini berisi query, bukan angka. Untuk proyek, tentukan rentang tanggal tetap dan tuliskan di README.

## Langkah 5: pelanggan (10 menit)

Dari mana pengguna datang, dan di negara mana?

```sql
SELECT country, traffic_source, COUNT(*) AS pengguna
FROM `bigquery-public-data.thelook_ecommerce.users`
GROUP BY country, traffic_source
ORDER BY pengguna DESC
LIMIT 15;
```

## Hasil lab

- Hasil query skema tersimpan.
- Query langkah 3–5 tersimpan di repositori GitHub, di file `01-thelook-ecommerce/lab-awal.sql`, masing-masing dengan komentar satu baris yang menjelaskan pertanyaannya.
- Tiga kalimat interpretasi di catatan belajar.
