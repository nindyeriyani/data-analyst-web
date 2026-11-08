## Kenapa perlu dasar Python dulu

pandas adalah pustaka Python. Sebelum memakainya, Anda perlu nyaman dengan beberapa hal dasar: menyimpan nilai di variabel, mengenali tipe data, menyimpan banyak nilai di list dan dictionary, membuat keputusan dengan `if`, mengulang dengan `for`, dan membungkus langkah dalam fungsi. Semua contoh di halaman ini bisa langsung dijalankan di Google Colab.

## Variabel dan tipe data

Variabel adalah nama untuk sebuah nilai. Python menentukan tipenya sendiri dari nilai yang diberikan.

```python
kota = "Bandung"      # str: teks
jumlah_pesanan = 12   # int: bilangan bulat
rata_rata = 85.5      # float: bilangan desimal
sudah_bayar = True    # bool: benar atau salah
diskon = None         # None: belum ada nilai
```

| Tipe | Contoh | Dipakai untuk |
|---|---|---|
| `str` | `"Bandung"` | Nama, kategori, kode wilayah |
| `int` | `12` | Jumlah, hitungan |
| `float` | `85.5` | Harga, persentase, rata-rata |
| `bool` | `True`, `False` | Hasil perbandingan, penanda |
| `None` | `None` | Nilai kosong |

Untuk memeriksa tipe sebuah nilai, pakai `type(nilai)`. Untuk menyisipkan variabel ke dalam teks, pakai f-string:

```python
print(f"{kota} punya {jumlah_pesanan} pesanan")
```

> [!warning] Angka yang tersimpan sebagai teks
> `"12"` (dengan tanda kutip) adalah teks, bukan angka. `"12" + "3"` menghasilkan `"123"`, bukan `15`. Masalah yang sama sering muncul saat membaca file CSV, jadi biasakan memeriksa tipe data sebelum menghitung.

## List: kumpulan nilai berurutan

```python
penjualan = [250000, 120000, 90000, 310000]

penjualan[0]          # 250000, indeks dimulai dari 0
penjualan[-1]         # 310000, indeks negatif dihitung dari belakang
len(penjualan)        # 4, jumlah elemen
sum(penjualan)        # 770000
max(penjualan)        # 310000
penjualan.append(75000)  # menambah elemen di akhir
```

## Dictionary: pasangan kunci dan nilai

Dictionary cocok untuk menyimpan satu baris data, misalnya satu pesanan.

```python
pesanan = {"order_id": 101, "kota": "Bandung", "amount": 250000}

pesanan["kota"]          # "Bandung"
pesanan["amount"] = 260000  # mengubah nilai
pesanan.get("diskon", 0)    # 0, nilai cadangan jika kunci tidak ada
```

List berisi dictionary adalah bentuk umum data tabel di Python. Setiap dictionary adalah satu baris, setiap kunci adalah nama kolom.

## Kondisi: if, elif, else

```python
def kategori_nilai(nilai):
    if nilai >= 80:
        return "tinggi"
    elif nilai >= 60:
        return "sedang"
    else:
        return "rendah"
```

Operator yang sering dipakai: `==` (sama dengan), `!=` (tidak sama), `>`, `>=`, `<`, `<=`, serta `and`, `or`, dan `not` untuk menggabungkan kondisi.

> [!warning] Indentasi menentukan isi blok
> Python tidak memakai kurung kurawal untuk menandai blok. Baris yang menjorok ke dalam (biasanya empat spasi) adalah isi dari `if`, `for`, atau `def` di atasnya. Indentasi yang salah menghasilkan `IndentationError` atau logika yang keliru tanpa pesan error.

## Perulangan dan list comprehension

`for` menjalankan langkah yang sama untuk setiap elemen.

```python
harga = [12000, 8000, 15000]

total = 0
for h in harga:
    total = total + h
print(total)  # 35000
```

Untuk membuat list baru dari list lama, ada bentuk singkat bernama list comprehension:

```python
harga_ppn = [h * 1.11 for h in harga]        # ubah setiap elemen
mahal = [h for h in harga if h > 10000]       # ambil elemen yang memenuhi syarat
```

> [!tip] Di pandas, perulangan jarang diperlukan
> List comprehension berguna untuk Python biasa. Untuk tabel, pakai operasi pandas yang bekerja sekaligus pada satu kolom, misalnya `df["harga"] * 1.11` atau `df[df["kota"] == "Bandung"]`. Hasilnya lebih cepat dan lebih mudah dibaca.

## Fungsi

Fungsi membungkus langkah yang dipakai berulang kali dan memberinya nama.

```python
def persen(bagian, total):
    if total == 0:
        return 0
    return round(bagian / total * 100, 1)

persen(45, 180)  # 25.0
```

## Latihan

Jalankan kode ini di Colab, lalu kerjakan tiga soal di bawahnya.

```python
pesanan = [
    {"order_id": 101, "kota": "Bandung", "amount": 250000},
    {"order_id": 102, "kota": "Surabaya", "amount": 120000},
    {"order_id": 103, "kota": "Bandung", "amount": 90000},
    {"order_id": 104, "kota": "Medan", "amount": 310000},
]
```

1. Hitung total `amount` untuk kota Bandung.
2. Buat list berisi `order_id` yang `amount`-nya lebih dari 100000.
3. Tulis fungsi `label_pesanan(amount)` yang mengembalikan `"besar"` jika amount minimal 200000, dan `"kecil"` jika kurang dari itu.

<details><summary>Cek jawaban</summary>

```python
# 1
total_bandung = 0
for p in pesanan:
    if p["kota"] == "Bandung":
        total_bandung = total_bandung + p["amount"]
print(total_bandung)  # 340000

# 2
pesanan_besar = [p["order_id"] for p in pesanan if p["amount"] > 100000]
print(pesanan_besar)  # [101, 102, 104]

# 3
def label_pesanan(amount):
    if amount >= 200000:
        return "besar"
    return "kecil"

print([label_pesanan(p["amount"]) for p in pesanan])
# ['besar', 'kecil', 'kecil', 'besar']
```

Soal nomor 1 bisa juga ditulis satu baris: `sum(p["amount"] for p in pesanan if p["kota"] == "Bandung")`.

</details>
