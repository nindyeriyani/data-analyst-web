## Kenapa SQL

Spreadsheet nyaman sampai puluhan ribu baris. Di atas itu, atau ketika data tersimpan di database, data analyst memakai SQL: bahasa untuk meminta data dari database. SQL hampir selalu ada di lowongan data analyst dan hampir selalu diuji saat wawancara.

Kabar baiknya, banyak idenya sudah Anda kenal dari minggu lalu: filter menjadi `WHERE`, urutkan menjadi `ORDER BY`, pivot table menjadi `GROUP BY`, dan XLOOKUP menjadi `JOIN`.

## Dua minggu ke depan

| Minggu | Fokus | Item utama |
|---|---|---|
| 3 | Dasar: mengambil, memfilter, meringkas | SELECT, SQLBolt, Kaggle, GROUP BY, kuis dasar |
| 4 | Lanjutan dan data nyata | JOIN, CTE, window function, theLook di BigQuery, proyek |

## Siapkan tempat latihan di BigQuery (15 menit)

Contoh di bacaan minggu ini memakai data toko buku dari proyek mini minggu lalu, versi yang sudah bersih (36 pesanan, data rekaan). Unggah sekali ke BigQuery, lalu semua contoh bisa Anda jalankan sendiri.

1. Salin data di bawah ke Google Sheets baru, lalu **File**, **Download**, **Comma-separated values (.csv)**.

```csv
id_pesanan,tanggal,kota,kategori,kanal,jumlah,harga_satuan
B001,2026-07-01,Surabaya,Bisnis,Marketplace,4,95000
B002,2026-07-03,Medan,Buku anak,Toko fisik,2,55000
B003,2026-07-05,Jakarta,Buku anak,Situs,4,55000
B004,2026-07-05,Medan,Bisnis,Toko fisik,2,95000
B005,2026-07-06,Surabaya,Komik,Situs,1,40000
B006,2026-07-06,Bandung,Buku anak,Marketplace,4,55000
B007,2026-07-08,Medan,Komik,Marketplace,2,40000
B008,2026-07-14,Bandung,Komik,Marketplace,1,40000
B009,2026-07-18,Surabaya,Novel,Toko fisik,4,85000
B010,2026-07-18,Surabaya,Novel,Marketplace,4,85000
B011,2026-07-21,Medan,Buku anak,Marketplace,2,55000
B012,2026-07-23,Surabaya,Komik,Situs,1,40000
B013,2026-07-25,Bandung,Bisnis,Marketplace,1,95000
B014,2026-07-25,Bandung,Komik,Marketplace,3,40000
B015,2026-07-27,Bandung,Bisnis,Toko fisik,2,95000
B016,2026-07-27,Bandung,Bisnis,Toko fisik,1,95000
B017,2026-08-02,Surabaya,Novel,Situs,3,85000
B018,2026-08-02,Surabaya,Buku anak,Marketplace,3,55000
B019,2026-08-06,Jakarta,Buku anak,Marketplace,4,55000
B020,2026-08-08,Bandung,Novel,Toko fisik,4,85000
B021,2026-08-11,Bandung,Bisnis,Marketplace,1,95000
B022,2026-08-12,Medan,Komik,Toko fisik,2,40000
B023,2026-08-17,Jakarta,Novel,Marketplace,3,85000
B024,2026-08-20,Jakarta,Buku anak,Situs,4,55000
B025,2026-08-20,Jakarta,Komik,Marketplace,3,40000
B026,2026-08-22,Jakarta,Buku anak,Marketplace,4,55000
B027,2026-08-25,Jakarta,Novel,Toko fisik,1,85000
B028,2026-08-27,Bandung,Komik,Marketplace,4,40000
B029,2026-09-02,Bandung,Novel,Situs,2,85000
B030,2026-09-05,Surabaya,Novel,Toko fisik,4,85000
B031,2026-09-09,Surabaya,Novel,Situs,3,85000
B032,2026-09-20,Medan,Buku anak,Marketplace,1,55000
B033,2026-09-21,Jakarta,Buku anak,Marketplace,4,55000
B034,2026-09-22,Surabaya,Novel,Situs,4,85000
B035,2026-09-22,Jakarta,Novel,Toko fisik,2,85000
B036,2026-09-25,Bandung,Komik,Marketplace,4,40000
```

2. Buka BigQuery (console.cloud.google.com/bigquery) di project yang dibuat minggu 1.
3. Di panel Explorer, klik titik tiga di samping nama project, pilih **Create dataset**, beri ID `latihan`, lalu **Create dataset**.
4. Klik titik tiga di samping dataset `latihan`, pilih **Create table**:
   - Source: **Upload**, pilih file CSV tadi
   - Table: `penjualan_buku`
   - Schema: centang **Auto detect**
5. Klik **Create table**, lalu uji di editor query:

```sql
SELECT COUNT(*) AS banyak_pesanan
FROM latihan.penjualan_buku;
```

Hasilnya harus **36**.

> [!warning] Tabel sandbox terhapus setelah 60 hari
> Tabel yang Anda unggah ke BigQuery sandbox otomatis terhapus setelah 60 hari. Kalau nanti hilang, unggah ulang dari CSV di halaman ini.

> [!tip] Simpan query yang berhasil
> Setiap query yang berhasil dan ingin Anda ingat, salin ke file `.sql` di repositori GitHub atau ke catatan belajar. Menulis ulang dari ingatan adalah latihan terbaik.
