## Brief

Anda bergabung sebagai data analyst di toko pakaian daring theLook. Manajer meminta gambaran penjualan, produk, dan pelanggan untuk satu tahun kalender penuh. Jawab dengan SQL di BigQuery, lalu simpan query dan temuan Anda di GitHub.

Proyek ini juga menjadi fondasi proyek portofolio pertama di minggu 9–10, jadi kerjakan dengan rapi.

## Persiapan (20 menit)

1. Tentukan rentang waktu. Cek dulu rentang data:

```sql
SELECT MIN(created_at) AS awal, MAX(created_at) AS akhir
FROM `bigquery-public-data.thelook_ecommerce.orders`;
```

   Pilih satu tahun kalender penuh yang sudah lewat, lalu tulis di README. Semua query memakai rentang yang sama, misalnya `WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01'`.
2. Tentukan apa yang dimaksud "terjual" berdasarkan nilai `status` yang Anda lihat di lab, misalnya hanya item yang selesai. Tulis keputusan ini di README.

## Pertanyaan

Tulis **minimal lima pertanyaan bisnis sebelum menulis query apa pun**. Contoh yang bisa dipilih atau diadaptasi:

1. Bagaimana pendapatan dan banyak pesanan per bulan sepanjang tahun?
2. Kategori produk mana yang menyumbang pendapatan terbesar, dan berapa persen dari total?
3. Lima produk mana yang paling laku di setiap kategori? *(window function)*
4. Bagaimana pertumbuhan pendapatan bulan ke bulan dalam persen? *(LAG)*
5. Dari sumber kunjungan mana (`traffic_source`) pelanggan dengan pendapatan terbesar datang? *(JOIN dengan users)*
6. Berapa persen item yang dikembalikan, per kategori?

## Syarat teknis

Sesuai rubrik, kumpulan query Anda harus memakai:

- `JOIN` dan `GROUP BY`,
- minimal satu `CTE` (`WITH`),
- minimal satu window function (`ROW_NUMBER`, `RANK`, `LAG`, atau `SUM OVER`).

Setiap hasil query disertai interpretasi satu atau dua kalimat. Interpretasi menjelaskan arti angkanya, bukan mengulang angkanya.

| Kurang | Lebih baik |
|---|---|
| "Pendapatan Januari 120.000." | "Pendapatan Januari terendah sepanjang tahun, sekitar 30% di bawah rata-rata bulanan, lalu naik stabil sampai Desember." |

## Struktur di GitHub

```
01-thelook-ecommerce/
  README.md
  sql/
    01-pendapatan-bulanan.sql
    02-kategori-teratas.sql
    03-produk-teratas-per-kategori.sql
    04-pertumbuhan-bulanan.sql
    05-sumber-pelanggan.sql
```

Setiap file `.sql` dimulai dengan komentar pertanyaannya:

```sql
-- Pertanyaan: Kategori mana yang menyumbang pendapatan terbesar di tahun 2025?
-- Catatan: hanya item berstatus selesai; pendapatan = sale_price.
WITH item_terjual AS (
  ...
)
SELECT ...
```

README berisi: tujuan, sumber data dan rentang waktu, definisi yang dipakai (misalnya arti "terjual"), lalu setiap pertanyaan dengan ringkasan hasil (tabel kecil atau angka kunci) dan interpretasinya.

> [!tip] Hemat kuota
> Sebut kolom yang dibutuhkan saja, filter rentang tanggal sedini mungkin di CTE pertama, dan cek perkiraan data yang diproses sebelum menekan Run. Query untuk proyek ini biasanya hanya memproses puluhan MB, jauh di bawah kuota 1 TB per bulan.

> [!warning] Periksa JOIN yang menggandakan baris
> `orders` berisi satu baris per pesanan, sedangkan `order_items` satu baris per barang. Kalau Anda menjumlahkan kolom dari `orders` setelah JOIN dengan `order_items`, angkanya akan berlipat. Hitung di tabel yang tepat, atau ringkas dulu di CTE.

## Yang dikumpulkan

Tautan ke folder `01-thelook-ecommerce` di repositori GitHub Anda, ditempel di kolom **Tautan hasil kerja**.
