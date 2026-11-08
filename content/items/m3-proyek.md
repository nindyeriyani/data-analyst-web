## Brief

Pilih satu dataset publik, bersihkan, analisis dengan pandas, lalu tulis temuan Anda di notebook Colab yang rapi. Notebook ini masuk portofolio, jadi tulis untuk pembaca yang bukan ahli data.

## Memilih dataset

Syarat dataset yang baik untuk proyek ini:

- **Publik dan boleh dipakai ulang.** Cek lisensi atau ketentuan pemakaiannya di halaman dataset.
- **Ukurannya sedang**: ratusan sampai puluhan ribu baris. Cukup untuk dianalisis tanpa memberatkan Colab.
- **Ada kategori, angka, dan sebaiknya tanggal**, sehingga bisa dikelompokkan, diringkas, dan dilihat trennya.
- **Topiknya Anda minati**, karena Anda akan menghabiskan beberapa jam dengannya.

Tempat mencari:

- **BPS** (bps.go.id): tabel statistik per provinsi dan kabupaten/kota, misalnya kependudukan, pendidikan, dan ketenagakerjaan. Biasanya bisa diunduh sebagai Excel atau CSV.
- **Satu Data Indonesia** (data.go.id): data terbuka dari kementerian dan pemerintah daerah.
- **Kaggle Datasets** (kaggle.com/datasets): pilih dataset dengan deskripsi kolom yang jelas, dan hindari yang sudah sangat bersih jika Anda ingin melatih pembersihan.

> [!tip] Data BPS sering berbentuk lebar
> Tabel BPS biasanya disusun untuk dibaca manusia: tahun sebagai kolom, judul bertingkat, dan catatan kaki. Mengubahnya menjadi bentuk panjang dengan `pd.melt()` adalah latihan pembersihan yang sangat berguna, karena data pemerintah sering berbentuk seperti ini.

## Struktur notebook

1. **Judul dan tujuan.** Satu paragraf: apa yang ingin diketahui dan untuk siapa.
2. **Pertanyaan analisis.** Tiga sampai lima pertanyaan spesifik.
3. **Sumber data.** Nama dataset, tautan, tanggal unduh, lisensi, dan arti setiap kolom yang dipakai.
4. **Pembersihan.** Setiap langkah dalam sel terpisah, dengan sel teks yang menjelaskan masalah dan keputusannya.
5. **Analisis.** Untuk setiap pertanyaan: kode dengan `groupby` atau `pivot_table`, grafik, lalu dua atau tiga kalimat interpretasi.
6. **Kesimpulan dan keterbatasan.** Jawaban singkat untuk setiap pertanyaan, ditambah hal yang membatasi kesimpulan, misalnya data yang kosong, rentang waktu yang pendek, atau korelasi yang belum tentu sebab.

## Syarat sesuai rubrik

- Notebook diawali tujuan dan pertanyaan analisis.
- Langkah pembersihan dijelaskan di sel teks.
- Memakai `groupby` atau `pivot_table` untuk menjawab pertanyaan.
- Minimal tiga grafik dengan judul yang menyatakan temuan dan label sumbu yang jelas.
- Kesimpulan dan keterbatasan ditulis di akhir.
- Notebook tersimpan di GitHub dan bisa dibuka orang lain.

> [!warning] Notebook harus bisa dijalankan ulang
> Sebelum menyimpan, pilih **Runtime**, **Restart session and run all**. Cara agar orang lain bisa menjalankan notebook Anda: simpan file data di repositori yang sama (kalau ukurannya kecil dan lisensinya mengizinkan), atau baca langsung dari URL unduhan resminya.

## Yang dikumpulkan

Tautan ke notebook di repositori GitHub, misalnya di folder `02-indikator-daerah/` (kalau memakai data BPS) atau `latihan-python/`, ditempel di kolom **Tautan hasil kerja**.
