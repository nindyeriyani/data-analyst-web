## Tujuan

Bayangkan satu laporan rutin di tempat magang disimpan di database, bukan di spreadsheet. Tabel apa saja yang dibutuhkan, dan kolom apa di setiap tabel? Latihan ini melatih cara berpikir yang sama dengan membaca skema theLook: memecah informasi menjadi beberapa tabel yang saling terhubung.

Cukup rancangan di kertas atau di catatan, tanpa data dan tanpa membuat database sungguhan.

## Langkah kerja

**1. Pilih laporan (5 menit).** Sebaiknya laporan yang sama dengan tugas minggu 2, karena Anda sudah memahaminya.

**2. Tentukan "benda" yang dicatat (15 menit).** Setiap benda menjadi satu tabel. Contoh untuk laporan layanan permohonan:

- `pemohon`: orang yang mengajukan
- `permohonan`: setiap pengajuan
- `jenis_layanan`: daftar layanan beserta targetnya
- `unit`: unit yang memproses

**3. Tulis kolom setiap tabel (25 menit).** Beri tanda **PK** untuk primary key (kolom unik penanda setiap baris) dan **FK** untuk foreign key (kolom yang merujuk ke tabel lain).

| Tabel | Kolom |
|---|---|
| `permohonan` | id_permohonan (PK), id_pemohon (FK), id_layanan (FK), id_unit (FK), tanggal_masuk, tanggal_selesai, status |
| `jenis_layanan` | id_layanan (PK), nama_layanan, target_hari |
| `unit` | id_unit (PK), nama_unit |
| `pemohon` | id_pemohon (PK), kecamatan |

**4. Gambar hubungannya (15 menit).** Tarik garis dari setiap FK ke PK yang dirujuknya. Tulis juga satu query yang bisa dijawab dengan rancangan ini, misalnya rata-rata hari proses per unit dengan `JOIN` dan `GROUP BY`.

> [!warning] Data pribadi seminimal mungkin
> Perhatikan contoh tabel `pemohon` di atas: hanya berisi kecamatan, tanpa nama, NIK, atau alamat. Saat merancang, tanyakan untuk setiap kolom: apakah analisis benar-benar membutuhkannya? Prinsip ini disebut minimisasi data, dan wajib diperhatikan di instansi pemerintah.

## Hasil yang diharapkan

- Daftar tabel dan kolom, dengan PK dan FK.
- Gambar hubungan antartabel (foto sketsa di kertas juga boleh, asal tidak memuat data).
- Satu contoh query yang memanfaatkan rancangan itu.
