## Brief

Anda data analyst di toko pakaian daring theLook. Tim pemasaran bertanya:

1. **Siapa pelanggan terbaik kita, dan siapa yang mulai menjauh?** (RFM)
2. **Apakah pelanggan baru kembali belanja, dan bagaimana tren retensinya?** (kohort)
3. **Apa yang sebaiknya dilakukan?** (minimal tiga rekomendasi)

Kerjakan di BigQuery, visualisasikan di Tableau Public, lalu dokumentasikan di GitHub. Proyek ini mengembangkan proyek SQL minggu 4 di folder `01-thelook-ecommerce/`.

## Ruang lingkup (tulis di README sebelum mulai)

- **Rentang waktu:** satu tahun kalender penuh yang sudah lewat, sama dengan proyek SQL.
- **Definisi pesanan terjual:** status yang dihitung, misalnya hanya yang selesai.
- **Tanggal acuan recency:** sehari setelah akhir rentang waktu.
- **Satuan:** pelanggan = `user_id`; pesanan = `order_id`; nilai = `sale_price`.

## Kerangka query RFM

```sql
WITH item_terjual AS (
  SELECT user_id, order_id, DATE(created_at) AS tanggal, sale_price
  FROM `bigquery-public-data.thelook_ecommerce.order_items`
  WHERE status = 'Complete'          -- sesuaikan dengan definisi Anda
    AND created_at >= '2025-01-01'   -- sesuaikan rentang waktu
    AND created_at <  '2026-01-01'
),
rfm AS (
  SELECT
    user_id,
    DATE_DIFF(DATE '2026-01-01', MAX(tanggal), DAY) AS recency_hari,
    COUNT(DISTINCT order_id) AS frequency,
    ROUND(SUM(sale_price), 2) AS monetary
  FROM item_terjual
  GROUP BY user_id
)
SELECT
  *,
  NTILE(5) OVER (ORDER BY recency_hari DESC) AS r,
  NTILE(5) OVER (ORDER BY monetary) AS m
FROM rfm;
```

Lanjutkan sendiri: tentukan skor F, aturan segmen dengan CASE, lalu ringkas per segmen (banyak pelanggan, total dan rata-rata nilai belanja).

> [!tip] Frequency di e-commerce sering bernilai 1
> Kalau sebagian besar pelanggan hanya belanja sekali, `NTILE(5)` pada frequency membagi pelanggan dengan nilai yang sama ke kelompok berbeda secara acak. Lebih masuk akal memakai ambang, misalnya 1 pesanan, 2 pesanan, dan 3 pesanan atau lebih. Cek dulu sebarannya dengan `SELECT frequency, COUNT(*) FROM rfm GROUP BY frequency`.

## Kerangka query kohort

Pakai pola dari bacaan kohort, dengan `user_id` dan `created_at`:

```sql
WITH item_terjual AS (
  SELECT user_id, DATE(created_at) AS tanggal
  FROM `bigquery-public-data.thelook_ecommerce.order_items`
  WHERE status = 'Complete'
),
pertama AS (
  SELECT user_id, DATE_TRUNC(MIN(tanggal), MONTH) AS kohort
  FROM item_terjual
  GROUP BY user_id
),
aktif AS (
  SELECT DISTINCT user_id, DATE_TRUNC(tanggal, MONTH) AS bulan
  FROM item_terjual
)
-- lanjutkan: JOIN, DATE_DIFF(..., MONTH), hitung pelanggan dan retensi per kohort
SELECT ...
```

Batasi kohort ke rentang waktu Anda (misalnya kohort Januari–Desember 2025), dan tampilkan maksimal 6–12 bulan ke depan agar tabelnya terbaca.

> [!warning] Kohort pertama yang terpotong
> Kalau `pertama` dihitung hanya dari data dalam rentang waktu, pelanggan yang sebenarnya sudah belanja sebelum rentang itu akan terhitung sebagai pelanggan baru. Hitung bulan pertama dari seluruh data (seperti kerangka di atas, tanpa filter tanggal di `item_terjual`), lalu filter kohort yang ditampilkan.

## Dashboard Tableau Public

1. Simpan hasil ringkasan dari BigQuery ke CSV: (a) ringkasan per segmen RFM, (b) tabel retensi kohort (kohort, bulan_ke, ukuran, retensi).
2. Bangun dashboard berisi:
   - judul yang menyatakan temuan utama,
   - kartu skor: banyak pelanggan, porsi pendapatan dari segmen terbaik,
   - grafik batang segmen RFM (banyak pelanggan dan total nilai belanja),
   - heatmap retensi kohort,
   - catatan sumber, rentang waktu, dan definisi.

## Rekomendasi

Tulis minimal tiga rekomendasi yang **didukung angka dari analisis Anda**. Pola yang baik:

> "Segmen Berisiko hilang berisi X pelanggan yang dulu belanja rata-rata Y kali tetapi tidak kembali dalam Z hari terakhir. Kirim penawaran khusus untuk mereka, dan ukur keberhasilannya dengan A/B test (sebagian menerima penawaran, sebagian tidak)."

## README

Struktur yang disarankan:

1. **Ringkasan** (3–5 kalimat di paling atas): pertanyaan, temuan utama, rekomendasi utama, tautan dashboard.
2. **Data dan ruang lingkup**: dataset, rentang waktu, definisi.
3. **Metode**: aturan skor dan segmen RFM, definisi kohort dan retensi.
4. **Temuan**: tabel kecil dan tangkapan layar dashboard, dengan interpretasi.
5. **Rekomendasi.**
6. **Keterbatasan**: data rekaan, definisi yang dipilih, hal yang tidak dianalisis.
7. **Query**: tautan ke file `.sql` di folder `sql/`.

## Yang dikumpulkan

Tautan ke folder `01-thelook-ecommerce` di GitHub (README berisi tautan dashboard), ditempel di kolom **Tautan hasil kerja**.
