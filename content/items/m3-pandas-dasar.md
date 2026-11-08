## Membaca data

Di Colab, klik ikon folder di panel kiri, lalu klik ikon unggah dan pilih `penjualan_buku.csv`. Setelah itu:

```python
import pandas as pd

df = pd.read_csv("penjualan_buku.csv")
df.shape
```

Hasilnya `(36, 7)`: 36 baris dan 7 kolom. `df` adalah singkatan yang lazim untuk **DataFrame**, tabel di pandas. Setiap kolom sebuah DataFrame disebut **Series**.

> [!warning] File unggahan di Colab bersifat sementara
> File yang diunggah lewat panel Files hilang ketika sesi Colab berakhir atau runtime dimulai ulang. Unggah lagi saat membuka notebook di hari lain, atau simpan file di Google Drive.

## Mengenali data

| Perintah | Kegunaan |
|---|---|
| `df.head()` | lima baris pertama (`df.head(10)` untuk sepuluh) |
| `df.info()` | nama kolom, tipe data, dan banyaknya nilai yang tidak kosong |
| `df.describe()` | ringkasan statistik kolom angka |
| `df["kategori"].value_counts()` | banyaknya baris untuk setiap nilai |
| `df["kota"].unique()` | daftar nilai unik |

`df.info()` menunjukkan `jumlah` dan `harga_satuan` bertipe `int64` (bilangan bulat), dan kolom lain bertipe teks. Teks tertulis `object` di pandas versi 2 dan `str` di versi 3; keduanya berarti teks. Perhatikan juga bahwa `tanggal` terbaca sebagai teks, bukan tanggal. Ini diperbaiki di bawah.

`df["kategori"].value_counts()` menghasilkan Novel 11, Buku anak 10, Komik 9, Bisnis 6, sama dengan hasil `GROUP BY kategori` di SQL.

## Memilih kolom

```python
df["kota"]                         # satu kolom, hasilnya Series
df[["id_pesanan", "kota", "jumlah"]]  # beberapa kolom, perhatikan kurung siku ganda
```

## Memfilter baris

Filter ditulis sebagai syarat di dalam kurung siku. Setara dengan `WHERE` di SQL.

```python
df[df["kota"] == "Bandung"]                       # 11 baris

df[(df["kota"] == "Bandung") & (df["kategori"] == "Bisnis")]   # 4 baris

df[df["kota"].isin(["Medan", "Jakarta"])]          # 15 baris
```

| SQL | pandas |
|---|---|
| `AND` | `&` |
| `OR` | `\|` |
| `NOT` | `~` |
| `IN (...)` | `.isin([...])` |

> [!warning] Kurung di setiap syarat
> Saat menggabungkan syarat dengan `&` atau `|`, setiap syarat wajib diberi kurung: `(df["kota"] == "Bandung") & (df["jumlah"] >= 3)`. Tanpa kurung, Python mengerjakan `&` lebih dulu dan hasilnya galat atau keliru.

Untuk memfilter baris sekaligus memilih kolom, pakai `.loc[syarat, kolom]`:

```python
df.loc[df["jumlah"] >= 4, ["id_pesanan", "kategori", "jumlah"]]   # 14 baris
```

## Membuat kolom baru

```python
df["pendapatan"] = df["jumlah"] * df["harga_satuan"]
df["pendapatan"].sum()     # 6535000
df["pendapatan"].mean()    # sekitar 181527.78
```

Perhitungan berlaku untuk seluruh kolom sekaligus, tanpa perulangan.

## Mengubah teks menjadi tanggal

```python
df["tanggal"] = pd.to_datetime(df["tanggal"])
df["bulan"] = df["tanggal"].dt.to_period("M")
df["bulan"].value_counts().sort_index()
```

Hasilnya: 2026-07 sebanyak 16 pesanan, 2026-08 sebanyak 12, dan 2026-09 sebanyak 8. Setelah menjadi tanggal, kolom bisa dipakai untuk mengambil bulan, hari, atau menghitung selisih hari.

## Mengurutkan

```python
df.sort_values(["pendapatan", "id_pesanan"], ascending=[False, True]).head(3)
```

Hasilnya B001 (380.000), B009, dan B010 (masing-masing 340.000). Pengurut kedua `id_pesanan` membuat urutan nilai seri selalu sama, seperti `ORDER BY pendapatan DESC, id_pesanan` di SQL.

## Latihan

Lanjutkan di notebook yang sama, setelah kolom `pendapatan` dibuat.

1. Berapa pesanan yang masuk lewat kanal Situs?
2. Berapa total pendapatan dari pesanan Novel yang jumlahnya minimal 3 eksemplar?
3. Buat kolom `besar` yang bernilai `True` jika pendapatan minimal 300.000. Berapa pesanan besar?
4. Ada berapa kota berbeda, dan apa saja?

<details><summary>Cek jawaban</summary>

```python
# 1
len(df[df["kanal"] == "Situs"])                       # 8

# 2
df.loc[(df["kategori"] == "Novel") & (df["jumlah"] >= 3), "pendapatan"].sum()   # 2465000

# 3
df["besar"] = df["pendapatan"] >= 300000
df["besar"].sum()                                     # 6

# 4
df["kota"].nunique()                                  # 4
sorted(df["kota"].unique())                           # Bandung, Jakarta, Medan, Surabaya
```

Nomor 3 memanfaatkan fakta bahwa `True` dihitung sebagai 1 dan `False` sebagai 0, sehingga `.sum()` menghasilkan banyaknya baris yang memenuhi syarat. Angka 6 sama dengan kelompok "Besar" di bacaan CASE pada modul SQL.

</details>
