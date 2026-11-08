## Data contoh

Lama proses (dalam hari kerja) dari 12 permohonan di sebuah unit layanan (data rekaan):

```python
import pandas as pd

hari = pd.Series([2, 3, 3, 4, 4, 4, 5, 5, 6, 7, 8, 30])
```

Sebelas permohonan selesai dalam 2–8 hari, dan satu permohonan butuh 30 hari karena berkasnya sempat hilang.

## Ukuran pemusatan: "nilai yang mewakili"

| Ukuran | Arti | Kode | Hasil |
|---|---|---|---|
| Rata-rata (mean) | Jumlah semua nilai dibagi banyaknya | `hari.mean()` | 6,75 |
| Median | Nilai tengah setelah diurutkan | `hari.median()` | 4,5 |
| Modus | Nilai yang paling sering muncul | `hari.mode()` | 4 |

Rata-rata 6,75 hari terasa terlalu lama, karena 9 dari 12 permohonan selesai dalam 6 hari atau kurang. Penyebabnya satu nilai ekstrem: 30 hari menarik rata-rata ke atas. Median hampir tidak terpengaruh.

Coba buang nilai 30: rata-ratanya turun dari 6,75 menjadi 4,64, sedangkan median hanya bergeser dari 4,5 menjadi 4.

> [!tip] Kapan memakai yang mana
> - **Median** untuk data yang miring atau punya nilai ekstrem: waktu proses, pendapatan, omzet, harga rumah.
> - **Rata-rata** untuk data yang kira-kira simetris tanpa nilai ekstrem, atau ketika totalnya yang penting. Misalnya rata-rata pendapatan per pesanan, dikali banyak pesanan, menghasilkan total pendapatan.
> - **Modus** untuk kategori: layanan yang paling sering diminta, ukuran baju yang paling laku.
>
> Kalau ragu, laporkan keduanya. Selisih yang besar antara rata-rata dan median adalah tanda ada nilai ekstrem.

## Ukuran sebaran: "seberapa beragam"

Dua unit bisa punya rata-rata sama, tetapi yang satu selalu konsisten dan yang lain tidak menentu. Ukuran sebaran menangkap perbedaan itu.

| Ukuran | Arti | Kode | Hasil |
|---|---|---|---|
| Rentang | Terbesar dikurangi terkecil | `hari.max() - hari.min()` | 28 |
| Kuartil 1 (Q1) | 25% data di bawah nilai ini | `hari.quantile(0.25)` | 3,75 |
| Kuartil 3 (Q3) | 75% data di bawah nilai ini | `hari.quantile(0.75)` | 6,25 |
| Jangkauan antarkuartil (IQR) | Q3 dikurangi Q1, lebar 50% data di tengah | | 2,5 |
| Simpangan baku | Rata-rata jarak nilai dari rata-ratanya | `hari.std()` | 7,52 |

Simpangan baku 7,52 terlihat besar, padahal sebagian besar data berkumpul di 3–6 hari. Seperti rata-rata, simpangan baku sangat terpengaruh nilai ekstrem: tanpa nilai 30, simpangan bakunya hanya 1,8. IQR (2,5) lebih menggambarkan sebaran sebagian besar data.

## Semua sekaligus dengan describe()

```python
hari.describe()
```

Hasilnya: count 12, mean 6,75, std 7,52, min 2, 25% 3,75, 50% 4,5, 75% 6,25, max 30. Baris `50%` adalah median.

> [!warning] Simpangan baku sampel dan populasi
> pandas menghitung simpangan baku **sampel** (dibagi n − 1), sedangkan sebagian kalkulator dan rumus `STDEV.P` di spreadsheet menghitung versi **populasi** (dibagi n). Untuk data kecil, hasilnya sedikit berbeda. Kalau angka Anda tidak cocok dengan alat lain, ini penyebab yang paling umum. Di Google Sheets, `STDEV` sama dengan versi sampel pandas.

## Menulis ringkasan untuk laporan

Kurang tepat:

> "Rata-rata waktu proses 6,75 hari."

Lebih baik:

> "Separuh permohonan selesai dalam 4,5 hari kerja atau kurang (median), dan 75% dalam 6,25 hari. Satu permohonan butuh 30 hari karena berkasnya hilang, sehingga rata-ratanya (6,75 hari) tidak mewakili kondisi umum."

## Latihan

Omzet bulanan (juta rupiah) dari 10 UMKM peserta pelatihan, data rekaan:

```python
omzet = pd.Series([3, 4, 4, 5, 5, 6, 7, 8, 9, 45])
```

1. Hitung rata-rata dan median. Mana yang lebih mewakili "omzet UMKM pada umumnya"?
2. Hitung Q1, Q3, dan IQR.
3. Tulis satu kalimat ringkasan untuk laporan.

<details><summary>Cek jawaban</summary>

1. Rata-rata 9,6 juta, median 5,5 juta. Median lebih mewakili, karena satu UMKM beromzet 45 juta menarik rata-rata jauh ke atas. Hanya 1 dari 10 UMKM yang omzetnya di atas rata-rata.
2. Q1 = 4,25, Q3 = 7,75, IQR = 3,5.
3. Contoh: "Separuh peserta beromzet 5,5 juta rupiah per bulan atau kurang, dan sebagian besar berada di kisaran 4–8 juta. Satu peserta beromzet 45 juta sehingga rata-rata (9,6 juta) tidak mewakili kondisi umum."

</details>
