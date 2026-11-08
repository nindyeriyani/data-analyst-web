## Data contoh

Data rekaan pendaftar pelatihan UMKM ini berisi masalah yang umum ditemui. Tempel ke satu sel Colab dan jalankan. `io.StringIO` membuat teks bisa dibaca seperti file, jadi tidak perlu mengunggah apa pun.

```python
import io
import pandas as pd

data = """id,tanggal_daftar,kecamatan,usia,omzet_bulanan,sektor
D01,2026-03-02,Coblong,34,Rp 5.000.000,Kuliner
D02,03/03/2026, coblong,41,Rp 12.500.000,Fesyen
D03,2026-03-04,SUKAJADI,,Rp 3.000.000,Kuliner
D04,2026-03-04,Sukajadi,29,Rp 7.250.000,Kerajinan
D04,2026-03-04,Sukajadi,29,Rp 7.250.000,Kerajinan
D05,05/03/2026,Cicendo ,52,Rp 20.000.000,Kuliner
D06,2026-03-06,cicendo,38,,Fesyen
D07,2026-03-07,Coblong,45,Rp 9.000.000,kuliner
D08,08/03/2026,Sukajadi,,Rp 4.500.000,Kerajinan
"""
df = pd.read_csv(io.StringIO(data))
df.shape   # (9, 6)
```

## 1. Periksa nilai kosong

```python
df.isna().sum()
```

`usia` kosong 2, `omzet_bulanan` kosong 1, kolom lain lengkap. `isna()` menandai setiap sel kosong dengan `True`, lalu `.sum()` menghitungnya per kolom.

## 2. Hapus duplikat

```python
df.duplicated().sum()     # 1
df = df.drop_duplicates()
df.shape                  # (8, 6)
```

`drop_duplicates()` membuang baris yang identik di semua kolom. Untuk mencari id ganda dengan isi berbeda: `df[df["id"].duplicated(keep=False)]`.

## 3. Rapikan teks

Fungsi teks di pandas dipanggil lewat `.str`:

```python
df["kecamatan"] = df["kecamatan"].str.strip().str.title()
df["sektor"] = df["sektor"].str.strip().str.capitalize()
df["kecamatan"].value_counts()
```

Setelah dirapikan: Coblong 3, Sukajadi 3, Cicendo 2. Selalu cek dengan `value_counts()` setelah merapikan teks.

| Fungsi | Hasil |
|---|---|
| `.str.strip()` | buang spasi di depan dan belakang |
| `.str.title()` | Huruf Kapital Di Awal Setiap Kata |
| `.str.capitalize()` | Hanya huruf pertama kapital |
| `.str.lower()`, `.str.upper()` | huruf kecil, HURUF BESAR |
| `.str.replace("a", "b", regex=False)` | ganti teks |
| `.str.contains("kata")` | `True` jika mengandung teks |

## 4. Ubah teks menjadi angka

```python
df["omzet_bulanan"] = (
    df["omzet_bulanan"]
    .str.replace("Rp", "", regex=False)
    .str.replace(".", "", regex=False)
    .str.strip()
)
df["omzet_bulanan"] = pd.to_numeric(df["omzet_bulanan"])
```

`regex=False` penting di sini. Tanpanya, titik dibaca sebagai pola "karakter apa saja" sehingga seluruh teks bisa terhapus. Hasilnya kolom angka bertipe `float64`. Pandas memakai float karena ada satu nilai kosong (`NaN`), yang tidak bisa disimpan di kolom bilangan bulat biasa.

> [!tip] errors="coerce" untuk data yang sangat berantakan
> `pd.to_numeric(kolom, errors="coerce")` mengubah nilai yang tidak bisa dibaca menjadi `NaN` alih-alih galat. Setelah itu, periksa baris yang menjadi `NaN` untuk memastikan tidak ada data yang hilang tanpa sengaja.

## 5. Ubah teks menjadi tanggal

Kolom `tanggal_daftar` berisi dua format: `2026-03-02` dan `03/03/2026` (hari/bulan/tahun). Cara yang aman adalah membaca setiap format secara eksplisit, lalu menggabungkan hasilnya:

```python
iso = pd.to_datetime(df["tanggal_daftar"], format="%Y-%m-%d", errors="coerce")
dmy = pd.to_datetime(df["tanggal_daftar"], format="%d/%m/%Y", errors="coerce")
df["tanggal_daftar"] = iso.fillna(dmy)
df["tanggal_daftar"].isna().sum()   # 0 artinya semua terbaca
```

Semua tanggal sekarang berada di 2–8 Maret 2026, sesuai dugaan.

> [!warning] Jangan percaya pembacaan otomatis begitu saja
> `pd.to_datetime(kolom, format="mixed", dayfirst=True)` terlihat praktis, tetapi pada data ini ia membaca `2026-03-02` sebagai **3 Februari**, karena aturan "hari dulu" ikut diterapkan ke format tahun-bulan-hari. Tidak ada pesan galat sama sekali. Setelah mengubah tanggal, selalu cek `min()` dan `max()`-nya: `df["tanggal_daftar"].min(), df["tanggal_daftar"].max()`.

## 6. Tangani nilai kosong

Tidak ada satu aturan untuk semua kasus. Pilih berdasarkan pertanyaan analisisnya, lalu catat keputusannya.

| Pilihan | Kode | Kapan cocok |
|---|---|---|
| Biarkan | (tanpa kode) | Fungsi seperti `mean()` dan `median()` otomatis melewatkan `NaN` |
| Isi dengan nilai lain | `df["usia"].fillna(df["usia"].median())` | Kalau nilai pengganti masuk akal dan tidak mengubah kesimpulan |
| Buang barisnya | `df.dropna(subset=["omzet_bulanan"])` | Kalau kolom itu wajib untuk analisis yang sedang dikerjakan |

Pada data ini, rata-rata omzet dari 7 pendaftar yang mengisi adalah Rp8.750.000. Kalau usia yang kosong diisi median (39,5), berarti Anda menebak usia dua orang. Untuk analisis per kelompok usia, lebih jujur membiarkannya kosong dan menyebut bahwa 2 dari 8 pendaftar tidak mengisi usia.

## Urutan kerja yang disarankan

1. `df.shape`, `df.info()`, `df.isna().sum()`: kenali data.
2. Hapus duplikat.
3. Rapikan teks, lalu cek dengan `value_counts()`.
4. Ubah tipe: angka dan tanggal, lalu cek `min()` dan `max()`.
5. Putuskan nilai kosong, dan catat keputusannya di sel teks.
6. Simpan data bersih: `df.to_csv("pendaftar_bersih.csv", index=False)`.

## Latihan

Dengan data yang sudah dibersihkan di atas:

1. Berapa median omzet bulanan per kecamatan?
2. Sektor mana yang paling banyak pendaftarnya?

<details><summary>Cek jawaban</summary>

```python
df.groupby("kecamatan")["omzet_bulanan"].median()
# Cicendo 20.000.000; Coblong 9.000.000; Sukajadi 4.500.000

df["sektor"].value_counts()
# Kuliner 4, Fesyen 2, Kerajinan 2
```

Nomor 1: Cicendo hanya punya satu omzet yang terisi (D06 kosong), sehingga "median" Cicendo sebenarnya adalah nilai satu pendaftar. Ini contoh kenapa jumlah data per kelompok selalu perlu disebutkan.

</details>
