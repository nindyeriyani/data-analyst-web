## Pola dasar

matplotlib adalah pustaka grafik yang paling umum di Python. Pakai satu pola yang sama untuk semua grafik:

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(7, 4))   # kanvas dan satu area grafik
# ... gambar di ax ...
ax.set_title("Judul yang menyatakan temuan")
ax.set_xlabel("Label sumbu x")
ax.set_ylabel("Label sumbu y, dengan satuan")
fig.tight_layout()
plt.show()
```

Contoh memakai `df` dari bacaan groupby, dengan kolom `pendapatan` dan `bulan`.

## Grafik garis: perubahan dari waktu ke waktu

```python
per_bulan = df.groupby("bulan")["pendapatan"].sum()

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(per_bulan.index, per_bulan.values / 1_000_000, marker="o")
ax.set_title("Pendapatan turun setiap bulan sepanjang triwulan III")
ax.set_xlabel("Bulan")
ax.set_ylabel("Pendapatan (juta rupiah)")
ax.set_ylim(bottom=0)
fig.tight_layout()
plt.show()
```

- Membagi dengan satu juta dan menulis satuannya di label membuat angka sumbu mudah dibaca.
- `set_ylim(bottom=0)` memulai sumbu dari nol agar penurunan tidak terlihat lebih dramatis dari kenyataannya.

## Grafik batang: membandingkan kategori

```python
per_kategori = df.groupby("kategori")["pendapatan"].sum().sort_values()

fig, ax = plt.subplots(figsize=(7, 4))
ax.barh(per_kategori.index, per_kategori.values / 1_000_000)
ax.set_title("Novel menyumbang pendapatan terbesar")
ax.set_xlabel("Pendapatan (juta rupiah)")
fig.tight_layout()
plt.show()
```

Batang horizontal (`barh`) membuat label kategori yang panjang tetap terbaca. Urutkan datanya dulu agar batang tersusun dari kecil ke besar.

## Histogram: sebaran nilai

```python
fig, ax = plt.subplots(figsize=(7, 4))
ax.hist(df["pendapatan"] / 1000, bins=[0, 100, 200, 300, 400])
ax.set_title("Sebagian besar pesanan bernilai di bawah Rp300 ribu")
ax.set_xlabel("Pendapatan per pesanan (ribu rupiah)")
ax.set_ylabel("Banyak pesanan")
fig.tight_layout()
plt.show()
```

Histogram menjawab "bagaimana nilai-nilai ini tersebar?", bukan membandingkan kategori. Coba ubah `bins` dan lihat bagaimana bentuknya berubah.

> [!tip] Judul yang menyatakan temuan
> "Grafik pendapatan per kategori" hanya menyebut isi grafik. "Novel menyumbang pendapatan terbesar" langsung memberi tahu pembaca apa yang harus dilihat. Gunakan gaya kedua untuk laporan dan portofolio.

## Daftar periksa grafik

- [ ] Jenis grafik sesuai pertanyaan: garis untuk waktu, batang untuk kategori, histogram untuk sebaran
- [ ] Judul menyatakan temuan
- [ ] Label sumbu lengkap dengan satuan
- [ ] Sumbu angka grafik batang dimulai dari nol
- [ ] Angka besar diringkas (ribu, juta) agar mudah dibaca
- [ ] Tidak ada efek 3D atau warna yang tidak berarti

> [!warning] Satu grafik, satu pesan
> Godaan pertama biasanya memasukkan semua kolom ke satu grafik. Kalau ada dua pesan, misalnya tren bulanan dan perbandingan kategori, buat dua grafik terpisah.

## Menyimpan grafik

```python
fig.savefig("pendapatan_per_kategori.png", dpi=150, bbox_inches="tight")
```

File PNG muncul di panel Files Colab dan bisa diunduh, misalnya untuk README di GitHub atau presentasi.

## Latihan

Buat grafik batang horizontal pendapatan per kota dengan judul yang menyatakan temuan, lalu simpan sebagai PNG.

<details><summary>Cek jawaban</summary>

```python
per_kota = df.groupby("kota")["pendapatan"].sum().sort_values()

fig, ax = plt.subplots(figsize=(7, 4))
ax.barh(per_kota.index, per_kota.values / 1_000_000)
ax.set_title("Surabaya menyumbang pendapatan terbesar, Medan terkecil")
ax.set_xlabel("Pendapatan (juta rupiah)")
fig.tight_layout()
fig.savefig("pendapatan_per_kota.png", dpi=150, bbox_inches="tight")
plt.show()
```

Urutan batang dari bawah ke atas: Medan (0,625 juta), Bandung (1,685), Jakarta (1,73), Surabaya (2,495).

</details>
