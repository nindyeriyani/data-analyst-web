## Anda tidak mulai dari nol

Python dan JavaScript punya banyak konsep yang sama: variabel, fungsi, kondisi, perulangan, list (array), dan dictionary (objek). Yang berbeda terutama cara penulisannya. Halaman ini memetakan yang sudah Anda kenal ke versi Python.

> [!fe] Keunggulan front-end Anda
> Konsep `map`, `filter`, dan objek bersarang di JavaScript langsung terpakai di pandas. Bedanya, di pandas Anda jarang menulis perulangan. Satu baris seperti `df[df["kota"] == "Bandung"]` sudah memfilter seluruh tabel.

## Perbandingan cepat

| Konsep | JavaScript | Python |
|---|---|---|
| Variabel | `const total = 10;` | `total = 10` |
| Teks dengan variabel | `` `Halo ${nama}` `` | `f"Halo {nama}"` |
| Array dan list | `[1, 2, 3]` | `[1, 2, 3]` |
| Objek dan dictionary | `{ nama: "Ayu" }` | `{"nama": "Ayu"}` |
| Panjang | `arr.length` | `len(arr)` |
| Tidak ada nilai | `null`, `undefined` | `None` |
| Benar dan salah | `true`, `false` | `True`, `False` |
| Dan, atau, tidak | `&&`, `\|\|`, `!` | `and`, `or`, `not` |
| Komentar | `// komentar` | `# komentar` |

## Blok kode memakai indentasi

Python tidak memakai kurung kurawal. Indentasi (biasanya empat spasi) yang menentukan isi blok.

```python
def kategori_nilai(nilai):
    if nilai >= 80:
        return "tinggi"
    elif nilai >= 60:
        return "sedang"
    else:
        return "rendah"
```

> [!warning] Indentasi bukan sekadar gaya
> Di JavaScript, indentasi yang berantakan tetap berjalan. Di Python, indentasi yang salah langsung menghasilkan `IndentationError` atau logika yang keliru.

## Perulangan dan list comprehension

```python
harga = [12000, 8000, 15000]

# Mirip harga.map(h => h * 1.11) di JavaScript
harga_ppn = [h * 1.11 for h in harga]

# Mirip harga.filter(h => h > 10000)
mahal = [h for h in harga if h > 10000]
```

> [!tip] Jangan terlalu sering memakai for di pandas
> List comprehension berguna untuk Python biasa. Untuk tabel, pakai operasi pandas yang bekerja sekaligus pada satu kolom, misalnya `df["harga"] * 1.11`. Hasilnya lebih cepat dan lebih mudah dibaca.

## Latihan

Tulis versi Python dari kode JavaScript berikut.

```js
const nilai = [72, 88, 54, 91];
const lulus = nilai.filter(n => n >= 60);
console.log(`Jumlah lulus: ${lulus.length}`);
```

<details><summary>Cek jawaban</summary>

```python
nilai = [72, 88, 54, 91]
lulus = [n for n in nilai if n >= 60]
print(f"Jumlah lulus: {len(lulus)}")
```

</details>
