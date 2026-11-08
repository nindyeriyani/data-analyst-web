## Cara perekrut membaca README

Perekrut membaca dari atas: judul, beberapa kalimat pertama, lalu gambar. Kalau bagian atas tidak menjawab "proyek ini tentang apa dan apa hasilnya", kemungkinan besar ia tidak lanjut membaca. Karena itu ringkasan selalu ditaruh paling atas, dan rincian teknis di bawah.

## Struktur yang disarankan

```markdown
# Siapa pelanggan terbaik theLook, dan siapa yang mulai menjauh?

**Ringkasan.** Saya menganalisis pesanan selesai di toko daring theLook selama 2025
dengan SQL di BigQuery. Segmentasi RFM menunjukkan [temuan utama dengan angka].
Retensi kohort menunjukkan [temuan kedua]. Rekomendasi utama: [satu kalimat].

**Dashboard:** [tautan Tableau Public] · **Alat:** BigQuery (SQL), Tableau Public

![Tangkapan layar dashboard](gambar/dashboard.png)

## Pertanyaan
1. ...
2. ...

## Data dan ruang lingkup
- Sumber: BigQuery public dataset `thelook_ecommerce` (data rekaan buatan Google)
- Rentang waktu, definisi pesanan terjual, tanggal acuan

## Metode
- Aturan skor dan segmen RFM
- Definisi kohort dan retensi

## Temuan
Tabel kecil atau grafik, masing-masing dengan 1–2 kalimat interpretasi.

## Rekomendasi
1. ...

## Keterbatasan
- ...

## Struktur folder
- `sql/` query yang dipakai, satu file per pertanyaan
```

## Ciri README yang baik

| Kurang | Lebih baik |
|---|---|
| Judul "Project 1" | Judul berupa pertanyaan atau temuan |
| Dimulai dengan cara instalasi | Dimulai dengan ringkasan hasil |
| Hanya daftar query | Setiap query punya pertanyaan dan interpretasi |
| Tanpa gambar | Satu tangkapan layar dashboard di atas |
| Tidak menyebut sumber data | Sumber, rentang waktu, dan definisi jelas |
| Klaim tanpa batasan | Ada bagian keterbatasan |

> [!tip] Uji dua menit
> Minta teman membaca README Anda selama dua menit, lalu tanyakan: "Proyek ini tentang apa, dan apa temuan utamanya?" Kalau jawabannya tepat, README Anda berhasil.

## README utama repositori

Repositori `portofolio-data-analyst` juga butuh README utama yang berfungsi sebagai daftar isi. Perbarui README yang Anda buat di minggu 1:

- satu paragraf tentang Anda,
- tabel tiga proyek: judul, satu kalimat temuan, alat, dan tautan,
- tautan ke situs portofolio, LinkedIn, dan CV.

> [!warning] Periksa tautan dan gambar
> Buka setiap README di GitHub (bukan hanya di editor), klik setiap tautan, dan pastikan semua gambar tampil. Tautan ke dashboard yang rusak meninggalkan kesan buruk.

## Latihan

Tulis ulang ringkasan berikut agar menjawab "apa hasilnya":

> "Proyek ini menggunakan Python dan pandas untuk menganalisis data BPS tentang pengangguran. Saya membersihkan data, membuat grafik, dan membuat dashboard."

<details><summary>Cek jawaban</summary>

Contoh (angka hanya ilustrasi, gunakan temuan Anda sendiri):

> "Tingkat pengangguran terbuka di [provinsi] turun dari X% pada 2021 menjadi Y% pada 2025, tetapi tiga kabupaten justru naik dan kini berada di atas rata-rata provinsi. Dashboard ini membantu pemerintah daerah melihat wilayah mana yang perlu perhatian. Data dari BPS, diolah dengan pandas, divisualisasikan di Tableau Public."

Kalimat pertama menyatakan temuan, kalimat kedua manfaat, kalimat ketiga alat dan sumber.

</details>
