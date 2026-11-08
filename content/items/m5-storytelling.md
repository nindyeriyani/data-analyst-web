## Cerita, bukan kumpulan grafik

Dashboard dengan sepuluh grafik yang benar tetapi tanpa pesan membuat pembaca bingung harus melihat ke mana. Storytelling dengan data berarti memilih **satu pesan utama**, lalu menyusun grafik dan kata-kata untuk mendukungnya.

Struktur sederhana yang bisa dipakai di laporan, presentasi, maupun dashboard:

1. **Konteks**: apa yang terjadi dan kenapa penting. "Pendapatan triwulan III turun setiap bulan."
2. **Temuan**: apa yang ditemukan dari data, dengan angka kunci. "Penurunan berasal dari marketplace, sementara penjualan lewat situs justru naik."
3. **Rekomendasi**: apa yang sebaiknya dilakukan. "Periksa perubahan di marketplace sejak Agustus, dan perkuat promosi situs."

## Contoh dari data toko buku

Total pendapatan per bulan hanya memperlihatkan penurunan: 2,61 juta, lalu 2,22 juta, lalu 1,71 juta. Setelah dipecah per kanal, ceritanya jauh lebih jelas:

| bulan | Marketplace | Situs | Toko fisik |
|---|---|---|---|
| Juli | 1.385.000 | 300.000 | 925.000 |
| Agustus | 1.235.000 | 475.000 | 505.000 |
| September | 435.000 | 765.000 | 510.000 |

Marketplace anjlok sekitar 70% dari Juli ke September, sedangkan Situs naik lebih dari dua kali lipat. Kalau dipecah per kategori, Novel naik setiap bulan dan Bisnis hilang sama sekali di September.

Pesan utama yang bisa dipilih: **"Penurunan pendapatan berasal dari marketplace; situs sendiri tumbuh pesat."** Semua grafik di dashboard sebaiknya mendukung pesan ini.

## Kurangi kekacauan visual

Setiap elemen yang tidak membantu pembaca memahami pesan adalah gangguan. Buang atau redam:

- garis kisi yang tebal, bingkai grafik, latar berwarna,
- legenda yang bisa diganti label langsung di ujung garis atau batang,
- angka desimal yang tidak perlu (2.610.000,00 cukup ditulis 2,6 juta),
- warna yang berbeda untuk setiap batang padahal tidak ada artinya.

## Warna untuk menyorot

Gunakan satu warna kuat untuk hal yang ingin diperhatikan, dan abu-abu untuk sisanya. Contoh di Colab:

```python
import matplotlib.pyplot as plt

per_kota = df.groupby("kota")["pendapatan"].sum().sort_values()
warna = ["#0D6B62" if kota == "Medan" else "#C9D3D4" for kota in per_kota.index]

fig, ax = plt.subplots(figsize=(7, 4))
ax.barh(per_kota.index, per_kota.values / 1_000_000, color=warna)
ax.spines[["top", "right"]].set_visible(False)
ax.set_title("Medan tertinggal jauh: pendapatannya seperempat Surabaya", loc="left")
ax.set_xlabel("Pendapatan (juta rupiah)")
fig.tight_layout()
plt.show()
```

Mata pembaca langsung tertuju ke batang Medan. Bandingkan dengan grafik empat warna berbeda, yang membuat pembaca mencari-cari sendiri mana yang penting.

> [!tip] Judul yang menyatakan temuan
> Judul adalah kalimat pertama yang dibaca. "Pendapatan per kota" hanya menyebut topik. "Medan tertinggal jauh: pendapatannya seperempat Surabaya" langsung menyampaikan temuan. Periksa setiap angka di judul dengan data, karena judul yang salah lebih berbahaya daripada judul yang membosankan.

## Warna yang ramah semua pembaca

- Jangan mengandalkan merah dan hijau saja untuk membedakan, karena sebagian orang buta warna merah-hijau. Tambahkan label atau ikon.
- Pakai warna yang sama untuk hal yang sama di seluruh dashboard. Kalau "Situs" berwarna toska di grafik pertama, tetap toska di grafik lain.
- Batasi sekitar lima warna dalam satu dashboard.

## Susunan dashboard

Pembaca membaca dari kiri atas ke kanan bawah. Susun sesuai urutan cerita:

1. **Atas**: judul berisi pesan utama, dan dua sampai empat kartu skor (angka kunci).
2. **Tengah**: grafik yang menjelaskan temuan utama, misalnya tren per kanal.
3. **Bawah**: rincian dan grafik pendukung, misalnya per kategori atau per kota.
4. **Filter** di satu tempat yang konsisten, biasanya di atas atau di samping.

> [!warning] Jangan menyembunyikan data yang tidak sesuai cerita
> Storytelling memilih apa yang ditonjolkan, bukan menyembunyikan fakta yang tidak cocok. Kalau ada data yang melemahkan pesan utama, misalnya sampelnya kecil, sebutkan. Kepercayaan pembaca lebih berharga daripada cerita yang mulus.

## Latihan

Tulis tiga kalimat (konteks, temuan, rekomendasi) dari data per kategori berikut:

| bulan | Bisnis | Buku anak | Komik | Novel |
|---|---|---|---|---|
| Juli | 950.000 | 660.000 | 320.000 | 680.000 |
| Agustus | 95.000 | 825.000 | 360.000 | 935.000 |
| September | 0 | 275.000 | 160.000 | 1.275.000 |

<details><summary>Cek jawaban</summary>

Contoh:

- **Konteks:** "Pendapatan toko turun dari 2,61 juta di Juli menjadi 1,71 juta di September."
- **Temuan:** "Novel adalah satu-satunya kategori yang tumbuh, hampir dua kali lipat (dari 0,68 juta menjadi 1,28 juta), sementara penjualan buku Bisnis hilang sama sekali sejak September."
- **Rekomendasi:** "Perbanyak stok dan promosi Novel, dan periksa apakah buku Bisnis kehabisan stok atau ada perubahan lain sejak Agustus."

Perhatikan bahwa rekomendasi kedua berupa langkah pemeriksaan, bukan klaim penyebab, karena data penjualan saja tidak menjelaskan kenapa buku Bisnis berhenti terjual.

</details>
