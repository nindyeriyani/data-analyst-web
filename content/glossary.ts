// Glosarium: istilah yang sering muncul selama kursus, dengan definisi singkat.
// moduleId menunjuk modul tempat istilah itu terutama dipelajari.

export interface GlossaryTerm {
  term: string;
  aliases?: string[]; // ikut dicari, misalnya singkatan atau istilah Inggris
  definition: string;
  moduleId?: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Agregasi",
    aliases: ["GROUP BY", "aggregate"],
    definition:
      "Meringkas banyak baris menjadi satu nilai, misalnya jumlah (SUM), rata-rata (AVG), atau banyaknya baris (COUNT). Dengan GROUP BY, ringkasan dihitung per kelompok, misalnya total penjualan per kota.",
    moduleId: "m2",
  },
  {
    term: "Analisis kohort",
    aliases: ["cohort", "retensi"],
    definition:
      "Mengelompokkan pelanggan berdasarkan waktu yang sama, biasanya bulan pertama mereka membeli, lalu melacak berapa persen yang kembali di bulan-bulan berikutnya. Hasilnya menunjukkan retensi dari waktu ke waktu.",
    moduleId: "m6",
  },
  {
    term: "CTE",
    aliases: ["common table expression", "WITH"],
    definition:
      "Query sementara yang diberi nama dengan kata kunci WITH, lalu dipakai seperti tabel di query utama. Berguna untuk memecah query panjang menjadi langkah-langkah yang mudah dibaca.",
    moduleId: "m2",
  },
  {
    term: "Dashboard",
    definition:
      "Satu halaman berisi beberapa grafik dan angka kunci yang dipantau secara rutin. Dashboard yang baik menjawab pertanyaan tertentu untuk pembaca tertentu, bukan menampilkan semua data yang ada.",
    moduleId: "m5",
  },
  {
    term: "Data rapi",
    aliases: ["tidy data"],
    definition:
      "Bentuk tabel dengan satu baris untuk setiap observasi, satu kolom untuk setiap variabel, dan satu nilai di setiap sel. Data dalam bentuk ini paling mudah difilter, diringkas, dan dibuat grafik.",
    moduleId: "m1",
  },
  {
    term: "DataFrame",
    definition:
      "Struktur data utama di pandas: tabel dua dimensi dengan baris dan kolom berlabel. Setiap kolom punya satu tipe data, misalnya angka, teks, atau tanggal.",
    moduleId: "m3",
  },
  {
    term: "Dataset",
    definition:
      "Kumpulan data yang dianalisis bersama, biasanya berupa satu tabel atau beberapa tabel yang saling terhubung, misalnya data penjualan beserta data pelanggannya.",
    moduleId: "m0",
  },
  {
    term: "Distribusi",
    definition:
      "Gambaran seberapa sering setiap nilai muncul dalam data. Biasanya dilihat dengan histogram untuk mengetahui pusat data, sebarannya, dan apakah bentuknya miring ke satu sisi.",
    moduleId: "m4",
  },
  {
    term: "Duplikat",
    definition:
      "Baris yang tercatat lebih dari sekali padahal mewakili hal yang sama. Duplikat membuat jumlah dan rata-rata menjadi salah, jadi perlu diperiksa dan dibuang saat membersihkan data.",
    moduleId: "m1",
  },
  {
    term: "Foreign key",
    aliases: ["kunci asing"],
    definition:
      "Kolom di satu tabel yang merujuk ke primary key di tabel lain, misalnya customer_id di tabel pesanan yang merujuk ke tabel pelanggan. Kolom inilah yang dipakai untuk JOIN.",
    moduleId: "m2",
  },
  {
    term: "JOIN",
    aliases: ["INNER JOIN", "LEFT JOIN"],
    definition:
      "Perintah SQL untuk menggabungkan baris dari dua tabel berdasarkan kolom penghubung. INNER JOIN hanya mengambil baris yang cocok di kedua tabel, LEFT JOIN mengambil semua baris tabel kiri.",
    moduleId: "m2",
  },
  {
    term: "KPI",
    aliases: ["key performance indicator", "indikator kinerja"],
    definition:
      "Angka utama yang dipakai untuk menilai apakah sebuah tujuan tercapai, misalnya jumlah layanan per bulan atau persentase permohonan yang selesai tepat waktu.",
    moduleId: "m5",
  },
  {
    term: "Korelasi",
    definition:
      "Ukuran seberapa kuat dua variabel bergerak bersama, dari -1 sampai 1. Korelasi tinggi tidak berarti yang satu menyebabkan yang lain; bisa saja keduanya dipengaruhi faktor ketiga.",
    moduleId: "m4",
  },
  {
    term: "Median",
    definition:
      "Nilai tengah setelah data diurutkan. Median tidak terpengaruh nilai ekstrem, sehingga lebih mewakili data yang miring, seperti pendapatan atau harga rumah.",
    moduleId: "m4",
  },
  {
    term: "Nilai kosong",
    aliases: ["NULL", "NaN", "missing value"],
    definition:
      "Sel yang tidak berisi data. Di SQL disebut NULL, di pandas biasanya NaN. Nilai kosong perlu diputuskan penanganannya: dibiarkan, diisi, atau barisnya dibuang, tergantung penyebabnya.",
    moduleId: "m3",
  },
  {
    term: "Notebook",
    aliases: ["Google Colab", "Jupyter"],
    definition:
      "Dokumen yang menggabungkan kode, hasil, grafik, dan teks penjelasan dalam satu tempat. Google Colab menjalankan notebook Python di browser tanpa instalasi.",
    moduleId: "m3",
  },
  {
    term: "Observasi dan variabel",
    definition:
      "Observasi adalah satu hal yang dicatat, misalnya satu pesanan, dan menjadi satu baris. Variabel adalah ciri yang diukur dari setiap observasi, misalnya tanggal atau jumlah, dan menjadi satu kolom.",
    moduleId: "m1",
  },
  {
    term: "Outlier",
    aliases: ["pencilan"],
    definition:
      "Nilai yang jauh berbeda dari sebagian besar data. Outlier bisa berupa kesalahan input atau kejadian nyata yang penting, jadi perlu diselidiki sebelum dibuang.",
    moduleId: "m4",
  },
  {
    term: "pandas",
    definition:
      "Pustaka Python untuk membaca, membersihkan, mengolah, dan meringkas data tabel. Hampir semua analisis data dengan Python memakai pandas.",
    moduleId: "m3",
  },
  {
    term: "Pembersihan data",
    aliases: ["data cleaning"],
    definition:
      "Merapikan data mentah sebelum dianalisis: membuang duplikat, menangani nilai kosong, menyeragamkan format tanggal dan teks, serta memperbaiki tipe data.",
    moduleId: "m1",
  },
  {
    term: "Pivot table",
    definition:
      "Fitur spreadsheet untuk meringkas data dengan menyeret kolom ke baris, kolom, dan nilai. Misalnya menjumlahkan penjualan per kota per bulan tanpa menulis rumus.",
    moduleId: "m1",
  },
  {
    term: "Primary key",
    aliases: ["kunci utama"],
    definition:
      "Kolom yang nilainya unik untuk setiap baris dan tidak boleh kosong, misalnya order_id. Dipakai untuk menunjuk satu baris secara pasti.",
    moduleId: "m2",
  },
  {
    term: "Query",
    definition:
      "Perintah untuk mengambil atau mengolah data dari database. Di kursus ini query ditulis dalam SQL, misalnya SELECT untuk mengambil kolom tertentu dari sebuah tabel.",
    moduleId: "m2",
  },
  {
    term: "Rata-rata",
    aliases: ["mean", "AVG"],
    definition:
      "Jumlah semua nilai dibagi banyaknya nilai. Rata-rata mudah tertarik oleh nilai ekstrem, jadi bandingkan dengan median sebelum menyimpulkan.",
    moduleId: "m4",
  },
  {
    term: "Sampel dan populasi",
    definition:
      "Populasi adalah seluruh kelompok yang ingin dipahami. Sampel adalah sebagian yang benar-benar diamati. Kesimpulan dari sampel hanya berlaku untuk populasi jika sampelnya mewakili.",
    moduleId: "m4",
  },
  {
    term: "Segmentasi RFM",
    aliases: ["recency", "frequency", "monetary"],
    definition:
      "Mengelompokkan pelanggan berdasarkan tiga hal: kapan terakhir membeli (recency), seberapa sering membeli (frequency), dan berapa banyak uang yang dibelanjakan (monetary).",
    moduleId: "m6",
  },
  {
    term: "Simpangan baku",
    aliases: ["standard deviation"],
    definition:
      "Ukuran seberapa jauh nilai-nilai menyebar dari rata-ratanya. Simpangan baku kecil berarti data berkumpul dekat rata-rata, simpangan baku besar berarti data menyebar luas.",
    moduleId: "m4",
  },
  {
    term: "SQL",
    aliases: ["structured query language"],
    definition:
      "Bahasa standar untuk mengambil dan mengolah data di database relasional. Dipakai di BigQuery, PostgreSQL, MySQL, dan banyak sistem lain dengan sedikit perbedaan.",
    moduleId: "m2",
  },
  {
    term: "Storytelling data",
    definition:
      "Menyampaikan temuan analisis sebagai cerita yang runtut: konteks, temuan utama, bukti dalam grafik, lalu rekomendasi. Tujuannya agar pembaca paham dan bisa mengambil keputusan.",
    moduleId: "m5",
  },
  {
    term: "Tipe data",
    definition:
      "Jenis nilai dalam sebuah kolom, misalnya angka bulat, desimal, teks, tanggal, atau benar/salah. Tipe data yang salah, seperti angka yang tersimpan sebagai teks, membuat perhitungan keliru.",
    moduleId: "m1",
  },
  {
    term: "Window function",
    aliases: ["OVER", "ROW_NUMBER", "RANK"],
    definition:
      "Fungsi SQL yang menghitung nilai berdasarkan sekumpulan baris terkait tanpa menggabungkan barisnya, misalnya peringkat per kategori atau total berjalan. Ditulis dengan OVER (...).",
    moduleId: "m2",
  },
  {
    term: "XLOOKUP",
    definition:
      "Rumus spreadsheet untuk mencari nilai di satu kolom lalu mengambil nilai yang sejajar di kolom lain, misalnya mengambil nama pelanggan berdasarkan id-nya.",
    moduleId: "m1",
  },
];
