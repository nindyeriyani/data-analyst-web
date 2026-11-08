## Tiga aturan data rapi

Tabel yang mudah dianalisis mengikuti tiga aturan sederhana:

1. **Satu baris untuk satu observasi.** Satu permohonan, satu transaksi, atau satu kunjungan, masing-masing satu baris.
2. **Satu kolom untuk satu variabel.** Tanggal di satu kolom, kecamatan di kolom lain, jumlah di kolom lain.
3. **Satu nilai di setiap sel.** Tidak ada "3 (2 selesai)" atau "Coblong/Cicendo" dalam satu sel.

Data dalam bentuk ini bisa langsung difilter, diringkas dengan pivot table, dan dibaca oleh SQL maupun pandas tanpa diubah lagi.

## Laporan yang enak dibaca belum tentu rapi

Laporan untuk dicetak biasanya disusun agar enak dilihat manusia: judul di atas tabel, sel yang digabung, subtotal di tengah, dan bulan sebagai kolom. Bentuk ini sulit dianalisis.

Contoh laporan (data rekaan):

| Kecamatan | Januari | Februari | Maret |
|---|---|---|---|
| Coblong | 120 | 135 | 98 |
| Sukajadi | 87 | 90 | 102 |

Bentuk rapinya (satu baris per kecamatan per bulan):

```csv
kecamatan,bulan,permohonan
Coblong,2026-01,120
Coblong,2026-02,135
Coblong,2026-03,98
Sukajadi,2026-01,87
Sukajadi,2026-02,90
Sukajadi,2026-03,102
```

Bentuk pertama disebut **lebar** (wide), bentuk kedua **panjang** (long). Bentuk panjang memang terlihat lebih banyak barisnya, tetapi menambah bulan April cukup dengan menambah baris, tanpa mengubah struktur tabel. Menghitung total per bulan atau per kecamatan juga cukup dengan satu pivot table.

> [!warning] Hal yang merusak analisis
> - **Sel yang digabung (merge).** Filter dan pivot table hanya membaca sel pertama.
> - **Baris total di tengah data.** Total ikut terjumlah lagi, sehingga angkanya menjadi dua kali lipat.
> - **Judul atau catatan di atas tabel.** Simpan di sheet lain. Baris pertama data sebaiknya berisi nama kolom.
> - **Warna sebagai data.** "Baris merah artinya terlambat" tidak bisa dihitung rumus. Buat kolom `status` saja.

## Tipe data

Setiap kolom sebaiknya hanya berisi satu tipe data.

| Tipe | Contoh | Ciri di Google Sheets |
|---|---|---|
| Angka | `120`, `2,5` | Rata kanan |
| Teks | `Coblong`, `KTP` | Rata kiri |
| Tanggal | `15/11/2026` | Rata kanan, sebenarnya tersimpan sebagai angka |
| Benar/salah | `TRUE`, `FALSE` | Rata tengah |

### Angka yang tersimpan sebagai teks

Ini masalah paling umum saat menyalin data dari aplikasi lain. Angkanya terlihat normal, tetapi rata kiri, dan rumus `SUM` mengabaikannya. Akibatnya total menjadi lebih kecil dari seharusnya tanpa ada pesan galat.

Cara memeriksa: `=ISNUMBER(C2)` menghasilkan `FALSE` untuk angka yang tersimpan sebagai teks.

Cara memperbaiki:

- Hapus karakter yang bukan angka, misalnya "Rp" dan spasi, lalu ubah dengan `=VALUE(...)`. Contoh: `=VALUE(SUBSTITUTE(SUBSTITUTE(C2;"Rp";"");".";""))` mengubah `Rp 25.000` menjadi `25000`.
- Atau pilih kolomnya lalu buka **Format**, **Angka**, **Angka**.

### Tanggal yang tidak konsisten

Tanggal yang benar tersimpan sebagai angka (jumlah hari sejak tanggal tertentu), sehingga bisa diurutkan dan dihitung selisihnya. Tanggal yang tersimpan sebagai teks hanya bisa diurutkan seperti kata.

> [!tip] Format tanggal yang paling aman
> Saat menulis atau menerima data, pakai format tahun-bulan-hari, misalnya `2026-11-15`. Format ini dibaca sama di semua lokal dan juga urut dengan benar walaupun tersimpan sebagai teks.

## Kategori yang konsisten

`Coblong`, `coblong`, dan `Coblong ` (dengan spasi di belakang) dihitung sebagai tiga kecamatan berbeda. Sebelum meringkas, seragamkan dengan:

- `=TRIM(B2)` untuk membuang spasi berlebih,
- `=PROPER(B2)` untuk huruf kapital di awal setiap kata,
- atau gabungkan: `=PROPER(TRIM(B2))`.

Lalu periksa daftar nilai unik dengan `=UNIQUE(C2:C100)`. Kalau masih ada ejaan berbeda untuk hal yang sama, perbaiki manual.

## Latihan

Ubah tabel lebar berikut menjadi bentuk panjang dengan kolom `layanan`, `triwulan`, dan `jumlah` (data rekaan).

| Layanan | T1 | T2 |
|---|---|---|
| KTP | 340 | 362 |
| KK | 215 | 198 |
| Akta lahir | 120 | 131 |

<details><summary>Cek jawaban</summary>

```csv
layanan,triwulan,jumlah
KTP,T1,340
KTP,T2,362
KK,T1,215
KK,T2,198
Akta lahir,T1,120
Akta lahir,T2,131
```

Enam baris: tiga layanan dikali dua triwulan. Setiap baris berisi satu observasi, yaitu jumlah satu layanan di satu triwulan.

</details>
