## Bentuk distribusi

Distribusi adalah gambaran seberapa sering setiap nilai muncul. Cara termudah melihatnya adalah histogram, yang sudah Anda buat di modul matplotlib.

| Bentuk | Ciri | Contoh | Hubungan rata-rata dan median |
|---|---|---|---|
| Simetris | Kiri dan kanan kira-kira sama | Tinggi badan orang dewasa | Rata-rata ≈ median |
| Miring ke kanan | Ekor panjang ke arah nilai besar | Pendapatan, omzet, waktu proses | Rata-rata > median |
| Miring ke kiri | Ekor panjang ke arah nilai kecil | Nilai ujian yang mudah (banyak nilai tinggi) | Rata-rata < median |

Data bisnis dan layanan publik sangat sering miring ke kanan: kebanyakan nilainya kecil sampai sedang, dan sedikit sekali nilainya sangat besar. Karena itu median sering lebih tepat daripada rata-rata.

> [!tip] Cek cepat tanpa grafik
> Bandingkan rata-rata dan median. Kalau rata-rata jauh di atas median, kemungkinan data miring ke kanan atau ada nilai ekstrem di atas.

## Box plot

Box plot meringkas distribusi dalam satu gambar:

- **Kotak** membentang dari Q1 sampai Q3 (50% data di tengah).
- **Garis di dalam kotak** adalah median.
- **Garis kumis** (whisker) memanjang sampai nilai terjauh yang masih dalam batas wajar.
- **Titik di luar kumis** adalah calon outlier.

```python
import pandas as pd
import matplotlib.pyplot as plt

hari = pd.Series([2, 3, 3, 4, 4, 4, 5, 5, 6, 7, 8, 30])

fig, ax = plt.subplots(figsize=(4, 5))
ax.boxplot(hari)
ax.set_title("Satu permohonan jauh lebih lama")
ax.set_ylabel("Lama proses (hari kerja)")
fig.tight_layout()
plt.show()
```

Box plot sangat berguna untuk membandingkan beberapa kelompok berdampingan, misalnya lama proses per jenis layanan.

## Mengenali outlier dengan aturan IQR

Aturan yang umum dipakai: nilai disebut calon outlier kalau berada di bawah **Q1 − 1,5 × IQR** atau di atas **Q3 + 1,5 × IQR**.

```python
q1 = hari.quantile(0.25)   # 3,75
q3 = hari.quantile(0.75)   # 6,25
iqr = q3 - q1              # 2,5

batas_bawah = q1 - 1.5 * iqr   # 0
batas_atas = q3 + 1.5 * iqr    # 10

hari[(hari < batas_bawah) | (hari > batas_atas)]   # hanya 30
```

## Menangani outlier

Outlier bukan otomatis kesalahan. Tanyakan dulu: **dari mana nilai ini berasal?**

| Penyebab | Contoh | Tindakan |
|---|---|---|
| Salah input | Usia 340 tahun, harga Rp25 karena kurang tiga nol | Perbaiki kalau bisa dipastikan, atau kosongkan |
| Kejadian nyata yang langka | Berkas hilang sehingga proses 30 hari | Pertahankan, laporkan terpisah, dan pakai median |
| Kelompok berbeda | Satu pelanggan grosir di antara pembeli eceran | Pisahkan menjadi kelompok sendiri |

> [!warning] Jangan membuang outlier diam-diam
> Membuang data yang "mengganggu" tanpa alasan bisa menyembunyikan masalah penting, misalnya berkas yang hilang tadi justru temuan yang perlu ditindaklanjuti. Kalau outlier dikeluarkan dari perhitungan, tulis alasannya dan sebutkan berapa yang dikeluarkan.

## Latihan

Masih dengan data omzet UMKM dari bacaan sebelumnya:

```python
omzet = pd.Series([3, 4, 4, 5, 5, 6, 7, 8, 9, 45])
```

1. Hitung batas bawah dan batas atas aturan IQR. Nilai mana yang merupakan calon outlier?
2. Bentuk distribusinya miring ke mana?
3. Apa yang sebaiknya dilakukan dengan UMKM beromzet 45 juta?

<details><summary>Cek jawaban</summary>

1. Q1 = 4,25 dan Q3 = 7,75, jadi IQR = 3,5. Batas bawah 4,25 − 5,25 = −1, batas atas 7,75 + 5,25 = 13. Calon outlier hanya 45.
2. Miring ke kanan: rata-rata (9,6) jauh di atas median (5,5), dan ekornya ke arah nilai besar.
3. Jangan dihapus begitu saja. Cek dulu apakah angkanya benar (mungkin salah ketik 4,5 juta). Kalau benar, pertahankan, pakai median untuk ringkasan, dan sebutkan bahwa ada satu peserta dengan omzet jauh lebih besar. Bisa juga dianalisis terpisah sebagai kelompok usaha menengah.

</details>
