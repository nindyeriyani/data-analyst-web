## Situasi

Sebuah unit layanan administrasi membagikan survei kepuasan kepada pemohon selama satu minggu (data rekaan). Hasilnya dikumpulkan dari formulir kertas yang diketik ulang oleh beberapa petugas, sehingga penulisannya tidak seragam. Pimpinan bertanya:

1. Seberapa puas pemohon secara keseluruhan?
2. Kecamatan mana yang kepuasannya paling rendah?
3. Apakah waktu tunggu berkaitan dengan kepuasan?

Skala `nilai_kepuasan` adalah 1 (sangat tidak puas) sampai 5 (sangat puas).

## Data

Salin data ini ke editor teks polos (TextEdit dalam mode teks polos, lewat **Format**, **Buat Teks Polos**) dan simpan sebagai `survei.csv`, atau tempel ke Google Sheets lalu unduh sebagai CSV. Unggah file itu ke Colab.

```csv
id_responden,tanggal,kecamatan,usia,jenis_kelamin,layanan,nilai_kepuasan,waktu_tunggu_menit
R01,2026-11-02,Coblong,25 tahun,P,KTP,4,15
R02,02/11/2026,coblong ,31,L,KK,5,10
R03,2026-11-03,Sukajadi,47,Laki-laki,KTP,3,45
R04,03/11/2026,SUKAJADI,,P,Akta lahir,2,60
R05,2026-11-03,Cicendo,38,Perempuan,KK,4,20
R06,2026-11-04,Cicendo,22,p,KTP,6,25
R07,2026-11-04,Coblong,56 tahun,L,Akta lahir,5,5
R07,2026-11-04,Coblong,56 tahun,L,Akta lahir,5,5
R08,05/11/2026,Sukajadi,29,L,KK,1,90
R09,2026-11-05,Cicendo,44,P,KTP,,30
R10,2026-11-06,Coblong,35,Laki-laki,KK,4,12
R11,06/11/2026, Cicendo,61,P,Akta lahir,3,40
R12,2026-11-07,Sukajadi,27,l,KTP,2,75
R13,2026-11-07,Coblong,19,P,KTP,5,8
R14,07/11/2026,Cicendo,50 tahun,L,KK,0,35
R15,2026-11-08,Sukajadi,33,P,Akta lahir,3,50
R15,2026-11-08,Sukajadi,33,P,Akta lahir,3,50
R16,2026-11-08,Coblong,42,Perempuan,KTP,4,18
```

## Langkah 1: kenali datanya (10 menit)

Baca file, lalu jalankan `df.shape`, `df.info()`, dan `df.isna().sum()`. Di sel teks, tulis daftar masalah yang Anda lihat sebelum membuka daftar di bawah.

<details><summary>Daftar masalah</summary>

1. Dua baris duplikat: R07 dan R15.
2. Penulisan kecamatan tidak seragam: spasi dan huruf kapital.
3. Kolom `usia` terbaca sebagai teks karena sebagian berisi "tahun", dan satu usia kosong (R04).
4. Jenis kelamin ditulis dengan enam cara: `P`, `p`, `Perempuan`, `L`, `l`, `Laki-laki`.
5. Dua format tanggal: `2026-11-02` dan `02/11/2026`.
6. Dua nilai kepuasan di luar skala 1–5: R06 bernilai 6 dan R14 bernilai 0.
7. Satu nilai kepuasan kosong: R09.

</details>

## Langkah 2: bersihkan (40 menit)

Kerjakan satu masalah per sel, dan beri sel teks singkat di atasnya. Petunjuk:

- Duplikat: `drop_duplicates()`.
- Kecamatan: `.str.strip().str.title()`.
- Usia: hapus kata "tahun" dengan `.str.replace("tahun", "", regex=False)`, lalu `pd.to_numeric`.
- Jenis kelamin: seragamkan dengan kamus lalu `.map()`:

```python
peta = {"p": "P", "perempuan": "P", "l": "L", "laki-laki": "L"}
df["jenis_kelamin"] = df["jenis_kelamin"].str.strip().str.lower().map(peta)
```

