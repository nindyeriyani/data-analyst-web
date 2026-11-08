## Kenapa GitHub untuk portofolio

Perekrut data analyst ingin melihat cara Anda bekerja, bukan hanya sertifikat. Repositori GitHub yang rapi menunjukkan query SQL, notebook Python, dan penjelasan proyek Anda dalam satu tempat yang mudah dibagikan lewat tautan.

Di lab ini Anda membuat satu repositori portofolio. Repositori ini akan diisi sedikit demi sedikit sampai minggu 11.

## Istilah singkat

| Istilah | Arti |
|---|---|
| Repositori (repo) | Folder proyek beserta seluruh riwayat perubahannya |
| Commit | Satu simpanan perubahan, lengkap dengan pesan yang menjelaskan apa yang berubah |
| README | File `README.md` yang otomatis tampil di halaman depan repositori |
| Markdown | Format teks sederhana untuk README: `#` untuk judul, `-` untuk daftar |
| `.gitignore` | Daftar file yang tidak boleh ikut tersimpan ke repositori |

## 1. Buat repositori (10 menit)

1. Di github.com, klik **New repository**.
2. Isi:
   - **Repository name**: `portofolio-data-analyst`
   - **Description**: `Proyek analisis data dengan SQL, Python, dan Tableau`
   - Pilih **Public**, agar bisa dilihat perekrut.
   - Centang **Add a README file**.
3. Klik **Create repository**.

## 2. Tulis README pertama (20 menit)

Klik ikon pensil di README untuk mengedit langsung di browser, lalu ganti isinya dengan templat ini. Sesuaikan bagian dalam kurung siku.

```markdown
# Portofolio Data Analyst

Halo, saya [nama]. Saya sedang belajar menjadi data analyst dengan fokus pada
SQL, Python (pandas), dan visualisasi data. Saat ini saya magang sebagai data
analyst di instansi pemerintahan.

## Proyek

| Proyek | Alat | Status |
|---|---|---|
| Analisis e-commerce theLook: RFM dan retensi kohort | BigQuery, Tableau | Direncanakan |
| Dashboard indikator daerah dari data BPS | Google Sheets, Tableau | Direncanakan |
| Studi kasus proyek magang | (tanpa data internal) | Direncanakan |

## Keterampilan

- SQL: SELECT, JOIN, GROUP BY, CTE, window function
- Python: pandas, matplotlib
- Spreadsheet: rumus, pivot table
- Visualisasi: Tableau Public, Looker Studio

## Kontak

- LinkedIn: [tautan]
- Email: [email]
```

Di bagian bawah, isi **Commit message** dengan `Tulis README portofolio`, lalu klik **Commit changes**.

## 3. Tambahkan struktur folder (15 menit)

GitHub tidak menyimpan folder kosong, jadi setiap folder diberi satu file `README.md` kecil.

1. Klik **Add file**, **Create new file**.
2. Ketik nama file `01-thelook-ecommerce/README.md`. Tanda `/` otomatis membuat folder.
3. Isi dengan satu baris: `# Analisis e-commerce theLook (segera)`.
4. Commit dengan pesan `Tambah folder proyek 1`.
5. Ulangi untuk `02-indikator-daerah/README.md` dan `03-studi-kasus-magang/README.md`.

## 4. Tambahkan `.gitignore` (10 menit)

Buat file baru bernama `.gitignore` dengan isi berikut. File ini mencegah data mentah dan file rahasia ikut tersimpan.

```
# Data mentah dan file besar
data/raw/
*.xlsx
*.zip

# Rahasia
.env
*.key
credentials*.json

# File sistem Mac
.DS_Store
```

> [!warning] Yang tidak boleh masuk ke GitHub
> Data internal instansi, data pribadi (nama, NIK, alamat, nomor telepon), kata sandi, dan kunci akses. Repositori publik bisa dibaca siapa saja, dan menghapus file belum tentu menghapus riwayatnya. Kalau ragu, jangan unggah.

> [!tip] Pesan commit yang baik
> Tulis apa yang berubah, dalam kalimat pendek: "Tambah query segmentasi RFM", "Perbaiki grafik retensi". Hindari pesan seperti "update" atau "fix", karena riwayat seperti itu sulit dibaca ulang.

## Opsional: Git dari Terminal Mac

Kalau ingin bekerja dari komputer, bukan browser, Git sudah tersedia di macOS melalui Xcode Command Line Tools (macOS akan menawarkan pemasangan saat pertama kali perintah `git` dijalankan). Alur dasarnya:

```bash
git clone https://github.com/<nama-pengguna>/portofolio-data-analyst.git
cd portofolio-data-analyst
# ubah atau tambah file
git add .
git commit -m "Tambah catatan belajar minggu 1"
git push
```

Untuk kursus ini, mengedit lewat browser sudah cukup.

## Daftar periksa

- [ ] Repositori publik `portofolio-data-analyst` dengan README berisi nama dan daftar proyek
- [ ] Tiga folder proyek
- [ ] File `.gitignore`
- [ ] Minimal empat commit dengan pesan yang jelas
