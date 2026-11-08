## Aturan latihan

Tugas take-home biasanya diberi batas waktu, misalnya 2–48 jam, dan dinilai dari cara berpikir, ketepatan analisis, dan kejelasan penyampaian. Kerjakan latihan ini dalam **dua jam**, dengan pengatur waktu:

- 15 menit: memahami data dan pertanyaan
- 60 menit: analisis di Colab atau Google Sheets
- 30 menit: tiga slide ringkasan
- 15 menit: memeriksa ulang

## Kasus

Sebuah toko daring (data rekaan) menjalankan **promo diskon** selama dua minggu, 19 Oktober–1 November 2026. Dua minggu sebelumnya, 5–18 Oktober, tanpa promo. Datanya harian, per kanal penjualan (Aplikasi dan Situs).

Manajer bertanya:

1. Apakah promo berhasil?
2. Kanal mana yang paling merespons promo?
3. Apakah promo sebaiknya diulang, dan apa yang perlu diperbaiki?

## Data

`pendapatan` dalam rupiah, setelah diskon.

```csv
tanggal,kanal,promo,pengunjung,pesanan,pendapatan
2026-10-05,Aplikasi,tidak,1200,50,7923000
2026-10-05,Situs,tidak,803,29,4264000
2026-10-06,Aplikasi,tidak,1162,50,8285000
2026-10-06,Situs,tidak,744,22,3392000
2026-10-07,Aplikasi,tidak,1119,53,8294000
2026-10-07,Situs,tidak,689,16,2278000
2026-10-08,Aplikasi,tidak,1216,43,6381000
2026-10-08,Situs,tidak,767,24,3616000
2026-10-09,Aplikasi,tidak,1108,50,7927000
2026-10-09,Situs,tidak,751,19,2758000
2026-10-10,Aplikasi,tidak,1378,66,10841000
2026-10-10,Situs,tidak,926,28,3994000
2026-10-11,Aplikasi,tidak,1384,61,10411000
2026-10-11,Situs,tidak,927,34,5508000
2026-10-12,Aplikasi,tidak,1245,46,7765000
2026-10-12,Situs,tidak,788,28,4189000
2026-10-13,Aplikasi,tidak,1240,48,7736000
2026-10-13,Situs,tidak,788,18,2824000
2026-10-14,Aplikasi,tidak,1120,47,7137000
2026-10-14,Situs,tidak,772,18,2836000
2026-10-15,Aplikasi,tidak,1241,50,8109000
2026-10-15,Situs,tidak,781,19,2836000
2026-10-16,Aplikasi,tidak,1188,44,7131000
2026-10-16,Situs,tidak,869,18,2697000
2026-10-17,Aplikasi,tidak,1420,50,8248000
2026-10-17,Situs,tidak,955,27,4106000
2026-10-18,Aplikasi,tidak,1278,56,10070000
2026-10-18,Situs,tidak,870,27,4083000
2026-10-19,Aplikasi,ya,1349,68,10258000
2026-10-19,Situs,ya,891,30,3866000
2026-10-20,Aplikasi,ya,1312,71,10459000
2026-10-20,Situs,ya,752,20,2456000
2026-10-21,Aplikasi,ya,1365,63,9196000
2026-10-21,Situs,ya,787,25,3490000
2026-10-22,Aplikasi,ya,1316,68,9560000
2026-10-22,Situs,ya,842,20,2773000
2026-10-23,Aplikasi,ya,1310,89,12564000
2026-10-23,Situs,ya,860,31,4093000
2026-10-24,Aplikasi,ya,1495,85,11944000
2026-10-24,Situs,ya,1111,45,6020000
2026-10-25,Aplikasi,ya,1602,77,11509000
2026-10-25,Situs,ya,1010,35,4704000
2026-10-26,Aplikasi,ya,1287,70,9958000
2026-10-26,Situs,ya,897,35,4538000
2026-10-27,Aplikasi,ya,1289,68,9814000
2026-10-27,Situs,ya,881,25,3390000
2026-10-28,Aplikasi,ya,1342,62,9344000
2026-10-28,Situs,ya,937,28,3812000
2026-10-29,Aplikasi,ya,1369,66,9914000
2026-10-29,Situs,ya,909,34,4825000
2026-10-30,Aplikasi,ya,1409,70,10496000
2026-10-30,Situs,ya,819,28,3820000
2026-10-31,Aplikasi,ya,1419,58,8437000
2026-10-31,Situs,ya,997,47,5828000
2026-11-01,Aplikasi,ya,1508,71,10518000
2026-11-01,Situs,ya,1008,24,3085000
```

