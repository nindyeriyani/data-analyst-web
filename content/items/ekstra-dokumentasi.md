## Tujuan

Tulis panduan untuk setiap hasil kerja yang masih dipakai tim (laporan, spreadsheet, dashboard), sehingga rekan **tanpa latar belakang teknis** bisa memakainya dan memperbaruinya tanpa bantuan Anda.

> [!warning] Dokumentasi tetap di kantor
> Panduan ini berisi detail internal, seperti nama file, lokasi folder, dan sumber data. Simpan di folder atau drive instansi, bukan di akun pribadi atau portofolio.

## Untuk setiap hasil kerja, tulis

**1. Ringkasan (3–4 kalimat).** Apa ini, untuk apa, siapa yang memakai, dan seberapa sering diperbarui.

**2. Lokasi.** Di mana file atau dashboard berada, dan siapa yang punya akses edit.

**3. Langkah pembaruan rutin.** Bernomor, satu tindakan per langkah, dengan nama tombol atau menu yang persis seperti di layar. Contoh:

1. Buka aplikasi layanan, menu **Laporan**, pilih bulan yang baru selesai, lalu klik **Ekspor ke Excel**.
2. Buka file `Rekap permohonan` di folder bersama bidang.
3. Di sheet `data`, tempel isi ekspor di bawah baris terakhir. Jangan menghapus baris lama.
4. Buka sheet `ringkasan`. Pivot table akan memperbarui diri. Kalau tidak, klik kanan pada tabel lalu pilih untuk memperbarui atau menyegarkan.
5. Periksa: total bulan baru di `ringkasan` harus sama dengan jumlah baris yang baru ditempel.

**4. Pemeriksaan cepat.** Dua atau tiga cara memastikan hasilnya benar, misalnya membandingkan total dengan sumber, atau memastikan tidak ada nama kecamatan baru yang ejaannya berbeda.

**5. Masalah yang mungkin muncul.** Gejala dan cara mengatasinya:

| Gejala | Kemungkinan penyebab | Cara mengatasi |
|---|---|---|
| Angka bulan baru tidak muncul | Rentang data pivot table tidak mencakup baris baru | Perluas rentang sumber data pivot table |
| Satu kecamatan muncul dua kali | Ejaan atau spasi berbeda | Seragamkan dengan TRIM dan PROPER di kolom data |
| Grafik dashboard kosong | Rentang tanggal tidak mencakup data | Ubah kontrol rentang tanggal |

**6. Kontak.** Siapa yang bisa ditanya setelah Anda pergi (biasanya pembimbing atau rekan yang ditunjuk). Cantumkan email pribadi Anda hanya kalau pembimbing menginginkannya.

## Uji panduannya

Ini langkah terpenting. Minta rekan yang akan melanjutkan untuk **memperbarui laporan sendiri dengan mengikuti panduan**, sementara Anda hanya mengamati tanpa membantu. Setiap kali ia bingung atau bertanya, perbaiki panduannya di titik itu.

> [!tip] Tulis untuk orang yang baru pertama kali
> Hindari istilah seperti "query", "dataset", atau "refresh source" tanpa penjelasan. Kalau sebuah langkah butuh istilah teknis, jelaskan dalam satu kalimat. Tangkapan layar (di dokumen kantor) sangat membantu, asalkan tidak dibagikan ke luar.

## Hasil yang diharapkan

- Satu panduan untuk setiap hasil kerja yang masih dipakai, tersimpan di folder instansi.
- Panduan sudah diuji oleh rekan yang akan melanjutkan.
- Daftar serah terima: hasil kerja, lokasi, penanggung jawab berikutnya, dan tanggal diserahkan.
