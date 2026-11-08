## Data latihan

Salin data rekaan ini ke sheet baru, mulai dari sel A1. Setiap baris adalah satu permohonan layanan, dan `hari_proses` adalah lama penyelesaian dalam hari kerja.

```csv
id,tanggal,kecamatan,layanan,hari_proses,status
P01,2026-10-01,Coblong,KTP,3,Selesai
P02,2026-10-01,Sukajadi,KK,6,Selesai
P03,2026-10-02,Coblong,Akta lahir,4,Selesai
P04,2026-10-03,Cicendo,KTP,7,Selesai
P05,2026-10-06,Sukajadi,KTP,2,Selesai
P06,2026-10-07,Coblong,KK,5,Selesai
P07,2026-10-08,Cicendo,Akta lahir,8,Selesai
P08,2026-10-09,Sukajadi,Akta lahir,3,Selesai
P09,2026-10-10,Coblong,KTP,4,Selesai
P10,2026-10-13,Cicendo,KK,6,Diproses
P11,2026-10-14,Sukajadi,KK,4,Selesai
P12,2026-10-15,Coblong,Akta lahir,9,Diproses
```

Data berada di A1:F13: kolom C `kecamatan`, D `layanan`, E `hari_proses`, F `status`.

## IF: memberi label berdasarkan syarat

`IF(syarat; nilai_jika_benar; nilai_jika_salah)`

Di G1 tulis `kategori`, lalu di G2:

```
=IF(E2>5; "Terlambat"; "Tepat waktu")
```

Tarik ke bawah sampai G13. Lima permohonan berlabel "Terlambat": P02, P04, P07, P10, dan P12.

IF bisa ditumpuk, tetapi cepat sulit dibaca. Untuk lebih dari dua kategori, `IFS` lebih rapi:

```
=IFS(E2<=3; "Cepat"; E2<=5; "Normal"; TRUE; "Lambat")
```

## COUNTIFS: menghitung baris yang memenuhi syarat

`COUNTIFS(rentang1; syarat1; rentang2; syarat2; ...)`

```
=COUNTIFS(C2:C13; "Coblong"; F2:F13; "Selesai")
```

Hasilnya **4**: dari lima permohonan di Coblong, satu masih diproses. Syarat bisa juga berupa perbandingan dalam tanda kutip:

```
=COUNTIFS(E2:E13; ">5")
```

Hasilnya **5**, sama dengan jumlah label "Terlambat".

## SUMIFS: menjumlahkan nilai yang memenuhi syarat

`SUMIFS(rentang_dijumlah; rentang1; syarat1; ...)`. Perhatikan bahwa rentang yang dijumlah ditulis paling depan.

```
=SUMIFS(E2:E13; D2:D13; "KK"; F2:F13; "Selesai")
```

Hasilnya **15**, yaitu jumlah hari proses permohonan KK yang sudah selesai (6 + 5 + 4).

> [!tip] Rata-rata bersyarat
> `AVERAGEIFS` bekerja seperti SUMIFS: `=AVERAGEIFS(E2:E13; D2:D13; "KTP")` menghasilkan rata-rata hari proses KTP. Coba hitung sendiri sebelum melihat jawaban latihan.

## XLOOKUP: mengambil nilai dari tabel lain

Misalkan setiap layanan punya target hari proses. Tulis tabel kecil ini di I1:J4:

```csv
layanan,target_hari
KTP,3
KK,5
Akta lahir,5
```

`XLOOKUP(nilai_dicari; rentang_pencarian; rentang_hasil; [jika_tidak_ditemukan])`

Di H1 tulis `target`, lalu di H2:

```
=XLOOKUP(D2; $I$2:$I$4; $J$2:$J$4; "tidak ada")
```

Tanda `$` membuat rentang tetap saat rumus ditarik ke bawah. Lalu gabungkan dengan IF untuk menandai permohonan yang melewati target:

```
=IF(E2>H2; "Melewati target"; "Sesuai target")
```

Ada **6** permohonan yang melewati target: P02, P04, P07, P09, P10, dan P12. Perhatikan P09: empat hari terlihat cepat, tetapi target KTP hanya tiga hari.

> [!warning] Jangan mengetik target langsung di rumus
> `=IF(E2>3; ...)` tampak praktis, tetapi kalau target berubah Anda harus mencari dan mengganti setiap rumus. Simpan angka seperti target, tarif, atau batas di tabel tersendiri, lalu ambil dengan XLOOKUP.

## Kesalahan yang sering terjadi

| Gejala | Penyebab umum |
|---|---|
| `#ERROR!` atau rumus tidak diterima | Pemisah argumen salah: lokal Indonesia memakai `;` |
| `#N/A` pada XLOOKUP | Nilai yang dicari tidak persis sama, misalnya ada spasi tambahan |
| COUNTIFS hasilnya 0 padahal datanya ada | Ejaan atau spasi berbeda, atau angka tersimpan sebagai teks |
| Hasil berubah saat rumus ditarik | Lupa tanda `$` pada rentang yang harus tetap |

## Latihan

Dengan data latihan di atas, tulis rumus untuk menjawab:

1. Berapa permohonan dari Sukajadi?
2. Berapa total hari proses di Cicendo?
3. Berapa permohonan Akta lahir yang hari prosesnya lebih dari 5?
4. Berapa rata-rata hari proses KTP?

<details><summary>Cek jawaban</summary>

```
=COUNTIFS(C2:C13; "Sukajadi")                       → 4
=SUMIFS(E2:E13; C2:C13; "Cicendo")                  → 21
=COUNTIFS(D2:D13; "Akta lahir"; E2:E13; ">5")       → 2
=AVERAGEIFS(E2:E13; D2:D13; "KTP")                  → 4
```

Nomor 3 menghitung P07 (8 hari) dan P12 (9 hari). Nomor 4: (3 + 7 + 2 + 4) / 4 = 4.

</details>
