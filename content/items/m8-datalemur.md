## Tujuan

Tes teknis SQL hampir selalu diberi batas waktu. Minggu ini Anda berlatih menyelesaikan soal tingkat **medium** di DataLemur dengan batas **20 menit per soal**, seperti di tes sungguhan.

## Yang dikerjakan

1. Di halaman Questions, filter tingkat **Medium**, dan pilih soal yang gratis.
2. Kerjakan **minimal lima soal**, masing-masing dengan pengatur waktu 20 menit.
3. Catat untuk setiap soal: selesai dalam waktu atau tidak, konsep yang dipakai, dan kesalahan yang sempat dibuat.

## Pola yang sering muncul di soal medium

| Pola | Konsep SQL |
|---|---|
| "Teratas per kelompok" (produk terlaris per kategori) | `ROW_NUMBER` atau `RANK` dengan `PARTITION BY` |
| "Dibanding periode sebelumnya" (pertumbuhan bulanan) | `LAG`, `DATE_TRUNC` atau fungsi tanggal |
| "Persentase dari total" | CTE plus pembagian, atau `SUM(...) OVER ()` |
| "Pengguna yang melakukan X lalu Y" | JOIN tabel dengan dirinya sendiri, atau CTE bertahap |
| "Belum pernah melakukan X" | `LEFT JOIN ... WHERE ... IS NULL` |

## Strategi di bawah tekanan waktu

1. **Dua menit pertama:** baca soal, tabel, dan contoh output. Tulis rencana dalam komentar.
2. **Bangun bertahap:** CTE pertama, jalankan, periksa; lalu CTE berikutnya.
3. **Periksa hasil dengan contoh:** apakah jumlah baris masuk akal? Ada nilai seri? NULL?
4. **Kalau buntu di menit ke-15:** tulis solusi yang paling mendekati, lalu catat bagian yang belum selesai. Di tes sungguhan, solusi parsial yang dijelaskan dengan baik sering tetap dinilai.

> [!tip] Belajar dari solusi
> Setelah waktu habis, baru buka solusi atau diskusi. Bandingkan dengan query Anda: apakah ada cara yang lebih sederhana? Tulis ulang solusi itu dari ingatan keesokan harinya.

> [!warning] Dialek PostgreSQL
> DataLemur memakai PostgreSQL. Fungsi tanggal berbeda dari BigQuery: misalnya `DATE_TRUNC('month', tanggal)` di PostgreSQL, dibandingkan `DATE_TRUNC(tanggal, MONTH)` di BigQuery. Saat tes sungguhan, tanyakan dialek apa yang dipakai.

## Selesai jika

Lima soal medium dikerjakan dengan batas waktu, dan catatan konsep serta kesalahan tersimpan. Simpan query terbaik di folder `latihan-sql/` di GitHub.
