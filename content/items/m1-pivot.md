## Apa itu pivot table

Pivot table meringkas banyak baris menjadi tabel kecil tanpa menulis rumus: berapa permohonan per kecamatan, rata-rata hari proses per layanan, atau total penjualan per bulan per kota. Pivot table di spreadsheet adalah versi visual dari `GROUP BY` di SQL yang akan Anda pelajari minggu depan.

Gunakan data permohonan dari bacaan "Rumus inti" (12 baris, A1:F13).

## Membuat pivot table di Google Sheets

1. Klik salah satu sel di dalam data.
2. Buka **Sisipkan** (Insert), **Tabel pivot** (Pivot table). Pilih **Sheet baru**, lalu **Buat**.
3. Di panel editor sebelah kanan ada empat bagian:

| Bagian | Fungsi | Contoh |
|---|---|---|
| Baris (Rows) | Kelompok yang menjadi baris | `kecamatan` |
| Kolom (Columns) | Kelompok yang menjadi kolom | `layanan` |
| Nilai (Values) | Angka yang diringkas, dengan cara ringkasnya | `id` dengan COUNTA |
| Filter | Membatasi data yang ikut dihitung | `status` = Selesai |

## Contoh 1: jumlah permohonan per kecamatan dan layanan

- Baris: `kecamatan`
- Kolom: `layanan`
- Nilai: `id`, diringkas dengan **COUNTA** (menghitung isi sel, termasuk teks)

Hasilnya:

| kecamatan | Akta lahir | KK | KTP | Total |
|---|---|---|---|---|
| Cicendo | 1 | 1 | 1 | 3 |
| Coblong | 2 | 1 | 2 | 5 |
| Sukajadi | 1 | 2 | 1 | 4 |
| **Total** | 4 | 4 | 4 | 12 |

Untuk melihat persentase, ubah **Tampilkan sebagai** (Show as) pada nilai menjadi **% dari total keseluruhan**. Coblong menyumbang 41,7% permohonan.

## Contoh 2: rata-rata hari proses per layanan

- Baris: `layanan`
- Nilai: `hari_proses`, diringkas dengan **AVERAGE**

| layanan | Rata-rata hari_proses |
|---|---|
| Akta lahir | 6 |
| KK | 5,25 |
| KTP | 4 |

> [!tip] Selalu cek jumlah barisnya
> Rata-rata dari tiga permohonan tidak bisa dibandingkan begitu saja dengan rata-rata dari tiga ratus. Tambahkan nilai kedua, `id` dengan COUNTA, di samping rata-rata agar pembaca tahu ukuran setiap kelompok.

## Memilih grafik

Pilih grafik berdasarkan pertanyaannya, bukan karena tampilannya menarik.

| Pertanyaan | Grafik yang cocok |
|---|---|
| Membandingkan kategori (kecamatan, layanan) | Batang (bar), diurutkan dari besar ke kecil |
| Perubahan dari waktu ke waktu | Garis (line) |
| Bagian dari keseluruhan, 2–3 bagian saja | Batang bertumpuk 100%, atau pie dengan sangat hati-hati |
| Hubungan dua angka | Sebar (scatter) |

Cara membuat: pilih tabel hasil pivot (tanpa baris Total), lalu **Sisipkan**, **Diagram** (Chart), dan ganti jenisnya di panel editor.

> [!warning] Kebiasaan yang membuat grafik sulit dibaca
> - Pie dengan banyak irisan. Mata manusia sulit membandingkan sudut.
> - Sumbu angka grafik batang yang tidak dimulai dari nol. Perbedaan kecil terlihat sangat besar.
> - Judul seperti "Grafik 1". Lebih baik judul yang menyatakan temuan: "Cicendo paling lama memproses permohonan".
> - Efek 3D dan terlalu banyak warna.

## Latihan

Buat pivot table untuk menjawab: kecamatan mana yang rata-rata hari prosesnya paling lama? Lalu buat grafik batang dari hasilnya, diurutkan dari yang paling lama.

<details><summary>Cek jawaban</summary>

Baris `kecamatan`, nilai `hari_proses` dengan AVERAGE:

| kecamatan | Rata-rata hari_proses |
|---|---|
| Cicendo | 7 |
| Coblong | 5 |
| Sukajadi | 3,75 |

Cicendo paling lama, rata-rata 7 hari kerja. Urutkan pivot dengan mengubah **Urutkan menurut** (Sort by) pada bagian Baris menjadi nilai rata-rata, menurun. Judul grafik yang baik misalnya: "Cicendo rata-rata 7 hari kerja, paling lama dari tiga kecamatan".

Catatan untuk analisis sungguhan: Cicendo hanya punya 3 permohonan di data ini, dan satu di antaranya masih diproses. Dengan data sekecil ini, kesimpulan sebaiknya ditulis hati-hati.

</details>
