## Inti pekerjaan data analyst

Data analyst mengubah data menjadi jawaban yang bisa dipakai untuk mengambil keputusan. Pekerjaannya jarang dimulai dari data; hampir selalu dimulai dari pertanyaan seseorang: "Kenapa jumlah permohonan bulan ini turun?", "Kecamatan mana yang paling lambat melayani?", "Program mana yang paling banyak menjangkau warga?"

Tugas Anda adalah memahami pertanyaan itu, mencari data yang tepat, merapikannya, menganalisisnya, lalu menyampaikan temuan dengan cara yang mudah dipahami orang yang bukan ahli data.

## Pekerjaan sehari-hari

Sebagian besar waktu data analyst habis untuk lima jenis pekerjaan berikut.

| Pekerjaan | Contoh | Alat yang biasa dipakai |
|---|---|---|
| Mengambil data | Menarik data permohonan tiga bulan terakhir dari sistem | SQL, ekspor dari aplikasi, spreadsheet |
| Membersihkan data | Menyeragamkan nama kecamatan yang ditulis berbeda-beda | Spreadsheet, Python (pandas) |
| Menganalisis | Membandingkan waktu layanan per kecamatan per bulan | SQL, pivot table, pandas |
| Membuat visualisasi | Grafik tren bulanan dan dashboard indikator | Tableau, Looker Studio, Google Sheets |
| Menyampaikan temuan | Ringkasan satu halaman dengan tiga temuan utama dan saran | Dokumen, presentasi, dashboard |

> [!tip] Pembersihan data memakan waktu paling banyak
> Banyak survei menunjukkan analis menghabiskan sebagian besar waktunya untuk mencari dan merapikan data, bukan membuat grafik. Jangan berkecil hati kalau langkah ini terasa lambat. Ketelitian di sini menentukan apakah hasil akhirnya bisa dipercaya.

## Data analyst, data scientist, data engineer

Ketiga peran ini sering tertukar. Perbedaannya ada pada pertanyaan yang dijawab.

| Peran | Pertanyaan utama | Hasil kerja |
|---|---|---|
| Data analyst | Apa yang terjadi, dan kenapa? | Laporan, dashboard, rekomendasi |
| Data scientist | Apa yang kemungkinan terjadi selanjutnya? | Model prediksi, eksperimen |
| Data engineer | Bagaimana data sampai ke tempat yang tepat dengan andal? | Pipeline data, gudang data |

Di organisasi kecil atau instansi pemerintah, satu orang sering mengerjakan sebagian dari ketiganya. Itu wajar. Kursus ini fokus pada keterampilan data analyst, karena itulah yang paling cepat terpakai dan paling banyak dicari untuk posisi tingkat awal.

## Keterampilan yang dibutuhkan

**Teknis**

- **Spreadsheet**: rumus, pivot table, dan merapikan data. Masih menjadi alat paling umum di hampir semua kantor.
- **SQL**: bahasa untuk mengambil dan meringkas data dari database. Hampir selalu diuji saat wawancara.
- **Python dengan pandas**: untuk data yang terlalu besar atau terlalu berantakan bagi spreadsheet, dan untuk pekerjaan yang perlu diulang.
- **Visualisasi**: memilih grafik yang tepat dan membuat dashboard yang mudah dibaca.
- **Statistik dasar**: rata-rata, median, sebaran, dan cara tidak tertipu oleh angka.

**Non-teknis**

- **Merumuskan pertanyaan**: mengubah permintaan yang samar menjadi pertanyaan yang bisa dijawab dengan data.
- **Komunikasi**: menjelaskan temuan dalam bahasa sederhana, dengan angka yang relevan saja.
- **Ketelitian dan rasa ingin tahu**: curiga pada angka yang terlalu bagus atau terlalu buruk, lalu memeriksanya.
- **Etika data**: menjaga kerahasiaan data pribadi dan data internal.

## Data analyst di instansi pemerintah

Tempat magang Anda adalah contoh nyata lingkungan kerja data analyst. Pekerjaan yang umum di instansi pemerintah antara lain:

- menyusun laporan rutin bulanan atau tahunan dari data layanan,
- membuat dashboard indikator kinerja untuk pimpinan,
- memeriksa kualitas data yang diisi dari berbagai unit,
- menyiapkan data pendukung untuk perencanaan dan evaluasi program.

> [!warning] Data instansi tetap di instansi
> Data layanan publik sering berisi data pribadi warga. Selama kursus, Anda belajar dengan dataset publik. Pengalaman di tempat magang dicatat sebagai cerita dan pelajaran, bukan dengan menyalin datanya.

## Latihan

Tentukan apakah setiap tugas berikut paling dekat dengan peran data analyst (DA), data scientist (DS), atau data engineer (DE).

1. Membuat dashboard jumlah permohonan izin per bulan untuk rapat pimpinan.
2. Membangun proses otomatis yang menyalin data dari aplikasi layanan ke database setiap malam.
3. Mencari tahu kenapa jumlah pengunjung layanan turun 20% di bulan Maret.
4. Membuat model untuk memperkirakan jumlah permohonan bulan depan.
5. Menyeragamkan penulisan nama desa sebelum data diringkas.

<details><summary>Cek jawaban</summary>

1. **DA**. Menyajikan apa yang terjadi untuk pengambil keputusan.
2. **DE**. Membangun aliran data yang andal dan berjalan otomatis.
3. **DA**. Menjelaskan apa yang terjadi dan kenapa.
4. **DS**. Memprediksi apa yang akan terjadi.
5. **DA**. Membersihkan data adalah bagian besar pekerjaan analis, walaupun di organisasi besar sebagian bisa diotomatisasi oleh data engineer.

</details>
