## Brief

Ubah hasil proyek SQL (theLook) atau proyek pandas (dataset publik) menjadi **dashboard Tableau Public dengan satu pesan utama**. Pembaca harus bisa menangkap pesannya dalam satu menit tanpa penjelasan dari Anda.

## Langkah

1. **Pilih sumber (10 menit).** Proyek mana yang temuannya paling menarik? Ambil hasilnya.
2. **Siapkan data (20 menit).** Simpan hasil query BigQuery (**Save results**, CSV) atau hasil pandas (`df.to_csv(..., index=False)`) sebagai CSV yang rapi. Tableau Public Edition bekerja paling mudah dengan file. Kalau data mentahnya besar, simpan hasil ringkasan, misalnya per bulan per kategori, bukan semua baris.
3. **Tulis pesan utama (10 menit)**, dalam satu kalimat. Contoh: "Pendapatan theLook terus naik sepanjang tahun, didorong kategori X, sementara tingkat pengembalian tertinggi di kategori Y."
4. **Rancang susunan (15 menit).** Sketsa singkat: kartu skor di atas, grafik utama di tengah, rincian di bawah, dan filter di tepi.
5. **Bangun di Tableau (50 menit).** Satu sheet per pertanyaan, lalu gabungkan di dashboard.
6. **Periksa dengan daftar di bawah, lalu publikasikan (15 menit).**

## Daftar periksa sesuai rubrik

- [ ] Judul dashboard menyampaikan temuan utama, bukan sekadar topik
- [ ] Setiap grafik menjawab satu pertanyaan yang jelas, dan judulnya menyatakan temuan
- [ ] Warna dipakai untuk menyorot, sedangkan yang lain netral atau abu-abu
- [ ] Ada filter atau interaksi yang berguna, misalnya filter kategori atau **Use as Filter**
- [ ] Dipublikasikan di Tableau Public dengan deskripsi singkat dan sumber data

> [!tip] Minta orang lain mencoba
> Tunjukkan dashboard ke teman atau keluarga selama 30 detik, lalu tanyakan: "Apa pesan utamanya?" Kalau jawabannya berbeda dari pesan utama Anda, perjelas judul atau sorotan warnanya.

> [!warning] Sebutkan sumber dan batasannya
> Di bagian bawah dashboard, tambahkan teks kecil berisi sumber data, rentang waktu, dan catatan penting. Contoh: "Sumber: BigQuery public dataset thelook_ecommerce (data rekaan), Januari–Desember 2025. Hanya item berstatus selesai."

## Yang dikumpulkan

Tautan dashboard di Tableau Public, ditempel di kolom **Tautan hasil kerja**. Tambahkan juga tautan ini dan tangkapan layarnya di README folder proyek di GitHub.
