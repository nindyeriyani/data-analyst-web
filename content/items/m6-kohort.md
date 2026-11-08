## Apa itu analisis kohort

Kohort adalah sekelompok pelanggan yang mulai pada waktu yang sama, biasanya bulan pertama belanja. Analisis retensi kohort melacak berapa persen dari setiap kohort yang **kembali belanja** di bulan-bulan berikutnya.

Analisis ini menjawab pertanyaan yang tidak bisa dijawab oleh total penjualan bulanan, misalnya: apakah pelanggan baru kita bertahan lebih lama dibanding pelanggan baru beberapa bulan lalu?

## Data

Pakai tabel `latihan.transaksi` dari bacaan RFM.

## Langkah 1: tentukan kohort dan bulan aktif

```sql
WITH pertama AS (
  SELECT id_pelanggan, DATE_TRUNC(MIN(tanggal), MONTH) AS kohort
  FROM latihan.transaksi
  GROUP BY id_pelanggan
),
aktif AS (
  SELECT DISTINCT id_pelanggan, DATE_TRUNC(tanggal, MONTH) AS bulan
  FROM latihan.transaksi
),
per_kohort AS (
  SELECT
    p.kohort,
    DATE_DIFF(a.bulan, p.kohort, MONTH) AS bulan_ke,
    COUNT(DISTINCT a.id_pelanggan) AS pelanggan
  FROM aktif AS a
  JOIN pertama AS p USING (id_pelanggan)
  GROUP BY p.kohort, bulan_ke
)
SELECT
  kohort,
  bulan_ke,
  pelanggan,
  ROUND(100 * pelanggan / MAX(IF(bulan_ke = 0, pelanggan, NULL)) OVER (PARTITION BY kohort)) AS retensi_persen
FROM per_kohort
ORDER BY kohort, bulan_ke;
```

- `pertama`: bulan pertama setiap pelanggan belanja (kohortnya).
- `aktif`: setiap bulan saat seorang pelanggan belanja, satu baris per pelanggan per bulan.
- `bulan_ke`: jarak bulan dari kohort. 0 artinya bulan pertama, 1 artinya bulan berikutnya, dan seterusnya.
- `retensi_persen`: pelanggan aktif dibagi ukuran kohort di bulan ke-0, memakai window function yang dipelajari di modul SQL.

## Langkah 2: susun tabel retensi

Hasil query biasanya ditampilkan sebagai tabel segitiga, dengan kohort di baris dan bulan ke di kolom:

| kohort | ukuran | bulan 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|---|
| 2026-01 | 3 | 100% | 67% | 33% | 33% | 33% | 67% |
| 2026-02 | 2 | 100% | 50% | 50% | 50% | | |
| 2026-03 | 2 | 100% | | | 50% | | |
| 2026-04 | 1 | 100% | 100% | 100% | | | |
| 2026-05 | 1 | 100% | | | | | |
| 2026-06 | 1 | 100% | | | | | |

Kotak kosong di kanan bawah wajar: kohort yang baru mulai belum sempat punya bulan ke-3, ke-4, dan seterusnya. Kotak kosong di tengah (kohort Maret bulan 1 dan 2) berarti tidak ada pelanggan kohort itu yang belanja di bulan tersebut. Angka 0% dan kosong bisa dibedakan dengan memberi warna berbeda.

## Cara membaca

- **Baca per baris:** bagaimana satu kohort bertahan dari waktu ke waktu. Kohort Januari turun ke 33% di bulan ke-2, lalu naik lagi ke 67% di bulan ke-5.
- **Baca per kolom:** apakah kohort baru bertahan lebih baik dari kohort lama di umur yang sama. Lihat kolom bulan 1: Januari 67%, Februari 50%, April 100%.
- **Perhatikan ukuran kohort.** Kohort April hanya satu orang, jadi "100%" tidak berarti banyak. Pada data sungguhan, kohort berisi ratusan sampai ribuan pelanggan.

> [!warning] Jangan bandingkan kohort berukuran sangat kecil
> Persentase dari satu atau dua pelanggan berubah drastis karena satu orang saja. Sertakan kolom ukuran kohort di setiap tabel atau grafik retensi.

## Visualisasi: heatmap

Di Tableau, kohort di Rows, `bulan_ke` di Columns, dan `retensi_persen` di Color, dengan jenis tanda kotak, menghasilkan tabel berwarna (heatmap). Warna lebih gelap berarti retensi lebih tinggi. Pola yang menurun dari kiri ke kanan langsung terlihat.

> [!tip] Definisi aktif harus jelas
> "Aktif" di contoh ini berarti belanja minimal sekali di bulan itu. Di theLook, tentukan juga apakah pesanan yang dibatalkan atau dikembalikan dihitung. Tulis definisinya di README.

## Latihan

1. Berapa pelanggan di kohort Februari yang belanja di bulan ke-3 (Mei 2026)? Siapa?
2. Kenapa kohort Juni hanya punya kolom bulan 0?

<details><summary>Cek jawaban</summary>

1. Satu pelanggan dari dua (50%): P05, yang belanja setiap bulan dari Februari sampai Mei. P04 hanya belanja sekali di Februari.
2. Data berakhir di Juni 2026, jadi kohort Juni belum punya bulan berikutnya untuk diamati. Ini bukan berarti retensinya 0%.

</details>
