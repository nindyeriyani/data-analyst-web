## AI sebagai tutor, bukan pengganti

AI seperti Claude bisa menjelaskan konsep, mencari letak kesalahan query, dan memberi contoh dalam hitungan detik. Itu sangat membantu, asalkan Anda tetap yang berpikir. Di wawancara kerja dan tes teknis, Anda akan diminta menulis SQL atau menjelaskan analisis sendiri. Di tempat kerja, Anda yang bertanggung jawab kalau angkanya salah.

Tujuan bagian ini: memakai AI agar belajar lebih cepat, tanpa menjadi bergantung padanya.

## Tiga aturan

**1. Coba dulu sendiri, minimal 15 menit.** Baca pesan galat, cek ulang ejaan nama kolom, coba ubah satu hal kecil. Kebuntuan singkat ini adalah saat otak paling banyak belajar.

**2. Minta penjelasan, bukan jawaban jadi.** Bandingkan dua cara bertanya berikut.

| Kurang membantu belajar | Lebih membantu belajar |
|---|---|
| "Buatkan query untuk total penjualan per kota." | "Query saya error 'column must appear in GROUP BY'. Ini query-nya: … Jelaskan kenapa error, tapi jangan tuliskan query yang benar dulu." |
| "Bersihkan data ini dengan pandas." | "Saya ingin menghapus baris duplikat di pandas. Fungsi apa yang relevan dan apa beda opsinya? Saya akan coba tulis sendiri." |

**3. Tulis ulang dengan kata-kata sendiri.** Setelah paham, tutup percakapan dengan AI, lalu tulis ulang solusinya dari ingatan. Simpan catatannya di catatan belajar Anda.

> [!tip] Templat pertanyaan yang efektif
> "Saya sedang belajar [topik]. Saya mencoba [apa yang dilakukan] dan hasilnya [apa yang terjadi]. Saya mengira [dugaan Anda]. Tolong jelaskan di mana salah pikir saya, dengan petunjuk bertahap, tanpa langsung memberi jawaban akhir."

## Selalu periksa hasil AI

AI bisa salah dengan sangat meyakinkan: nama fungsi yang tidak ada, rumus yang hampir benar, atau angka yang dikarang. Biasakan:

- jalankan kodenya dan cek hasilnya dengan data kecil yang jawabannya Anda tahu,
- cocokkan nama fungsi dengan dokumentasi resmi,
- tanyakan "bagaimana cara saya memeriksa bahwa ini benar?".

## Jangan masukkan data internal ke AI

Ini aturan yang tidak boleh dilanggar. Data dari tempat magang, apalagi yang berisi nama, NIK, alamat, atau nomor telepon warga, tidak boleh ditempel ke AI mana pun, termasuk untuk "sekadar bertanya cara membersihkannya".

> [!warning] Ganti dengan data contoh
> Kalau butuh bantuan untuk data kantor, buat data contoh tiruan dengan struktur kolom yang sama tetapi isi rekaan, misalnya `nama: "Warga A"`, `kecamatan: "Kecamatan 1"`. Tanyakan ke AI dengan data tiruan itu, lalu terapkan sendiri di kantor.

## Catatan belajar

Buat satu dokumen catatan belajar (misalnya di Google Docs atau di repositori GitHub Anda). Setiap kali buntu, catat:

1. apa yang ingin dilakukan,
2. galat atau hasil yang aneh,
3. penyebabnya,
4. cara memperbaikinya, dengan kata-kata sendiri.

Dalam beberapa minggu, catatan ini menjadi rangkuman pribadi yang jauh lebih berguna daripada riwayat percakapan dengan AI.

## Latihan

Tulis ulang permintaan berikut agar AI membantu Anda belajar, bukan mengerjakan untuk Anda.

1. "Jawab soal latihan SQLBolt nomor 3."
2. "Kenapa grafik saya jelek? Perbaiki."

<details><summary>Cek jawaban</summary>

Contoh tulisan ulang:

1. "Saya mengerjakan latihan SQLBolt tentang filter dengan WHERE. Query saya: `SELECT * FROM movies WHERE year > 2000 AND year < 2010;` tapi hasilnya kurang satu film. Tolong beri petunjuk apa yang mungkin terlewat, tanpa langsung memberi query yang benar."
2. "Saya membuat grafik batang jumlah permohonan per kecamatan dengan 25 kecamatan. Grafiknya terasa sulit dibaca. Apa tiga hal yang biasanya membuat grafik batang sulit dibaca, dan bagaimana cara saya memeriksanya sendiri?"

Kuncinya: jelaskan konteks, tunjukkan apa yang sudah dicoba, dan minta petunjuk atau penjelasan.

</details>
