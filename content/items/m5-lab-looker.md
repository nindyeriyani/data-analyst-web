## Tujuan

Membuat laporan satu halaman di Looker Studio yang terhubung langsung ke Google Sheets, lengkap dengan kartu skor, grafik, dan filter tanggal. Laporan seperti ini cocok untuk laporan rutin di kantor: datanya cukup diperbarui di Sheets, dan laporan ikut berubah.

> [!tip] Looker Studio sekarang bernama Data Studio
> Alamat lookerstudio.google.com mengarah ke datastudio.google.com, dan dokumentasi Google memakai nama Data Studio. Langkah di bawah berlaku untuk keduanya.

## Langkah 1: siapkan Google Sheets (10 menit)

1. Buat spreadsheet baru bernama `Data toko buku`, lalu tempel data `penjualan_buku.csv` di A1 dan pisahkan menjadi kolom kalau perlu.
2. Di H1 tulis `pendapatan`, lalu di H2 tulis `=F2*G2` dan tarik sampai baris terakhir (H37).
3. Pastikan kolom `tanggal` dikenali sebagai tanggal (rata kanan). Baris pertama harus berisi nama kolom, satu baris saja.

## Langkah 2: hubungkan ke Looker Studio (10 menit)

1. Buka lookerstudio.google.com dengan akun Google yang sama.
2. Klik **Create**, lalu **Data Source**.
3. Pilih konektor **Google Sheets**, lalu pilih spreadsheet `Data toko buku` dan worksheet-nya.
4. Pastikan **Use first row as headers** tercentang.
5. Klik **CONNECT** di kanan atas.
6. Periksa tipe setiap kolom di daftar field: `tanggal` harus bertipe tanggal, `pendapatan`, `jumlah`, dan `harga_satuan` bertipe angka.
7. Klik **CREATE REPORT**, lalu **ADD TO REPORT**.

## Langkah 3: isi laporan (30 menit)

Tambahkan elemen lewat tombol **Add a chart** (atau **Add a new chart**) di toolbar.

1. **Dua kartu skor (scorecard)** di bagian atas: total `pendapatan` dan banyak pesanan (`id_pesanan` dengan agregasi Count). Di tab **STYLE**, aktifkan **Compact numbers** agar angka tampil ringkas.
2. **Grafik deret waktu (time series)**: dimensi `tanggal` (atur ke tingkat bulan), metrik `pendapatan`, dan **breakdown dimension** `kanal`.
3. **Grafik batang**: dimensi `kota`, metrik `pendapatan`, diurutkan menurun.
4. **Kontrol rentang tanggal**: di toolbar pilih **Add a control**, lalu **Date range control**, dan letakkan di kanan atas. Laporan butuh minimal satu field tanggal agar kontrol ini berfungsi. Di panel properti, biarkan **Auto date range** atau atur rentang default.
5. Tambahkan teks judul di atas, dengan pesan utama.

> [!warning] Rentang tanggal default
> Data latihan berada di Juli–September 2026. Kalau rentang default kontrol tanggal (misalnya 28 hari terakhir) tidak mencakup periode itu, grafik akan kosong. Atur rentang khusus 1 Juli–30 September 2026, atau pilih ulang rentang di kontrol saat melihat laporan.

## Langkah 4: uji dan bagikan (10 menit)

1. Klik **View** di kanan atas untuk melihat laporan seperti pembaca melihatnya. Ubah rentang tanggal ke Agustus saja, dan pastikan semua grafik ikut berubah.
2. Ubah satu angka di Google Sheets, lalu muat ulang laporan. Angka di laporan ikut berubah, kadang setelah beberapa saat karena data disimpan sementara (cache).
3. Bagikan lewat tombol **Share** di kanan atas, dengan akses lihat saja untuk orang yang diberi tautan.

## Hasil lab

Laporan satu halaman dengan dua kartu skor, grafik tren per kanal, grafik per kota, dan kontrol tanggal yang berfungsi. Simpan tautannya di catatan belajar.

> [!tip] Untuk tempat magang
> Pola Sheets ke Looker Studio inilah yang paling realistis untuk kantor tanpa tim IT: data tetap di Google Sheets milik instansi, dan laporan diperbarui otomatis. Tugas magang minggu ini memakai pola ini, dengan akun instansi.
