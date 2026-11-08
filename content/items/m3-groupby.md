## Persiapan

Lanjutkan dari notebook dasar pandas, atau jalankan ini di notebook baru setelah mengunggah `penjualan_buku.csv`:

```python
import pandas as pd

df = pd.read_csv("penjualan_buku.csv")
df["pendapatan"] = df["jumlah"] * df["harga_satuan"]
df["tanggal"] = pd.to_datetime(df["tanggal"])
df["bulan"] = df["tanggal"].dt.to_period("M").astype(str)
```

## groupby: padanan GROUP BY

```python
df.groupby("kategori")["pendapatan"].sum().sort_values(ascending=False)
```

Hasilnya sama dengan SQL: Novel 2.890.000, Buku anak 1.760.000, Bisnis 1.045.000, Komik 840.000.

Bacanya: kelompokkan `df` per `kategori`, ambil kolom `pendapatan`, lalu jumlahkan.

### Beberapa ringkasan sekaligus dengan agg

```python
df.groupby("kota").agg(
    pesanan=("id_pesanan", "count"),
    pendapatan=("pendapatan", "sum"),
    rata_eksemplar=("jumlah", "mean"),
).round(2)
```

| kota | pesanan | pendapatan | rata_eksemplar |
|---|---|---|---|
| Bandung | 11 | 1.685.000 | 2,45 |
| Jakarta | 9 | 1.730.000 | 3,22 |
| Medan | 6 | 625.000 | 1,83 |
| Surabaya | 10 | 2.495.000 | 3,10 |

Bentuk `nama_baru=("kolom", "fungsi")` memberi nama yang jelas pada setiap hasil. Fungsi yang umum: `"count"`, `"sum"`, `"mean"`, `"median"`, `"min"`, `"max"`, `"nunique"`.

### Kelompok lebih dari satu kolom

```python
df.groupby(["kota", "kanal"])["pendapatan"].sum().reset_index()
```

`reset_index()` mengubah hasil menjadi DataFrame biasa dengan kolom `kota`, `kanal`, dan `pendapatan`, sehingga lebih mudah diolah lagi atau disimpan.

## pivot_table: padanan pivot table spreadsheet

```python
pd.pivot_table(
    df,
    index="kota",
    columns="kanal",
    values="pendapatan",
    aggfunc="sum",
    fill_value=0,
    margins=True,
    margins_name="Total",
)
```

| kota | Marketplace | Situs | Toko fisik | Total |
|---|---|---|---|---|
| Bandung | 890.000 | 170.000 | 625.000 | 1.685.000 |
| Jakarta | 1.035.000 | 440.000 | 255.000 | 1.730.000 |
| Medan | 245.000 | 0 | 380.000 | 625.000 |
| Surabaya | 885.000 | 930.000 | 680.000 | 2.495.000 |
| **Total** | 3.055.000 | 1.540.000 | 1.940.000 | 6.535.000 |

`fill_value=0` mengisi kombinasi yang tidak ada (Medan tidak pernah memesan lewat Situs). `margins=True` menambahkan baris dan kolom total.

## merge: padanan JOIN

Misalkan manajer punya target pendapatan triwulan per kota, termasuk kota yang belum punya penjualan:

```python
target = pd.DataFrame({
    "kota": ["Bandung", "Jakarta", "Medan", "Surabaya", "Makassar"],
    "target_triwulan": [2_000_000, 2_000_000, 1_000_000, 2_000_000, 1_500_000],
})

per_kota = df.groupby("kota", as_index=False)["pendapatan"].sum()
capaian = per_kota.merge(target, on="kota", how="left")
capaian["capaian_persen"] = (100 * capaian["pendapatan"] / capaian["target_triwulan"]).round(1)
capaian
```

| kota | pendapatan | target_triwulan | capaian_persen |
|---|---|---|---|
| Bandung | 1.685.000 | 2.000.000 | 84,2 |
| Jakarta | 1.730.000 | 2.000.000 | 86,5 |
| Medan | 625.000 | 1.000.000 | 62,5 |
| Surabaya | 2.495.000 | 2.000.000 | 124,8 |

| `how=` | Padanan SQL | Baris yang diambil |
|---|---|---|
| `"inner"` (bawaan) | `INNER JOIN` | hanya yang cocok di kedua tabel (4 kota) |
| `"left"` | `LEFT JOIN` | semua dari tabel kiri (4 kota) |
| `"right"` | `RIGHT JOIN` | semua dari tabel kanan (5 kota) |
| `"outer"` | `FULL OUTER JOIN` | semua dari keduanya (5 kota, Makassar tanpa pendapatan) |

> [!warning] Periksa jumlah baris setelah merge
> Bandingkan `len()` sebelum dan sesudah merge. Kalau jumlah baris bertambah tanpa diduga, kemungkinan ada kunci ganda di salah satu tabel, misalnya satu kota tercatat dua kali di tabel target. Ini masalah yang sama dengan JOIN yang menggandakan baris di SQL.

> [!tip] Nama kolom kunci berbeda
> Kalau kolom kuncinya punya nama berbeda, pakai `left_on` dan `right_on`: `pesanan.merge(pelanggan, left_on="id_pelanggan", right_on="id", how="left")`.

## Latihan

1. Berapa pendapatan per bulan?
2. Buat pivot table jumlah eksemplar per kategori (baris) per bulan (kolom). Kategori mana yang trennya berbeda dari yang lain?
3. Berapa rata-rata pendapatan per pesanan untuk setiap kanal?

<details><summary>Cek jawaban</summary>

```python
# 1
df.groupby("bulan")["pendapatan"].sum()
# 2026-07: 2.610.000; 2026-08: 2.215.000; 2026-09: 1.710.000

# 2
pd.pivot_table(df, index="kategori", columns="bulan", values="jumlah", aggfunc="sum", fill_value=0)

# 3
df.groupby("kanal")["pendapatan"].mean().round(0)
# Marketplace 169.722; Situs 192.500; Toko fisik 194.000
```

Hasil nomor 2:

| kategori | 2026-07 | 2026-08 | 2026-09 |
|---|---|---|---|
| Bisnis | 10 | 1 | 0 |
| Buku anak | 12 | 15 | 5 |
| Komik | 8 | 9 | 4 |
| Novel | 8 | 11 | 15 |

Novel satu-satunya kategori yang naik setiap bulan, sementara Bisnis hampir hilang. Temuan seperti ini tidak terlihat dari total bulanan saja, yang hanya menunjukkan penurunan.

</details>
