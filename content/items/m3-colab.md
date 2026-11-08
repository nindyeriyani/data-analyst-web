## Tujuan lab

Membuat notebook Colab yang rapi dan layak dibaca orang lain: ada judul, penjelasan, kode, dan hasil. Notebook seperti inilah yang nanti masuk portofolio.

## 1. Buat notebook (5 menit)

1. Buka colab.research.google.com, lalu **New notebook**.
2. Ganti nama di kiri atas menjadi `03-notebook-pertama.ipynb`.

## 2. Sel teks dan sel kode (10 menit)

Notebook terdiri dari dua jenis sel:

- **Sel teks** (tombol **+ Text**) ditulis dengan Markdown: `#` untuk judul, `-` untuk daftar, `**tebal**`.
- **Sel kode** (tombol **+ Code**) dijalankan dengan Shift + Enter.

Buat sel teks pertama berisi:

```markdown
# Penjualan toko buku, Juli–September 2026

**Tujuan:** latihan membaca dan meringkas data dengan pandas.
**Data:** 36 pesanan rekaan dari kursus data analyst.
```

## 3. Unggah dan baca data (10 menit)

1. Klik ikon folder di panel kiri, lalu ikon unggah, dan pilih `penjualan_buku.csv`.
2. Di sel kode:

```python
import pandas as pd

df = pd.read_csv("penjualan_buku.csv")
df["pendapatan"] = df["jumlah"] * df["harga_satuan"]
df.head()
```

3. Tambahkan sel teks yang menjelaskan isi data dalam satu atau dua kalimat.

## 4. Satu pertanyaan, satu jawaban (10 menit)

Tulis sel teks berisi pertanyaan, sel kode yang menjawabnya, lalu sel teks berisi kesimpulan:

```python
df.groupby("kategori")["pendapatan"].sum().sort_values(ascending=False)
```

Hasilnya Novel 2.890.000, Buku anak 1.760.000, Bisnis 1.045.000, Komik 840.000. Kesimpulannya, misalnya: "Novel menyumbang pendapatan terbesar, sekitar 44% dari total Rp6.535.000."

> [!tip] Jalankan ulang dari awal sebelum menyimpan
> Pilih **Runtime**, **Restart session and run all** (namanya bisa sedikit berbeda). Kalau notebook berjalan tanpa galat dari atas ke bawah, orang lain juga bisa menjalankannya. Notebook yang hanya berjalan kalau selnya dijalankan dengan urutan tertentu sulit dipercaya.

## 5. Simpan ke GitHub (10 menit)

Ada dua cara. Pilih salah satu.

**Cara A, langsung dari Colab:** **File**, **Save a copy in GitHub**. Colab meminta izin mengakses akun GitHub Anda. Pilih repositori `portofolio-data-analyst`, isi path misalnya `latihan-python/03-notebook-pertama.ipynb`, lalu tulis pesan commit.

**Cara B, unduh lalu unggah:** **File**, **Download**, **Download .ipynb**. Di GitHub, buka repositori, **Add file**, **Upload files**, lalu pilih file tadi.

Buka file notebook di GitHub. GitHub menampilkan notebook lengkap dengan hasilnya, sehingga perekrut bisa membacanya tanpa menjalankan apa pun.

> [!warning] Hasil yang tersimpan ikut terlihat
> Hasil setiap sel (tabel, angka, grafik) ikut tersimpan di file `.ipynb` dan terlihat di GitHub. Itu bagus untuk portofolio, tetapi pastikan notebook tidak pernah memuat data pribadi atau data kantor.

## Daftar periksa

- [ ] Notebook dengan judul, tujuan, dan penjelasan data
- [ ] Satu pertanyaan dengan kode dan kesimpulan
- [ ] Berjalan tanpa galat setelah restart dan run all
- [ ] Tersimpan di repositori GitHub dan bisa dibuka di sana
