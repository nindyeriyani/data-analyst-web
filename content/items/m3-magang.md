## Tujuan

Di banyak kantor, ada pekerjaan data yang dilakukan dengan cara yang sama setiap minggu atau bulan: menyalin dari beberapa file, merapikan kolom, menghitung ringkasan, lalu membuat tabel laporan. Pekerjaan seperti ini cocok diotomatiskan dengan Python.

Minggu ini, temukan **satu pekerjaan berulang**, catat langkah-langkahnya, lalu buat ulang di Colab memakai **data tiruan** dengan struktur yang sama.

> [!warning] Data tiruan, bukan data instansi
> Data tiruan dibuat sendiri: nama kolomnya sama, tetapi isinya rekaan, misalnya `Kecamatan A`, `Layanan 1`, dan angka acak. Jangan menyalin data asli ke Colab, walaupun hanya beberapa baris, dan jangan menempelkan data asli ke AI.

## Langkah kerja

**1. Cari kandidat (20 menit).** Lihat kembali peta sumber data dan laporan yang dirapikan di minggu 2. Kandidat yang baik:

- dilakukan rutin (mingguan atau bulanan),
- langkahnya selalu sama,
- memakan waktu lebih dari 30 menit,
- melibatkan salin-tempel atau hitung manual.

**2. Catat langkahnya secara rinci (25 menit).** Tulis seperti resep, misalnya:

1. Ekspor data permohonan bulan ini dari aplikasi ke Excel.
2. Hapus lima baris judul di atas tabel.
3. Seragamkan nama kecamatan.
4. Hitung jumlah permohonan per kecamatan per jenis layanan.
5. Salin hasilnya ke template laporan.

**3. Petakan ke pandas (15 menit).** Di samping setiap langkah, tulis perintah pandas yang mungkin dipakai:

| Langkah | pandas |
|---|---|
| Baca file Excel, lewati baris judul | `pd.read_excel("file.xlsx", skiprows=5)` |
| Seragamkan nama kecamatan | `.str.strip().str.title()` |
| Hitung per kecamatan per layanan | `pd.pivot_table(..., aggfunc="count")` |
| Simpan hasil | `.to_excel("laporan.xlsx", index=False)` |

## Hasil yang diharapkan

- Catatan langkah kerja dan padanan pandas-nya, tanpa data dan tanpa nama orang.
- Rencana data tiruan: daftar kolom dan contoh nilai rekaan.
- Di minggu berikutnya atau saat proyek studi kasus magang, buat notebook Colab dengan data tiruan itu untuk membuktikan bahwa alurnya berjalan.

> [!tip] Bicarakan dengan pembimbing
> Kalau notebook dengan data tiruan berhasil, tunjukkan ke pembimbing. Menjalankannya dengan data asli harus dilakukan di perangkat dan akun yang diizinkan kantor, dan hanya jika kantor mengizinkan memakai Python di sana.
