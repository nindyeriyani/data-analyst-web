## Membaca koefisien korelasi

Koefisien korelasi (r) mengukur seberapa kuat dua angka bergerak bersama secara **linear**, dari −1 sampai 1.

| Nilai r | Arti |
|---|---|
| Mendekati 1 | Keduanya naik bersama |
| Mendekati −1 | Yang satu naik, yang lain turun |
| Sekitar 0 | Tidak ada hubungan linear |

Sebagai patokan kasar: |r| di bawah 0,3 lemah, 0,3–0,7 sedang, dan di atas 0,7 kuat. Patokan ini bukan aturan baku, dan arti "kuat" bergantung pada bidangnya.

Di pandas:

```python
df["waktu_tunggu_menit"].corr(df["nilai_kepuasan"])   # dua kolom
df[["kolom1", "kolom2", "kolom3"]].corr()              # semua pasangan
```

Di lab survei modul Python, korelasi waktu tunggu dengan nilai kepuasan adalah **−0,97**: semakin lama menunggu, semakin rendah kepuasan.

> [!warning] Korelasi hanya menangkap hubungan garis lurus
> Dua hal bisa berhubungan kuat tetapi tidak lurus, misalnya kepuasan naik saat waktu tunggu turun dari 60 ke 20 menit, lalu tidak berubah lagi di bawah 20 menit. Koefisien korelasi bisa terlihat lemah untuk pola seperti itu. Selalu lihat grafik sebar (scatter plot) juga, jangan hanya angkanya.

## Korelasi bukan kausalitas

Korelasi kuat tidak membuktikan bahwa yang satu menyebabkan yang lain. Ada tiga kemungkinan lain yang harus dipikirkan.

### 1. Faktor ketiga (variabel perancu)

Data rekaan delapan hari di sebuah kota:

| suhu (°C) | es teh terjual | pengunjung kolam renang |
|---|---|---|
| 27 | 120 | 80 |
| 28 | 135 | 90 |
| 29 | 150 | 95 |
| 30 | 160 | 110 |
| 31 | 180 | 120 |
| 32 | 195 | 130 |
| 33 | 210 | 150 |
| 34 | 230 | 160 |

Korelasi penjualan es teh dengan pengunjung kolam renang sekitar **0,99**. Apakah minum es teh membuat orang ingin berenang? Tentu tidak. Keduanya naik karena **suhu**. Suhu adalah faktor ketiga yang memengaruhi keduanya.

### 2. Arah sebab terbalik

Kecamatan dengan petugas lebih banyak ternyata punya antrean lebih panjang. Bukan petugas yang menyebabkan antrean; kecamatan yang antreannya panjang justru diberi petugas tambahan.

### 3. Kebetulan

Dengan cukup banyak pasangan data, beberapa akan berkorelasi kuat secara kebetulan. Ini terutama terjadi pada data yang sedikit, misalnya hanya 5–10 titik.

## Contoh kesimpulan keliru di laporan

| Kesimpulan di laporan | Masalahnya | Kalimat yang lebih tepat |
|---|---|---|
| "Pelatihan menaikkan omzet UMKM 40%." | Tidak ada pembanding; mungkin omzet semua UMKM naik karena musim | "Omzet peserta naik 40%; perlu dibandingkan dengan UMKM serupa yang tidak ikut pelatihan." |
| "Unit dengan aplikasi baru lebih cepat, jadi aplikasi itu efektif." | Unit yang dipilih mungkin memang sudah cepat sebelumnya | "Unit pengguna aplikasi baru lebih cepat; perlu dibandingkan dengan kondisinya sebelum memakai aplikasi." |
| "Waktu tunggu menyebabkan ketidakpuasan." | Bisa jadi layanan rumit membuat waktu tunggu lama dan sekaligus tidak memuaskan | "Waktu tunggu sangat berkaitan dengan kepuasan; kemungkinan mengurangi waktu tunggu meningkatkan kepuasan." |

> [!tip] Cara membuktikan sebab-akibat
> Cara terkuat adalah eksperimen terkontrol: membagi secara acak siapa yang mendapat perlakuan dan siapa yang tidak, lalu membandingkan hasilnya. Inilah ide A/B test di bacaan berikutnya. Kalau eksperimen tidak mungkin, gunakan kata hati-hati seperti "berkaitan dengan" dan "kemungkinan".

## Latihan

Sebuah laporan menulis: "Desa yang punya lebih banyak posyandu memiliki angka balita sakit yang lebih tinggi. Karena itu posyandu tidak efektif."

1. Kenapa kesimpulan ini keliru?
2. Sebutkan satu faktor ketiga yang mungkin.

<details><summary>Cek jawaban</summary>

1. Ini korelasi, bukan bukti sebab. Arah sebabnya bisa terbalik: desa dengan banyak balita sakit diprioritaskan untuk mendapat posyandu tambahan. Selain itu, desa dengan banyak posyandu mungkin lebih banyak **mencatat** balita sakit karena lebih sering diperiksa, bukan karena lebih banyak yang sakit.
2. Jumlah penduduk atau jumlah balita: desa yang lebih besar punya lebih banyak posyandu sekaligus lebih banyak balita sakit secara angka mutlak. Membandingkan **persentase** balita sakit, bukan jumlahnya, mengurangi masalah ini.

</details>
