## Tentang DataLemur

DataLemur berisi soal SQL bergaya wawancara kerja data analyst dan data scientist, lengkap dengan editor untuk menjalankan query dan pemeriksa jawaban. Sebagian soal gratis, sebagian berbayar. Untuk kursus ini, soal gratis sudah cukup.

## Yang dikerjakan

1. Buat akun gratis.
2. Di halaman Questions, filter tingkat **Easy** dan pilih soal yang gratis.
3. Kerjakan **minimal lima soal**.

## Cara mengerjakan soal gaya wawancara

Soal wawancara biasanya dibungkus cerita ("Sebuah perusahaan media sosial ingin tahu…"). Biasakan empat langkah ini sebelum mengetik:

1. **Tulis ulang pertanyaannya dalam satu kalimat**, misalnya "Hitung banyak pengguna per jumlah tweet di tahun 2022."
2. **Lihat tabel dan contoh outputnya.** Kolom apa yang diminta, dan dalam urutan apa?
3. **Tulis langkahnya dalam komentar** sebelum query: filter apa, kelompok apa, lalu agregat apa. Kalau butuh dua langkah ringkasan, siapkan CTE.
4. **Periksa hasil dengan contoh kecil.** Apakah ada nilai seri, NULL, atau tanggal di batas tahun yang perlu diperhatikan?

> [!tip] Latihan berbicara
> Di wawancara sungguhan, Anda sering diminta menjelaskan query sambil menulis. Setelah satu soal selesai, coba jelaskan query Anda dengan suara keras dalam satu menit: tabel mana, filter apa, kelompok apa, dan kenapa.

> [!warning] Dialek SQL
> DataLemur menjalankan PostgreSQL. Fungsi tanggal berbeda dari BigQuery, misalnya `EXTRACT(YEAR FROM tanggal)` di PostgreSQL. Kalau ragu, cek bagian petunjuk soal atau dokumentasi PostgreSQL.

## Selesai jika

Lima soal Easy selesai. Simpan query terbaik Anda (beserta penjelasan singkat di komentar) di repositori GitHub, misalnya di folder `latihan-sql/`.
