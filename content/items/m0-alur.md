## Enam langkah analisis

Setiap proyek analisis di kursus ini mengikuti enam langkah yang sama. Urutan ini juga dipakai dalam banyak program pelatihan data analyst, jadi istilahnya akan sering Anda temui.

| Langkah | Pertanyaan kunci | Hasil langkah ini |
|---|---|---|
| 1. Tanya | Keputusan apa yang ingin dibantu? Apa yang perlu diketahui? | Pertanyaan analisis yang spesifik |
| 2. Siapkan | Data apa yang dibutuhkan, dari mana, dan apakah boleh dipakai? | Data mentah dan catatan sumbernya |
| 3. Olah | Apakah datanya bersih, lengkap, dan konsisten? | Data rapi dan catatan pembersihan |
| 4. Analisis | Pola, perbandingan, atau perubahan apa yang terlihat? | Temuan dengan angka pendukung |
| 5. Bagikan | Bagaimana menyampaikan temuan agar dipahami? | Grafik, dashboard, atau ringkasan |
| 6. Bertindak | Apa yang sebaiknya dilakukan berdasarkan temuan? | Rekomendasi yang bisa dijalankan |

Langkahnya tidak selalu lurus. Saat menganalisis, Anda mungkin menemukan data yang salah lalu kembali ke langkah olah, atau sadar pertanyaannya kurang tepat lalu kembali ke langkah tanya. Itu bagian normal dari pekerjaan.

## Contoh: waktu layanan administrasi

Seorang kepala bidang berkata, "Warga banyak mengeluh layanan kita lambat." Begini enam langkah itu dijalankan.

**1. Tanya.** Keluhan itu belum bisa dijawab dengan data. Setelah berdiskusi, pertanyaannya menjadi: "Berapa rata-rata dan median waktu penyelesaian permohonan per jenis layanan selama Januari sampai Juni, dan jenis layanan mana yang paling sering melewati target lima hari kerja?"

**2. Siapkan.** Data yang dibutuhkan: tanggal masuk, tanggal selesai, dan jenis layanan untuk setiap permohonan. Data diekspor dari aplikasi layanan dengan izin atasan. Catat juga sumber, tanggal ekspor, dan kolom yang tersedia.

**3. Olah.** Ternyata ada permohonan tanpa tanggal selesai (masih diproses), tanggal yang ditulis dalam dua format berbeda, dan jenis layanan yang ditulis "KTP" dan "Ktp-el". Semua diseragamkan, dan permohonan yang belum selesai dipisahkan.

**4. Analisis.** Waktu penyelesaian dihitung dalam hari kerja, lalu diringkas per jenis layanan. Hasilnya, sebagian besar layanan selesai tepat waktu, tetapi satu jenis layanan rata-rata selesai dalam 9 hari kerja.

**5. Bagikan.** Satu grafik batang waktu median per jenis layanan dengan garis target lima hari, ditambah tiga kalimat temuan utama.

**6. Bertindak.** Rekomendasinya: periksa alur kerja layanan yang paling lambat, misalnya di tahap verifikasi berkas, lalu pantau perubahannya bulan depan dengan grafik yang sama.

> [!tip] Pertanyaan yang baik itu spesifik
> Periksa pertanyaan Anda dengan lima hal: apa yang diukur, untuk siapa atau apa, dalam rentang waktu kapan, dibandingkan dengan apa, dan keputusan apa yang akan dibantu. Pertanyaan yang memenuhi kelima hal itu biasanya langsung menunjukkan data apa yang dibutuhkan.

## Kesalahan yang sering terjadi

- **Langsung membuka data tanpa pertanyaan.** Hasilnya banyak grafik yang menarik tetapi tidak menjawab apa pun.
- **Melewatkan langkah olah.** Data yang belum diperiksa bisa menghasilkan kesimpulan yang salah dengan sangat meyakinkan.
- **Berhenti di angka.** Pembaca tidak hanya ingin tahu "rata-rata 9 hari", tetapi juga "apakah itu buruk, dan apa yang perlu dilakukan".

> [!warning] Korelasi bukan sebab
> Kalau dua hal naik bersamaan, belum tentu yang satu menyebabkan yang lain. Di langkah bertindak, tulis rekomendasi dengan jujur: "kemungkinan penyebabnya adalah…, perlu dicek dengan…", bukan klaim pasti yang tidak didukung data.

## Latihan

Ubah setiap permintaan samar berikut menjadi pertanyaan analisis yang spesifik.

1. "Tolong lihat data pengunjung perpustakaan daerah."
2. "Apakah program pelatihan UMKM kita berhasil?"

<details><summary>Cek jawaban</summary>

Jawaban bisa berbeda, asalkan jelas apa yang diukur, rentang waktu, pembanding, dan keputusan yang dibantu. Contoh:

1. "Bagaimana jumlah pengunjung perpustakaan daerah per bulan dalam 12 bulan terakhir, hari apa yang paling ramai, dan apakah jam buka saat ini sudah sesuai dengan jam kunjungan terbanyak?"
2. "Dari peserta pelatihan UMKM tahun lalu, berapa persen yang omzetnya naik enam bulan setelah pelatihan, dibandingkan pelaku UMKM serupa yang tidak ikut pelatihan?"

Perhatikan bahwa pertanyaan kedua membutuhkan data pembanding. Tanpa pembanding, kenaikan omzet belum tentu karena pelatihan.

</details>
