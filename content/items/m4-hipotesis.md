## Pertanyaan yang dijawab

Sebuah unit layanan menguji dua versi SMS pengingat pengambilan dokumen (data rekaan):

- **Versi A** (lama) dikirim ke 1.000 pemohon: 120 orang mengambil dokumen dalam tiga hari (12,0%).
- **Versi B** (baru, lebih singkat dan mencantumkan jam layanan) dikirim ke 1.000 pemohon lain: 160 orang mengambil (16,0%).

Versi B lebih tinggi 4 poin persen. Pertanyaannya: **apakah perbedaan ini nyata, atau bisa saja hanya kebetulan?** Kalau SMS yang sama dikirim dua kali ke kelompok berbeda, hasilnya pun tidak akan persis sama. Uji hipotesis membantu memisahkan perbedaan nyata dari variasi kebetulan.

## Ide dasarnya

1. **Hipotesis nol (H0):** tidak ada perbedaan; kedua versi sama efektifnya, dan selisih yang terlihat hanya kebetulan.
2. **Hipotesis alternatif (H1):** ada perbedaan.
3. Hitung **p-value**: seberapa mungkin melihat selisih sebesar ini (atau lebih) **kalau H0 benar**.
4. Kalau p-value kecil, biasanya di bawah 0,05, selisih sebesar itu sulit dijelaskan sebagai kebetulan. Kita **menolak H0** dan menyebut hasilnya **signifikan secara statistik**.

> [!warning] Arti p-value yang sering salah dipahami
> p-value **bukan** peluang bahwa H0 benar, dan **bukan** ukuran seberapa besar atau penting perbedaannya. p-value hanya menjawab: "kalau sebenarnya tidak ada perbedaan, seberapa jarang data seperti ini muncul?"

## Menghitung di Colab

Untuk membandingkan dua proporsi, misalnya persentase yang mengambil dokumen, pakai uji z dua proporsi:

```python
from statsmodels.stats.proportion import proportions_ztest

berhasil = [160, 120]      # B, A
dikirim = [1000, 1000]

z, p = proportions_ztest(berhasil, dikirim)
print(round(z, 2), round(p, 4))   # 2.58  0.0099
```

p-value sekitar **0,01**, di bawah 0,05. Kesimpulannya: perbedaan 12,0% dan 16,0% kemungkinan besar nyata, bukan kebetulan. Versi B layak dipakai.

## Ukuran sampel menentukan banyak hal

Bandingkan tiga situasi berikut:

| Situasi | A | B | Selisih | p-value | Kesimpulan |
|---|---|---|---|---|---|
| 1.000 per versi | 12,0% | 16,0% | 4 poin | 0,010 | Signifikan |
| 100 per versi | 12,0% | 16,0% | 4 poin | 0,415 | Tidak signifikan |
| 100.000 per versi | 12,0% | 12,4% | 0,4 poin | 0,006 | Signifikan, tetapi kecil |

- **Baris 1 dan 2:** selisihnya sama persis, tetapi dengan 100 orang per versi variasi kebetulannya terlalu besar untuk menyimpulkan apa pun. "Tidak signifikan" di sini artinya **belum ada cukup bukti**, bukan "terbukti tidak ada perbedaan".
- **Baris 3:** dengan sampel sangat besar, selisih yang sangat kecil pun signifikan. Tetapi apakah kenaikan 0,4 poin sepadan dengan biaya mengganti sistem? Itu pertanyaan bisnis, bukan statistik.

> [!tip] Signifikan secara statistik ≠ penting secara praktis
> Selalu laporkan **besar perbedaannya** (misalnya 4 poin persen, atau 40 dokumen lebih banyak per 1.000 SMS) di samping p-value. Pengambil keputusan butuh keduanya.

## Syarat A/B test yang baik

- **Pembagian acak.** Siapa yang menerima A dan siapa yang menerima B ditentukan secara acak. Kalau versi B hanya dikirim ke kecamatan yang sudah biasa cepat mengambil dokumen, perbedaannya bukan karena SMS.
- **Satu perubahan dalam satu waktu.** Kalau isi, jam kirim, dan pengirimnya diubah sekaligus, Anda tidak tahu mana yang berpengaruh.
- **Waktu yang sama.** Jalankan A dan B bersamaan, bukan A di bulan Januari dan B di bulan Februari.
- **Tentukan ukuran keberhasilan dan lamanya uji sebelum mulai**, jangan setelah melihat hasil. Mengintip hasil setiap hari lalu berhenti saat kebetulan signifikan membuat kesimpulan menyesatkan.

## Menulis hasil untuk pimpinan

> "Dari 2.000 pemohon yang dibagi acak, versi SMS baru membuat 16% pemohon mengambil dokumen dalam tiga hari, dibandingkan 12% dengan versi lama. Artinya sekitar 40 dokumen lebih banyak terambil per 1.000 SMS. Perbedaan ini sangat kecil kemungkinannya terjadi karena kebetulan (p ≈ 0,01). Kami menyarankan memakai versi baru untuk semua pengingat."

## Latihan

Sebuah unit menguji dua tata letak formulir daring. Tata letak lama: 45 dari 300 pengunjung menyelesaikan formulir (15%). Tata letak baru: 54 dari 300 (18%).

1. Tulis H0 dan H1.
2. Jalankan `proportions_ztest([54, 45], [300, 300])`. Apa kesimpulannya?
3. Apa yang Anda sarankan?

<details><summary>Cek jawaban</summary>

1. H0: tingkat penyelesaian kedua tata letak sama. H1: tingkat penyelesaiannya berbeda.
2. Hasilnya z sekitar 0,99 dan p sekitar 0,32. p di atas 0,05, jadi perbedaan 3 poin persen belum cukup bukti untuk disebut nyata. Bisa saja kebetulan.
3. Jangan langsung menyimpulkan tata letak baru lebih baik atau sama saja. Lanjutkan uji dengan lebih banyak pengunjung, dengan ukuran sampel yang ditentukan di awal, atau putuskan berdasarkan pertimbangan lain (misalnya biaya) sambil menyebut bahwa datanya belum meyakinkan.

</details>
