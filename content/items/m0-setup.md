## Tujuan lab

Di akhir lab ini, lima alat yang dipakai selama kursus sudah siap dan sudah dicoba sekali. Semuanya gratis dan berjalan di browser MacBook. Hampir semuanya cukup memakai satu akun Google.

| Alat | Dipakai untuk | Mulai dipakai |
|---|---|---|
| Google Sheets | Spreadsheet, pivot table | Minggu 2 |
| BigQuery sandbox | SQL pada dataset besar | Minggu 3 |
| Google Colab | Python dan pandas | Minggu 5 |
| GitHub | Menyimpan proyek portofolio | Minggu 1 (lab berikutnya) |
| Tableau Public | Dashboard portofolio | Minggu 8 |

> [!tip] Satu akun Google untuk belajar
> Pakai akun Google pribadi, bukan akun kantor. Proyek portofolio Anda harus tetap bisa diakses setelah magang selesai.

## 1. Google Sheets (10 menit)

1. Buka sheets.google.com, lalu buat spreadsheet kosong bernama `Latihan kursus`.
2. Salin data di bawah ini, lalu tempel di sel A1.

```csv
bulan,permohonan
Jan,120
Feb,135
Mar,98
```

3. Kalau semua data masuk ke kolom A, pilih kolom A, buka menu **Data**, lalu pilih opsi untuk memisahkan teks menjadi kolom (di tampilan bahasa Inggris: **Split text to columns**).
4. Di sel C1 ketik `total`, dan di sel C2 ketik `=SUM(B2:B4)`. Hasilnya harus 353.

## 2. BigQuery sandbox (30 menit)

BigQuery adalah database milik Google untuk data berukuran besar. Mode sandbox bisa dipakai tanpa kartu kredit.

1. Buka console.cloud.google.com/bigquery dan masuk dengan akun Google Anda.
2. Ikuti petunjuk untuk membuat project baru, misalnya bernama `belajar-data`. Jangan aktifkan billing.
3. Di editor query, tempel lalu jalankan (tombol **Run**):

```sql
SELECT name, SUM(number) AS total
FROM `bigquery-public-data.usa_names.usa_1910_2013`
WHERE state = 'TX'
GROUP BY name
ORDER BY total DESC
LIMIT 10;
```

4. Kalau muncul tabel 10 nama dengan kolom `total`, BigQuery siap dipakai.

> [!warning] Batas sandbox yang perlu diingat
> - Kuota pemrosesan query 1 TB per bulan. Biasakan memilih kolom yang dibutuhkan saja, bukan `SELECT *`, agar data yang dipindai lebih sedikit.
> - Kuota penyimpanan 10 GB seumur hidup project dan tidak kembali walaupun data dihapus. Simpan hasil query sebagai tabel hanya kalau perlu.
> - Tabel yang Anda buat sendiri otomatis terhapus setelah 60 hari. Simpan query penting di GitHub, bukan hanya di BigQuery.
> - Perintah yang mengubah data (`INSERT`, `UPDATE`, `DELETE`) tidak tersedia di sandbox. Untuk kursus ini, cukup `SELECT`.

## 3. Google Colab (15 menit)

1. Buka colab.research.google.com, lalu pilih **New notebook**.
2. Di sel pertama, ketik lalu jalankan dengan Shift + Enter:

```python
import pandas as pd

data = pd.DataFrame({"bulan": ["Jan", "Feb", "Mar"], "permohonan": [120, 135, 98]})
print(data["permohonan"].sum())
```

3. Hasilnya harus `353`. Ganti nama notebook menjadi `Latihan kursus` lewat judul di kiri atas. Notebook tersimpan di Google Drive, folder **Colab Notebooks**.

## 4. GitHub (15 menit)

1. Buka github.com, lalu daftar dengan email pribadi. Pilih nama pengguna yang profesional, misalnya nama Anda, karena nama ini akan tampil di CV.
2. Aktifkan verifikasi dua langkah di **Settings**, **Password and authentication**.
3. Repositori portofolio dibuat di lab berikutnya.

## 5. Tableau Public (20 menit)

1. Buka public.tableau.com, lalu daftar akun gratis.
2. Tableau Public bisa dipakai lewat browser (fitur membuat viz di situsnya) atau lewat aplikasi desktop Tableau Public untuk Mac. Pakai yang tersedia saat Anda mendaftar. Keduanya cukup untuk kursus ini.
3. Tidak perlu membuat viz sekarang. Cukup pastikan Anda bisa masuk ke profil.

> [!warning] Semua yang disimpan di Tableau Public bersifat publik
> Anggap setiap viz yang Anda simpan bisa dilihat siapa saja di internet. Hanya gunakan data publik atau data rekaan. Data instansi tempat magang tidak boleh diunggah, walaupun hanya untuk mencoba.

## Daftar periksa

- [ ] Spreadsheet `Latihan kursus` dengan total 353
- [ ] Query BigQuery berhasil menampilkan 10 nama
- [ ] Notebook Colab menampilkan 353
- [ ] Akun GitHub dengan verifikasi dua langkah
- [ ] Akun Tableau Public

Kalau semua sudah tercentang, tandai lab ini selesai.
