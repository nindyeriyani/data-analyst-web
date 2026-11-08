## Apa itu RFM

RFM mengelompokkan pelanggan berdasarkan perilaku belanjanya, dengan tiga ukuran:

| Ukuran | Pertanyaan | Cara hitung |
|---|---|---|
| **R**ecency | Kapan terakhir belanja? | Jumlah hari dari belanja terakhir sampai tanggal acuan. Makin kecil makin baik |
| **F**requency | Seberapa sering belanja? | Banyaknya pesanan |
| **M**onetary | Berapa banyak uang yang dibelanjakan? | Total nilai belanja |

Hasilnya dipakai untuk memperlakukan pelanggan secara berbeda: berterima kasih kepada pelanggan terbaik, menyapa kembali yang mulai menjauh, dan membantu pelanggan baru agar belanja lagi.

## Data latihan

Transaksi rekaan 10 pelanggan sebuah toko daring, Januari–Juni 2026. Unggah ke BigQuery sebagai tabel `latihan.transaksi` (dengan cara yang sama seperti `penjualan_buku` di modul SQL).

```csv
id_pelanggan,tanggal,nilai
P01,2026-01-05,150000
P01,2026-02-10,200000
P01,2026-03-12,180000
P01,2026-05-20,220000
P01,2026-06-25,250000
P02,2026-01-15,90000
P02,2026-02-20,60000
P03,2026-01-20,500000
P03,2026-04-02,450000
P03,2026-06-18,600000
P04,2026-02-03,75000
P05,2026-02-14,120000
P05,2026-03-15,130000
P05,2026-04-16,110000
P05,2026-05-17,140000
P06,2026-03-01,300000
P06,2026-06-28,320000
P07,2026-03-22,50000
P08,2026-04-05,210000
P08,2026-05-06,190000
P08,2026-06-07,230000
P09,2026-05-11,80000
P10,2026-06-27,400000
```

## Langkah 1: hitung R, F, M

Tanggal acuan adalah sehari setelah data terakhir, yaitu 1 Juli 2026.

```sql
SELECT
  id_pelanggan,
  DATE_DIFF(DATE '2026-07-01', MAX(tanggal), DAY) AS recency_hari,
  COUNT(*) AS frequency,
  SUM(nilai) AS monetary
FROM latihan.transaksi
GROUP BY id_pelanggan;
```

## Langkah 2: beri skor

Untuk data kecil, skor dengan ambang yang mudah dijelaskan lebih masuk akal:

| Skor | Recency | Frequency |
|---|---|---|
| 3 | ≤ 30 hari | ≥ 4 pesanan |
| 2 | 31–90 hari | 2–3 pesanan |
| 1 | > 90 hari | 1 pesanan |

Monetary tidak diberi skor di contoh ini, tetapi dipakai untuk memprioritaskan pelanggan di dalam setiap segmen.

## Langkah 3: beri nama segmen

```sql
WITH rfm AS (
  SELECT
    id_pelanggan,
    DATE_DIFF(DATE '2026-07-01', MAX(tanggal), DAY) AS recency_hari,
    COUNT(*) AS frequency,
    SUM(nilai) AS monetary
  FROM latihan.transaksi
  GROUP BY id_pelanggan
),
skor AS (
  SELECT *,
    CASE WHEN recency_hari <= 30 THEN 3 WHEN recency_hari <= 90 THEN 2 ELSE 1 END AS r,
    CASE WHEN frequency >= 4 THEN 3 WHEN frequency >= 2 THEN 2 ELSE 1 END AS f
  FROM rfm
)
SELECT *,
  CASE
    WHEN r = 3 AND f = 3 THEN 'Juara'
    WHEN r >= 2 AND f >= 2 THEN 'Setia'
    WHEN r = 3 AND f = 1 THEN 'Pelanggan baru'
    WHEN r = 1 AND f >= 2 THEN 'Berisiko hilang'
    WHEN r = 2 AND f = 1 THEN 'Perlu perhatian'
    ELSE 'Hilang'
  END AS segmen
FROM skor
ORDER BY r DESC, f DESC, monetary DESC;
```

| id | recency_hari | frequency | monetary | r | f | segmen |
|---|---|---|---|---|---|---|
| P01 | 6 | 5 | 1.000.000 | 3 | 3 | Juara |
| P03 | 13 | 3 | 1.550.000 | 3 | 2 | Setia |
| P08 | 24 | 3 | 630.000 | 3 | 2 | Setia |
| P06 | 3 | 2 | 620.000 | 3 | 2 | Setia |
| P10 | 4 | 1 | 400.000 | 3 | 1 | Pelanggan baru |
| P05 | 45 | 4 | 500.000 | 2 | 3 | Setia |
| P09 | 51 | 1 | 80.000 | 2 | 1 | Perlu perhatian |
| P02 | 131 | 2 | 150.000 | 1 | 2 | Berisiko hilang |
| P04 | 148 | 1 | 75.000 | 1 | 1 | Hilang |
| P07 | 101 | 1 | 50.000 | 1 | 1 | Hilang |

## Langkah 4: dari segmen ke tindakan

| Segmen | Arti | Contoh tindakan |
|---|---|---|
| Juara | Baru belanja dan sering | Program loyalitas, minta ulasan |
| Setia | Aktif dan berulang | Rekomendasi produk terkait |
| Pelanggan baru | Baru sekali, belum lama | Sambutan dan dorongan pembelian kedua |
| Perlu perhatian | Sekali belanja, mulai lama | Pengingat ringan |
| Berisiko hilang | Dulu berulang, sekarang lama tidak belanja | Penawaran khusus untuk kembali |
| Hilang | Sekali belanja, sudah lama | Biaya menyapa kembali sering tidak sepadan |

Ringkasan per segmen di data ini: 4 pelanggan Setia menyumbang Rp3.300.000 dari total Rp5.055.000 (sekitar 65%), dan satu pelanggan Juara Rp1.000.000.

> [!tip] Skor kuantil untuk data besar
> Untuk data besar seperti theLook, skor biasanya dibuat dengan kuantil: `NTILE(5) OVER (ORDER BY recency_hari DESC)` membagi pelanggan menjadi lima kelompok sama besar. Kelompok dengan recency terkecil (paling baru belanja) mendapat skor 5. Dengan 10 pelanggan, kuantil terlalu kasar, sehingga contoh ini memakai ambang.

> [!warning] Nama segmen adalah keputusan, bukan hasil hitungan
> Aturan dan nama segmen ditentukan analis bersama tim bisnis. Tulis aturan Anda dengan jelas di README, agar pembaca tahu arti "Setia" atau "Berisiko hilang" dalam analisis Anda.

## Latihan

1. Kenapa P03 masuk "Setia", bukan "Juara", padahal monetary-nya terbesar?
2. Kalau P02 belanja lagi pada 28 Juni 2026, segmennya menjadi apa?

<details><summary>Cek jawaban</summary>

1. Aturan Juara memakai R dan F, bukan M. P03 baru belanja 3 kali (skor F = 2), belum mencapai 4 kali. Kalau tim menilai nilai belanja penting, aturannya bisa ditambah, misalnya pelanggan dengan monetary teratas otomatis masuk Juara. Ini contoh bahwa aturan segmen adalah keputusan.
2. Recency menjadi 3 hari (R = 3) dan frequency menjadi 3 (F = 2), sehingga P02 masuk **Setia**.

</details>