- Tanggal: baca dua format secara eksplisit lalu gabungkan, seperti di bacaan pembersihan data.
- Nilai di luar skala: tidak bisa ditebak maksudnya, jadi ubah menjadi kosong:

```python
import numpy as np
df.loc[~df["nilai_kepuasan"].between(1, 5), "nilai_kepuasan"] = np.nan
```

`~` berarti "tidak", jadi baris ini mengosongkan nilai yang tidak berada di antara 1 dan 5. Nilai yang sudah kosong tetap kosong.

Periksa hasilnya: 16 responden, kecamatan hanya Coblong, Sukajadi, dan Cicendo, jenis kelamin hanya P dan L, semua tanggal antara 2 dan 8 November 2026, dan 13 nilai kepuasan yang terisi.

## Langkah 3: jawab pertanyaan (30 menit)

```python
ringkasan = df.groupby("kecamatan").agg(
    responden=("id_responden", "count"),
    nilai_terisi=("nilai_kepuasan", "count"),
    rata_kepuasan=("nilai_kepuasan", "mean"),
    rata_tunggu=("waktu_tunggu_menit", "mean"),
).round(2)
ringkasan
```

Untuk pertanyaan 3, bandingkan rata-rata kepuasan responden yang menunggu lebih dari 30 menit dengan yang tidak, dan hitung korelasinya dengan `df["waktu_tunggu_menit"].corr(df["nilai_kepuasan"])`.

Tulis jawaban untuk pimpinan dalam 3–5 kalimat di sel teks terakhir, termasuk keterbatasan datanya.

<details><summary>Cek jawaban</summary>

**Keseluruhan:** dari 16 responden, 13 nilai kepuasan bisa dipakai (2 di luar skala, 1 kosong). Rata-ratanya **3,46**, dan **53,8%** (7 dari 13) memberi nilai 4 atau 5.

**Per kecamatan:**

| kecamatan | responden | nilai_terisi | rata_kepuasan | rata_tunggu (menit) |
|---|---|---|---|---|
| Cicendo | 5 | 2 | 3,5 | 30,0 |
| Coblong | 6 | 6 | 4,5 | 11,33 |
| Sukajadi | 5 | 5 | 2,2 | 64,0 |

Sukajadi paling rendah (2,2) sekaligus waktu tunggunya paling lama (rata-rata 64 menit). Cicendo hanya punya 2 nilai yang bisa dipakai dari 5 responden, jadi rata-ratanya kurang bisa diandalkan.

**Waktu tunggu:** responden yang menunggu lebih dari 30 menit rata-rata memberi nilai 2,33 (6 orang), sedangkan yang menunggu 30 menit atau kurang memberi 4,43 (7 orang). Korelasinya −0,97, sangat kuat dan negatif.

**Contoh jawaban untuk pimpinan:** "Kepuasan pemohon minggu ini rata-rata 3,5 dari 5, dan sekitar separuh responden merasa puas. Kepuasan terendah di Sukajadi, yang juga punya waktu tunggu terlama (sekitar satu jam). Pemohon yang menunggu lebih dari 30 menit memberi nilai jauh lebih rendah, sehingga mengurangi waktu tunggu kemungkinan besar meningkatkan kepuasan. Catatan: data hanya 16 responden dalam satu minggu, dan 3 nilai tidak bisa dipakai, sehingga temuan ini perlu dikonfirmasi dengan survei yang lebih besar."

</details>

> [!warning] Korelasi kuat belum tentu sebab
> Waktu tunggu dan kepuasan sangat berkaitan di data ini, tetapi bisa saja keduanya dipengaruhi hal lain, misalnya jenis layanan yang lebih rumit sekaligus lebih lama. Tulis kesimpulan dengan kata "kemungkinan" dan sarankan cara memastikannya.

## Hasil lab

Notebook `03-lab-survei.ipynb` di GitHub berisi daftar masalah, langkah pembersihan dengan penjelasan, tabel ringkasan, dan jawaban untuk pimpinan. Notebook ini juga contoh bagus untuk portofolio.