## Petunjuk analisis

- Hitung untuk setiap periode dan kanal: total pengunjung, pesanan, pendapatan, **tingkat konversi** (pesanan ÷ pengunjung), dan **nilai rata-rata pesanan** (pendapatan ÷ pesanan).
- Bandingkan sebelum dan selama promo. Lihat juga grafik harian.
- Pikirkan: informasi apa yang **tidak ada** di data ini, tetapi penting untuk menjawab "apakah promo berhasil"?

## Tiga slide

1. **Jawaban utama:** satu kalimat kesimpulan, ditambah dua atau tiga angka kunci.
2. **Bukti:** satu atau dua grafik dengan judul yang menyatakan temuan.
3. **Rekomendasi dan keterbatasan:** apa yang disarankan, dan data apa yang dibutuhkan untuk keputusan yang lebih yakin.

Buat di Google Slides, lalu simpan sebagai PDF.

<details><summary>Cek jawaban</summary>

Ringkasan per periode (14 hari masing-masing):

| | Tanpa promo | Dengan promo | Perubahan |
|---|---|---|---|
| Pengunjung | 28.729 | 32.073 | +11,6% |
| Pesanan | 1.041 | 1.413 | +35,7% |
| Pendapatan | Rp165.639.000 | Rp200.671.000 | +21,1% |
| Konversi | 3,62% | 4,41% | naik 0,79 poin |
| Nilai rata-rata pesanan | Rp159.115 | Rp142.018 | −10,7% |

Per kanal:

| Kanal | Konversi tanpa → dengan promo | Nilai rata-rata pesanan |
|---|---|---|
| Aplikasi | 4,13% → 5,09% | Rp162.826 → Rp146.015 |
| Situs | 2,86% → 3,36% | Rp151.012 → Rp132.787 |

**Temuan yang diharapkan:**

1. Promo menaikkan pesanan sekitar 36%, tetapi pendapatan hanya naik sekitar 21%, karena nilai rata-rata pesanan turun sekitar 11% akibat diskon.
2. Aplikasi merespons lebih kuat: konversinya naik hampir 1 poin persen, dibandingkan sekitar 0,5 poin di Situs.
3. Pengunjung juga naik sekitar 12%, kemungkinan karena promosi kampanye.

**Keterbatasan yang seharusnya disebut:**

- **Tidak ada data biaya.** Pendapatan naik, tetapi tanpa biaya diskon, biaya iklan, dan margin, belum bisa dipastikan promo menguntungkan.
- **Bukan eksperimen.** Ini perbandingan sebelum dan sesudah. Bisa ada faktor lain, misalnya musim atau tanggal gajian, walaupun kedua periode sama-sama berisi dua minggu penuh dengan akhir pekan yang sama banyak.
- **Efek setelah promo tidak terlihat.** Pelanggan mungkin hanya memajukan pembelian, sehingga penjualan turun setelah promo berakhir.

**Contoh rekomendasi:** ulangi promo dengan fokus di Aplikasi, uji dengan A/B test (sebagian pengguna mendapat promo, sebagian tidak), dan sertakan data margin serta pantau dua minggu setelah promo untuk menilai keuntungan sebenarnya.

Yang paling dinilai dalam take-home adalah poin keterbatasan dan cara Anda menjelaskannya, bukan hanya angka.

</details>
