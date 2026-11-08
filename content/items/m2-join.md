## Kenapa butuh JOIN

Data di database jarang tersimpan dalam satu tabel besar. Pesanan ada di tabel `orders`, data pelanggan ada di tabel `customers`. Keduanya dihubungkan oleh kolom yang sama, biasanya sebuah id. `JOIN` menggabungkan baris dari dua tabel berdasarkan kolom penghubung itu.

Cara kerjanya: untuk setiap baris di `orders`, database mencari baris di `customers` yang `customer_id`-nya sama, lalu menempelkan kolom-kolom pelanggan di samping baris pesanan itu. Hasilnya satu tabel baru yang berisi kolom dari kedua tabel.

## Data latihan

Salin kedua tabel di bawah ke Google Sheets atau impor ke BigQuery untuk mencoba query di halaman ini.

```csv
customer_id,name,city
1,Ayu,Bandung
2,Bima,Surabaya
3,Citra,Medan
4,Dodi,Makassar
```

```csv
order_id,customer_id,order_date,amount
101,1,2026-11-02,250000
102,2,2026-11-03,120000
103,1,2026-11-05,90000
104,3,2026-11-06,310000
105,5,2026-11-07,75000
```

Perhatikan dua hal: Dodi (id 4) belum pernah memesan, dan pesanan 105 punya `customer_id` 5 yang tidak ada di tabel pelanggan.

## Jenis JOIN

| Jenis | Baris yang diambil |
|---|---|
| `INNER JOIN` | Hanya baris yang cocok di kedua tabel |
| `LEFT JOIN` | Semua baris tabel kiri, ditambah yang cocok dari tabel kanan |
| `RIGHT JOIN` | Semua baris tabel kanan, ditambah yang cocok dari tabel kiri |
| `FULL OUTER JOIN` | Semua baris dari kedua tabel |

### INNER JOIN

```sql
SELECT o.order_id, c.name, o.amount
FROM orders AS o
INNER JOIN customers AS c
  ON o.customer_id = c.customer_id;
```

Hasilnya empat baris. Pesanan 105 hilang karena pelanggannya tidak ditemukan, dan Dodi tidak muncul karena tidak punya pesanan.

### LEFT JOIN

```sql
SELECT c.name, COUNT(o.order_id) AS total_orders
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.customer_id
GROUP BY c.name;
```

Semua pelanggan tetap muncul, termasuk Dodi dengan `total_orders` 0.

> [!tip] Pilih tabel kiri dengan sengaja
> Tanyakan dulu: "Saya ingin satu baris untuk setiap apa?" Kalau jawabannya "setiap pelanggan", jadikan `customers` tabel kiri lalu pakai `LEFT JOIN`.

> [!warning] Hati-hati baris ganda
> Kalau satu pelanggan punya banyak pesanan, JOIN akan mengulang data pelanggan di setiap baris pesanan. Menjumlahkan kolom dari tabel pelanggan setelah JOIN bisa menghasilkan angka yang terlalu besar. Lakukan agregasi di tabel yang benar, atau agregasi dulu di dalam CTE sebelum JOIN.

## Latihan

1. Tampilkan semua pesanan beserta kota pelanggannya. Pesanan tanpa pelanggan tetap harus muncul.
2. Hitung total belanja per kota.
3. Temukan pelanggan yang belum pernah memesan.

<details><summary>Cek jawaban</summary>

```sql
-- 1
SELECT o.order_id, o.amount, c.city
FROM orders AS o
LEFT JOIN customers AS c ON o.customer_id = c.customer_id;

-- 2
SELECT c.city, SUM(o.amount) AS total_amount
FROM orders AS o
INNER JOIN customers AS c ON o.customer_id = c.customer_id
GROUP BY c.city
ORDER BY total_amount DESC;

-- 3
SELECT c.name
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;
```

Jawaban nomor 3 adalah pola yang sangat sering dipakai: `LEFT JOIN` lalu filter `IS NULL` untuk mencari data yang tidak punya pasangan.

</details>
