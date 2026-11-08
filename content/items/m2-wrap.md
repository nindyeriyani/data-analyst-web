## Refleksi modul SQL

Dua minggu SQL selesai. Jawab pertanyaan berikut di kolom catatan.

## Pertanyaan

1. Tulis dari ingatan, tanpa melihat contoh, satu query dengan `JOIN`, `GROUP BY`, dan `HAVING` untuk data apa pun. Bagian mana yang membuat Anda ragu?
2. Mana yang paling sulit: JOIN, CTE, atau window function? Apa satu hal yang membuatnya lebih masuk akal bagi Anda?
3. Dari proyek theLook, temuan mana yang paling menarik? Apakah ada angka yang sempat salah, dan bagaimana Anda menyadarinya?
4. Dari lima pertanyaan bisnis di tempat magang, mana yang menurut Anda bisa dijawab dengan SQL kalau datanya tersedia di database?
5. Berapa soal SQLBolt, Kaggle, dan DataLemur yang Anda kerjakan tanpa melihat solusi?

## Persiapan modul Python

Modul berikutnya memakai Python dan pandas di Google Colab. Konsepnya akan terasa akrab:

| SQL | pandas |
|---|---|
| `WHERE` | `df[df["kota"] == "Bandung"]` |
| `GROUP BY` dan `SUM` | `df.groupby("kota")["pendapatan"].sum()` |
| `JOIN` | `pd.merge(...)` |
| `ORDER BY` | `df.sort_values(...)` |

> [!tip] Cek pemahaman dengan kuis
> Sebelum pindah ke Python, pastikan kuis SQL dasar dan kuis SQL lanjutan sudah lulus 5/5. Kalau masih ada yang salah, baca lagi penjelasan soalnya dan ulangi dengan soal baru.
