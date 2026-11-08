## Tentang kursus ini

Kaggle Learn: Pandas berisi pelajaran singkat dengan latihan memakai dataset nyata. Kursus ini mengulang bacaan "Dasar pandas" dan memberi banyak latihan tambahan tentang memilih data, meringkas, mengelompokkan, tipe data, dan menggabungkan tabel.

## Yang dikerjakan

Kerjakan **semua pelajaran beserta latihannya**, berurutan. Beberapa topik di kursus ini, seperti mengelompokkan, nilai kosong, dan menggabungkan tabel, akan dibahas lebih dalam di minggu 6. Tidak masalah kalau pada percobaan pertama belum sepenuhnya paham.

## Yang perlu diperhatikan

- **`loc` dan `iloc`.** `loc` memilih berdasarkan label atau syarat, sedangkan `iloc` berdasarkan posisi angka. Untuk analisis sehari-hari, `loc` dengan syarat jauh lebih sering dipakai.
- **Hasil yang tidak disimpan.** Banyak operasi pandas menghasilkan DataFrame baru tanpa mengubah yang lama. `df.sort_values("x")` tidak mengurutkan `df` kecuali hasilnya disimpan: `df = df.sort_values("x")`.
- **Bandingkan dengan SQL.** Setiap kali belajar operasi baru, tulis padanannya di SQL di catatan Anda, misalnya `groupby` dengan `GROUP BY` dan `merge` dengan `JOIN`.

> [!tip] Ulangi dengan data sendiri
> Setelah satu pelajaran selesai, coba operasi yang sama pada data `penjualan_buku.csv` di Colab Anda. Memindahkan ide ke data lain adalah tanda Anda benar-benar paham.

> [!warning] Versi pandas bisa berbeda
> Kaggle dan Colab mungkin memakai versi pandas yang berbeda. Hasil angka tetap sama, tetapi tampilan tipe teks bisa tertulis `object` (pandas 2) atau `str` (pandas 3). Kalau muncul peringatan (warning) berwarna merah muda tetapi kode tetap berjalan, baca pesannya. Biasanya itu saran cara penulisan yang lebih baru, bukan galat.

## Selesai jika

Semua pelajaran dan latihan selesai. Simpan tautan sertifikat penyelesaian kalau tersedia.
