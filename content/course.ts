// Struktur kursus: fase, modul, dan item. Satu sumber kebenaran untuk seluruh aplikasi.
// Isi materi per item ada di content/items/<itemId>.md, soal kuis di content/quizzes/<itemId>.json.

export type ItemType =
  | "intro"
  | "reading"
  | "course"
  | "lab"
  | "quiz"
  | "project"
  | "magang"
  | "wrap";

export type Section = "mulai" | "pelajari" | "latihan" | "uji";

export interface Item {
  id: string; // unik global, format "<moduleId>-<slug>"
  type: ItemType;
  title: string;
  minutes: number; // estimasi waktu
  week: number; // minggu kursus (1–13), menentukan tenggat
  section: Section;
  url?: string; // untuk type "course" atau sumber luar
  note?: string; // keterangan singkat untuk item tanpa file materi
  rubric?: string[]; // untuk type "project"
}

export interface Module {
  id: string; // "m0" sampai "m8", dan "ekstra"
  phase: 1 | 2 | 3;
  title: string;
  description: string;
  objectives: string[];
  weeks: [number, number];
  items: Item[];
}

export type PhaseId = Module["phase"];

export const PHASES: Record<PhaseId, { label: string; title: string }> = {
  1: { label: "Fase 1", title: "Fondasi" },
  2: { label: "Fase 2", title: "Analisis dan visualisasi" },
  3: { label: "Fase 3", title: "Portofolio dan karier" },
};

export const SECTIONS: { id: Section; label: string }[] = [
  { id: "mulai", label: "Mulai" },
  { id: "pelajari", label: "Pelajari" },
  { id: "latihan", label: "Latihan" },
  { id: "uji", label: "Uji dan refleksi" },
];

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  intro: "Pengantar",
  reading: "Bacaan",
  course: "Kursus luar",
  lab: "Lab",
  quiz: "Kuis",
  project: "Proyek",
  magang: "Tugas magang",
  wrap: "Refleksi",
};

/** Item yang menjadi syarat badge pencapaian (lihat dashboard). */
export const BADGE_ITEMS = {
  firstModule: "m0", // seluruh modul m0 selesai
  sql: "m2-proyek",
  python: "m3-proyek",
  firstPortfolio: "m6-proyek-thelook",
  portfolioOnline: "m7-proyek",
  firstApplication: "m8-lamaran",
} as const;

export const MODULES: Module[] = [
  {
    id: "m0",
    phase: 1,
    title: "Orientasi dan persiapan",
    description:
      "Mengenal pekerjaan data analyst, alur analisis, dan menyiapkan semua alat gratis yang dipakai selama kursus.",
    objectives: [
      "Menjelaskan tugas harian data analyst dan alur analisis dari pertanyaan sampai rekomendasi.",
      "Menyiapkan Google Sheets, Colab, BigQuery sandbox, GitHub, dan Tableau Public.",
      "Memetakan sumber data di tempat magang tanpa menyalin data internal.",
      "Menetapkan cara belajar dengan AI yang tetap membangun pemahaman sendiri.",
    ],
    weeks: [1, 1],
    items: [
      { id: "m0-intro", type: "intro", title: "Selamat datang dan cara memakai kursus ini", minutes: 15, week: 1, section: "mulai" },
      {
        id: "m0-peran", type: "reading", title: "Apa kerja data analyst", minutes: 30, week: 1, section: "pelajari",
        note: "Tugas harian, alat yang dipakai, dan perbedaan data analyst dengan data scientist dan data engineer.",
      },
      {
        id: "m0-alur", type: "reading", title: "Alur analisis: tanya, siapkan, olah, analisis, bagikan, bertindak", minutes: 30, week: 1, section: "pelajari",
        note: "Enam langkah yang dipakai di setiap proyek kursus ini, dari merumuskan pertanyaan sampai menyampaikan temuan.",
      },
      {
        id: "m0-belajar-ai", type: "reading", title: "Belajar bersama AI tanpa bergantung padanya", minutes: 30, week: 1, section: "pelajari",
        note: "Coba dulu sendiri, tanya AI untuk penjelasan bukan jawaban jadi, lalu tulis ulang dengan kata-kata sendiri.",
      },
      {
        id: "m0-setup", type: "lab", title: "Siapkan alat: Sheets, Colab, BigQuery, GitHub, Tableau Public", minutes: 120, week: 1, section: "latihan",
        note: "Buat akun dan pastikan setiap alat bisa dibuka. Semua gratis dan cukup memakai akun Google serta email.",
      },
      {
        id: "m0-git", type: "lab", title: "Dasar Git dan GitHub untuk portofolio", minutes: 60, week: 1, section: "latihan",
        note: "Buat repositori portofolio kosong dengan README. Repo ini diisi bertahap sampai minggu 11.",
      },
      { id: "m0-kuis", type: "quiz", title: "Kuis orientasi", minutes: 15, week: 1, section: "latihan" },
      {
        id: "m0-magang", type: "magang", title: "Petakan sumber data di tempat magang", minutes: 150, week: 1, section: "latihan",
        note: "Catat laporan apa saja yang ada, siapa pemakainya, formatnya, dan seberapa sering diperbarui. Jangan menyalin data.",
      },
      { id: "m0-wrap", type: "wrap", title: "Refleksi minggu 1 dan tujuan pribadi", minutes: 20, week: 1, section: "uji" },
    ],
  },
  {
    id: "m1",
    phase: 1,
    title: "Spreadsheet untuk analisis",
    description:
      "Merapikan data, rumus inti, dan pivot table di Google Sheets. Fondasi yang langsung terpakai di tempat magang.",
    objectives: [
      "Mengenali data rapi (satu baris satu observasi) dan tipe data yang benar.",
      "Memakai IF, SUMIFS, COUNTIFS, dan XLOOKUP untuk menjawab pertanyaan.",
      "Membuat pivot table dan grafik sederhana untuk meringkas data.",
      "Membersihkan data: duplikat, spasi, format tanggal, dan nilai kosong.",
    ],
    weeks: [2, 2],
    items: [
      { id: "m1-intro", type: "intro", title: "Pengantar spreadsheet untuk analisis", minutes: 10, week: 2, section: "mulai" },
      {
        id: "m1-data-rapi", type: "reading", title: "Data rapi dan tipe data", minutes: 40, week: 2, section: "pelajari",
        note: "Bentuk tabel yang mudah dianalisis, serta kenapa angka yang tersimpan sebagai teks merusak perhitungan.",
      },
      {
        id: "m1-rumus", type: "reading", title: "Rumus inti: IF, SUMIFS, COUNTIFS, XLOOKUP", minutes: 60, week: 2, section: "pelajari",
        note: "Empat rumus yang menjawab sebagian besar pertanyaan sehari-hari di spreadsheet.",
      },
      {
        id: "m1-pivot", type: "reading", title: "Pivot table dan grafik", minutes: 60, week: 2, section: "pelajari",
        note: "Meringkas ribuan baris menjadi tabel ringkas, lalu memilih grafik yang tepat.",
      },
      {
        id: "m1-lab-cleaning", type: "lab", title: "Lab: membersihkan data penjualan", minutes: 90, week: 2, section: "latihan",
        note: "Dataset kecil berisi duplikat, spasi berlebih, dan format tanggal campur aduk untuk dirapikan.",
      },
      { id: "m1-kuis", type: "quiz", title: "Kuis spreadsheet", minutes: 15, week: 2, section: "latihan" },
      {
        id: "m1-magang", type: "magang", title: "Rapikan satu laporan rutin", minutes: 120, week: 2, section: "latihan",
        note: "Pilih satu laporan yang sering dibuat manual, rapikan strukturnya, dan catat langkah yang bisa dihemat.",
      },
      {
        id: "m1-proyek", type: "project", title: "Proyek mini: analisis dengan pivot table", minutes: 150, week: 2, section: "uji",
        note: "Pakai dataset publik kecil, jawab tiga pertanyaan dengan pivot table, dan tulis ringkasan temuan.",
        rubric: [
          "Data sudah dibersihkan dan langkah pembersihan dicatat.",
          "Tiga pertanyaan analisis ditulis dengan jelas.",
          "Setiap pertanyaan dijawab dengan pivot table atau rumus yang tepat.",
          "Ada minimal dua grafik yang mudah dibaca.",
          "Ringkasan temuan ditulis dalam 3–5 kalimat.",
        ],
      },
      { id: "m1-wrap", type: "wrap", title: "Refleksi modul spreadsheet", minutes: 20, week: 2, section: "uji" },
    ],
  },
  {
    id: "m2",
    phase: 1,
    title: "SQL untuk analisis",
    description:
      "Dari SELECT sampai window function. Berlatih di SQLBolt dan Kaggle, lalu menganalisis dataset e-commerce theLook di BigQuery.",
    objectives: [
      "Menulis query SELECT dengan WHERE, ORDER BY, dan LIMIT.",
      "Meringkas data dengan GROUP BY, fungsi agregat, dan HAVING.",
      "Menggabungkan tabel dengan JOIN dan menyusun query bertahap dengan CTE.",
      "Memakai window function untuk peringkat dan total berjalan.",
      "Menjalankan analisis nyata di BigQuery sandbox.",
    ],
    weeks: [3, 4],
    items: [
      { id: "m2-intro", type: "intro", title: "Pengantar SQL untuk analisis", minutes: 10, week: 3, section: "mulai" },
      {
        id: "m2-select", type: "reading", title: "SELECT, WHERE, dan ORDER BY", minutes: 45, week: 3, section: "pelajari",
        note: "Mengambil kolom, memfilter baris, dan mengurutkan hasil.",
      },
      {
        id: "m2-sqlbolt", type: "course", title: "SQLBolt: pelajaran 1–12", minutes: 120, week: 3, section: "pelajari",
        url: "https://sqlbolt.com/",
        note: "Latihan interaktif langsung di browser. Kerjakan pelajaran 1 sampai 12 beserta soalnya.",
      },
      {
        id: "m2-kaggle-sql", type: "course", title: "Kaggle Learn: Intro to SQL", minutes: 120, week: 3, section: "pelajari",
        url: "https://www.kaggle.com/learn/intro-to-sql",
        note: "Kursus singkat yang memakai BigQuery, jadi sekaligus mengenal cara kerja dataset publik Google.",
      },
      {
        id: "m2-agregasi", type: "reading", title: "GROUP BY, fungsi agregat, dan HAVING", minutes: 45, week: 3, section: "pelajari",
        note: "COUNT, SUM, AVG, MIN, MAX, serta perbedaan WHERE dan HAVING.",
      },
      { id: "m2-kuis-dasar", type: "quiz", title: "Kuis SQL dasar", minutes: 15, week: 3, section: "latihan" },
      {
        id: "m2-magang-1", type: "magang", title: "Tulis lima pertanyaan bisnis dari laporan magang", minutes: 120, week: 3, section: "latihan",
        note: "Ubah kebutuhan atasan menjadi pertanyaan yang bisa dijawab dengan data. Cukup pertanyaannya, tanpa datanya.",
      },
      {
        id: "m2-join", type: "reading", title: "JOIN: menggabungkan tabel", minutes: 45, week: 4, section: "pelajari",
      },
      {
        id: "m2-cte", type: "reading", title: "Subquery, CTE, dan CASE", minutes: 45, week: 4, section: "pelajari",
        note: "Menyusun query panjang menjadi langkah-langkah yang mudah dibaca, dan membuat kategori dengan CASE.",
      },
      {
        id: "m2-window", type: "reading", title: "Window function", minutes: 60, week: 4, section: "pelajari",
        note: "ROW_NUMBER, RANK, LAG, dan SUM OVER untuk peringkat, perbandingan periode, dan total berjalan.",
      },
      {
        id: "m2-bigquery", type: "lab", title: "Lab: mulai BigQuery sandbox dengan theLook", minutes: 60, week: 4, section: "latihan",
        url: "https://console.cloud.google.com/marketplace/product/bigquery-public-data/thelook-ecommerce",
        note: "Aktifkan BigQuery sandbox (tanpa kartu kredit), buka dataset thelook_ecommerce, dan jalankan query pertama.",
      },
      {
        id: "m2-datalemur", type: "course", title: "DataLemur: soal SQL tingkat easy", minutes: 90, week: 4, section: "latihan",
        url: "https://datalemur.com/questions",
        note: "Soal SQL gaya wawancara kerja. Kerjakan minimal lima soal tingkat easy.",
      },
      { id: "m2-kuis-lanjut", type: "quiz", title: "Kuis SQL lanjutan", minutes: 15, week: 4, section: "latihan" },
      {
        id: "m2-magang-2", type: "magang", title: "Rancang tabel untuk satu laporan magang", minutes: 60, week: 4, section: "latihan",
        note: "Gambarkan tabel dan kolom yang dibutuhkan kalau laporan itu disimpan di database. Cukup rancangan di kertas.",
      },
      {
        id: "m2-proyek", type: "project", title: "Proyek SQL: analisis penjualan theLook", minutes: 180, week: 4, section: "uji",
        note: "Jawab pertanyaan bisnis tentang penjualan, produk, dan pelanggan theLook dengan SQL di BigQuery.",
        rubric: [
          "Minimal lima pertanyaan bisnis ditulis sebelum menulis query.",
          "Query memakai JOIN, GROUP BY, dan minimal satu CTE.",
          "Minimal satu query memakai window function.",
          "Setiap hasil query disertai interpretasi satu atau dua kalimat.",
          "Semua query disimpan di repositori GitHub dengan komentar yang jelas.",
        ],
      },
      { id: "m2-wrap", type: "wrap", title: "Refleksi modul SQL", minutes: 20, week: 4, section: "uji" },
    ],
  },
  {
    id: "m3",
    phase: 1,
    title: "Python dan pandas",
    description:
      "Python untuk analisis data di Google Colab: dasar bahasa, pandas untuk membersihkan dan meringkas data, dan grafik dengan matplotlib.",
    objectives: [
      "Menulis Python dasar: tipe data, list, dictionary, kondisi, perulangan, dan fungsi.",
      "Membaca, memfilter, dan meringkas data dengan pandas.",
      "Membersihkan data: nilai kosong, duplikat, tipe data, dan teks.",
      "Menggabungkan tabel dengan merge dan meringkas dengan groupby serta pivot_table.",
      "Membuat grafik sederhana dengan matplotlib.",
    ],
    weeks: [5, 6],
    items: [
      { id: "m3-intro", type: "intro", title: "Pengantar Python untuk analisis data", minutes: 10, week: 5, section: "mulai" },
      { id: "m3-python-dasar", type: "reading", title: "Dasar Python untuk analisis", minutes: 45, week: 5, section: "pelajari" },
      {
        id: "m3-kaggle-python", type: "course", title: "Kaggle Learn: Python", minutes: 180, week: 5, section: "pelajari",
        url: "https://www.kaggle.com/learn/python",
        note: "Tujuh pelajaran singkat dengan latihan. Ketik sendiri kodenya, jangan langsung minta jawaban ke AI.",
      },
      {
        id: "m3-pandas-dasar", type: "reading", title: "Dasar pandas: DataFrame, filter, dan kolom baru", minutes: 60, week: 5, section: "pelajari",
        note: "read_csv, head, info, describe, memilih kolom, memfilter baris, dan membuat kolom turunan.",
      },
      {
        id: "m3-kaggle-pandas", type: "course", title: "Kaggle Learn: Pandas", minutes: 150, week: 5, section: "pelajari",
        url: "https://www.kaggle.com/learn/pandas",
        note: "Enam pelajaran pandas dengan latihan langsung di notebook Kaggle.",
      },
      {
        id: "m3-colab", type: "lab", title: "Lab: notebook pertama di Google Colab", minutes: 45, week: 5, section: "latihan",
        url: "https://colab.research.google.com/",
        note: "Buat notebook, tulis sel teks dan sel kode, unggah CSV kecil, dan simpan ke GitHub.",
      },
      { id: "m3-kuis-dasar", type: "quiz", title: "Kuis Python dan pandas dasar", minutes: 15, week: 5, section: "latihan" },
      {
        id: "m3-magang", type: "magang", title: "Cari satu pekerjaan berulang yang bisa diotomatiskan", minutes: 60, week: 5, section: "latihan",
        note: "Catat langkah-langkahnya. Nanti dicoba ulang di Colab memakai data tiruan, bukan data instansi.",
      },
      {
        id: "m3-cleaning", type: "reading", title: "Membersihkan data dengan pandas", minutes: 60, week: 6, section: "pelajari",
        note: "isna, fillna, drop_duplicates, astype, to_datetime, dan fungsi teks .str.",
      },
      {
        id: "m3-groupby", type: "reading", title: "groupby, merge, dan pivot_table", minutes: 60, week: 6, section: "pelajari",
        note: "Padanan GROUP BY dan JOIN dari SQL di pandas.",
      },
      {
        id: "m3-matplotlib", type: "reading", title: "Grafik dengan matplotlib", minutes: 45, week: 6, section: "pelajari",
        note: "Grafik garis, batang, dan histogram, serta cara memberi judul dan label yang jelas.",
      },
      {
        id: "m3-lab-cleaning", type: "lab", title: "Lab: membersihkan data survei", minutes: 90, week: 6, section: "latihan",
        note: "Dataset kecil berantakan untuk dibersihkan dan diringkas di Colab.",
      },
      { id: "m3-kuis-lanjut", type: "quiz", title: "Kuis pandas lanjutan", minutes: 15, week: 6, section: "latihan" },
      {
        id: "m3-proyek", type: "project", title: "Proyek pandas: analisis dataset publik", minutes: 180, week: 6, section: "uji",
        note: "Pilih dataset publik (misalnya dari Kaggle atau BPS), bersihkan, analisis, dan tulis temuan di notebook Colab.",
        rubric: [
          "Notebook diawali tujuan dan pertanyaan analisis.",
          "Langkah pembersihan data dijelaskan di sel teks.",
          "Memakai groupby atau pivot_table untuk menjawab pertanyaan.",
          "Ada minimal tiga grafik dengan judul dan label yang jelas.",
          "Kesimpulan dan keterbatasan analisis ditulis di akhir notebook.",
          "Notebook disimpan di GitHub dan bisa dibuka orang lain.",
        ],
      },
      { id: "m3-wrap", type: "wrap", title: "Refleksi modul Python", minutes: 20, week: 6, section: "uji" },
    ],
  },
  {
    id: "m4",
    phase: 2,
    title: "Statistik praktis",
    description:
      "Minggu ringan di libur akhir tahun. Statistik yang paling sering dipakai analyst: ringkasan data, distribusi, korelasi, dan dasar uji hipotesis.",
    objectives: [
      "Memilih ukuran pemusatan dan sebaran yang tepat (rata-rata, median, simpangan baku).",
      "Membaca bentuk distribusi dan mengenali outlier.",
      "Membedakan korelasi dan kausalitas.",
      "Memahami ide dasar uji hipotesis dan A/B test.",
    ],
    weeks: [7, 7],
    items: [
      { id: "m4-intro", type: "intro", title: "Pengantar statistik praktis", minutes: 10, week: 7, section: "mulai" },
      {
        id: "m4-deskriptif", type: "reading", title: "Statistik deskriptif", minutes: 40, week: 7, section: "pelajari",
        note: "Rata-rata, median, modus, rentang, kuartil, dan simpangan baku, serta kapan memakai yang mana.",
      },
      {
        id: "m4-distribusi", type: "reading", title: "Distribusi dan outlier", minutes: 40, week: 7, section: "pelajari",
        note: "Histogram, box plot, distribusi miring, dan cara menangani outlier.",
      },
      {
        id: "m4-khan", type: "course", title: "Khan Academy: statistik dan peluang", minutes: 60, week: 7, section: "pelajari",
        url: "https://www.khanacademy.org/math/statistics-probability",
        note: "Tonton bagian ringkasan data kuantitatif dan kerjakan latihannya.",
      },
      {
        id: "m4-korelasi", type: "reading", title: "Korelasi bukan kausalitas", minutes: 30, week: 7, section: "pelajari",
        note: "Membaca koefisien korelasi dan contoh kesimpulan keliru yang sering muncul di laporan.",
      },
      {
        id: "m4-hipotesis", type: "reading", title: "Dasar uji hipotesis dan A/B test", minutes: 45, week: 7, section: "pelajari",
        note: "Hipotesis nol, p-value, dan cara membaca hasil A/B test tanpa rumus rumit.",
      },
      { id: "m4-kuis", type: "quiz", title: "Kuis statistik praktis", minutes: 15, week: 7, section: "latihan" },
      { id: "m4-wrap", type: "wrap", title: "Refleksi modul statistik", minutes: 15, week: 7, section: "uji" },
    ],
  },
  {
    id: "m5",
    phase: 2,
    title: "Visualisasi dan storytelling",
    description:
      "Memilih grafik yang tepat, menyusun cerita dari data, dan membuat dashboard di Tableau Public serta Looker Studio.",
    objectives: [
      "Memilih jenis grafik sesuai pertanyaan.",
      "Menyusun temuan menjadi cerita: konteks, temuan, rekomendasi.",
      "Membuat dashboard interaktif di Tableau Public.",
      "Membuat laporan di Looker Studio yang terhubung ke Google Sheets.",
    ],
    weeks: [8, 8],
    items: [
      { id: "m5-intro", type: "intro", title: "Pengantar visualisasi dan storytelling", minutes: 10, week: 8, section: "mulai" },
      {
        id: "m5-memilih-grafik", type: "reading", title: "Memilih grafik yang tepat", minutes: 40, week: 8, section: "pelajari",
        note: "Perbandingan, tren, komposisi, distribusi, dan hubungan: grafik apa untuk pertanyaan apa.",
      },
      {
        id: "m5-storytelling", type: "reading", title: "Storytelling dengan data", minutes: 40, week: 8, section: "pelajari",
        note: "Mengurangi kekacauan visual, memakai warna untuk menyorot, dan menulis judul yang menyampaikan temuan.",
      },
      {
        id: "m5-tableau-training", type: "course", title: "Video pelatihan gratis Tableau", minutes: 90, week: 8, section: "pelajari",
        url: "https://www.tableau.com/learn/training",
        note: "Tonton video Getting Started dan Visual Analytics. Praktikkan di Tableau Public.",
      },
      {
        id: "m5-lab-tableau", type: "lab", title: "Lab: dashboard pertama di Tableau Public", minutes: 90, week: 8, section: "latihan",
        url: "https://public.tableau.com/",
        note: "Hubungkan CSV, buat tiga sheet, gabungkan menjadi dashboard, lalu publikasikan.",
      },
      {
        id: "m5-lab-looker", type: "lab", title: "Lab: laporan Looker Studio dari Google Sheets", minutes: 60, week: 8, section: "latihan",
        url: "https://lookerstudio.google.com/",
        note: "Sambungkan Google Sheets ke Looker Studio dan buat laporan satu halaman dengan filter tanggal.",
      },
      { id: "m5-kuis", type: "quiz", title: "Kuis visualisasi", minutes: 15, week: 8, section: "latihan" },
      {
        id: "m5-magang", type: "magang", title: "Usulkan dashboard Looker Studio untuk tim", minutes: 90, week: 8, section: "latihan",
        note: "Buat sketsa dashboard untuk satu laporan rutin. Kalau disetujui, bangun di akun instansi, bukan di akun pribadi.",
      },
      {
        id: "m5-proyek", type: "project", title: "Proyek: dashboard yang bercerita", minutes: 120, week: 8, section: "uji",
        note: "Ubah hasil proyek SQL atau pandas menjadi dashboard Tableau Public dengan satu pesan utama.",
        rubric: [
          "Judul dashboard menyampaikan temuan utama, bukan sekadar topik.",
          "Setiap grafik menjawab satu pertanyaan yang jelas.",
          "Warna dipakai untuk menyorot, bukan menghias.",
          "Ada filter atau interaksi yang berguna.",
          "Dashboard dipublikasikan di Tableau Public.",
        ],
      },
      { id: "m5-wrap", type: "wrap", title: "Refleksi modul visualisasi", minutes: 20, week: 8, section: "uji" },
    ],
  },
  {
    id: "m6",
    phase: 3,
    title: "Proyek portofolio",
    description:
      "Tiga proyek untuk portofolio: analisis e-commerce theLook dengan RFM dan kohort, dashboard indikator daerah dari data terbuka, dan studi kasus magang.",
    objectives: [
      "Melakukan segmentasi pelanggan dengan RFM.",
      "Menghitung dan memvisualisasikan retensi kohort.",
      "Membangun dashboard dari data terbuka BPS atau Satu Data Indonesia.",
      "Menulis studi kasus proyek magang tanpa menampilkan data internal.",
    ],
    weeks: [9, 10],
    items: [
      { id: "m6-intro", type: "intro", title: "Pengantar proyek portofolio", minutes: 15, week: 9, section: "mulai" },
      {
        id: "m6-rfm", type: "reading", title: "Segmentasi pelanggan dengan RFM", minutes: 45, week: 9, section: "pelajari",
        note: "Recency, frequency, monetary: cara menghitung skor dan memberi nama segmen.",
      },
      {
        id: "m6-kohort", type: "reading", title: "Analisis retensi kohort", minutes: 45, week: 9, section: "pelajari",
        note: "Mengelompokkan pelanggan berdasarkan bulan pertama belanja dan membaca tabel retensi.",
      },
      {
        id: "m6-magang", type: "magang", title: "Catat bahan studi kasus magang", minutes: 60, week: 9, section: "latihan",
        note: "Tulis masalah, proses, alat, dan dampak proyek magang. Jangan menyimpan data internal, cukup gambaran umum.",
      },
      {
        id: "m6-proyek-thelook", type: "project", title: "Proyek 1: RFM dan kohort e-commerce theLook", minutes: 360, week: 9, section: "uji",
        url: "https://console.cloud.google.com/marketplace/product/bigquery-public-data/thelook-ecommerce",
        note: "Analisis di BigQuery, visualisasi di Tableau Public, dan tulis rekomendasi bisnis.",
        rubric: [
          "Pertanyaan bisnis dan ruang lingkup ditulis di awal.",
          "Skor RFM dihitung dengan SQL dan setiap segmen diberi nama serta penjelasan.",
          "Tabel retensi kohort bulanan dihitung dengan SQL.",
          "Dashboard Tableau Public menampilkan segmen RFM dan heatmap kohort.",
          "Minimal tiga rekomendasi bisnis yang didukung data.",
          "README di GitHub berisi ringkasan, metode, query, dan tautan dashboard.",
        ],
      },
      {
        id: "m6-proyek-daerah", type: "project", title: "Proyek 2: dashboard indikator daerah", minutes: 300, week: 10, section: "uji",
        url: "https://www.bps.go.id/",
        note: "Ambil data terbuka dari BPS atau Satu Data Indonesia (data.go.id), misalnya kemiskinan, IPM, atau pengangguran per kabupaten.",
        rubric: [
          "Sumber data dicantumkan lengkap dengan tautan dan tanggal unduh.",
          "Data dibersihkan dan diubah ke bentuk rapi dengan langkah yang terdokumentasi.",
          "Dashboard menampilkan tren waktu dan perbandingan antarwilayah.",
          "Ada catatan cara membaca indikator untuk pembaca awam.",
          "Dashboard dipublikasikan di Tableau Public atau Looker Studio.",
        ],
      },
      {
        id: "m6-proyek-magang", type: "project", title: "Proyek 3: studi kasus proyek magang", minutes: 180, week: 10, section: "uji",
        note: "Tulis studi kasus: konteks, masalah, pendekatan, hasil, dan pelajaran. Pakai angka yang disamarkan atau persentase.",
        rubric: [
          "Tidak ada data internal, nama orang, atau informasi rahasia instansi.",
          "Masalah dan konteks dijelaskan dengan jelas untuk pembaca luar.",
          "Pendekatan dan alat yang dipakai dijelaskan langkah demi langkah.",
          "Hasil dan dampak dijelaskan, angka sensitif disamarkan.",
          "Ada bagian pelajaran dan hal yang akan dilakukan berbeda.",
        ],
      },
      { id: "m6-wrap", type: "wrap", title: "Refleksi proyek portofolio", minutes: 20, week: 10, section: "uji" },
    ],
  },
  {
    id: "m7",
    phase: 3,
    title: "Portofolio online, CV, dan LinkedIn",
    description:
      "Mengemas tiga proyek menjadi portofolio online, menulis CV data analyst, dan merapikan profil LinkedIn.",
    objectives: [
      "Menulis README proyek yang mudah dipindai perekrut.",
      "Menerbitkan situs portofolio sederhana.",
      "Menulis CV satu halaman yang menonjolkan hasil, bukan hanya tugas.",
      "Merapikan profil LinkedIn dan menampilkan proyek.",
    ],
    weeks: [11, 11],
    items: [
      { id: "m7-intro", type: "intro", title: "Pengantar portofolio dan personal branding", minutes: 10, week: 11, section: "mulai" },
      {
        id: "m7-readme", type: "reading", title: "README proyek yang dibaca perekrut", minutes: 45, week: 11, section: "pelajari",
        note: "Struktur ringkasan, pertanyaan, metode, temuan, dan tautan, dengan contoh README yang baik.",
      },
      {
        id: "m7-situs", type: "reading", title: "Situs portofolio sederhana", minutes: 60, week: 11, section: "pelajari",
        url: "https://pages.github.com/",
        note: "Pilih GitHub Pages atau Vercel. Keduanya gratis untuk situs statis.",
      },
      {
        id: "m7-cv", type: "reading", title: "CV data analyst", minutes: 60, week: 11, section: "pelajari",
        note: "CV satu halaman yang lolos ATS, dengan poin pengalaman berformat aksi, alat, dan hasil.",
      },
      {
        id: "m7-linkedin", type: "reading", title: "Profil LinkedIn", minutes: 45, week: 11, section: "pelajari",
        note: "Headline, bagian About, Featured untuk proyek, dan cara meminta rekomendasi dari pembimbing magang.",
      },
      {
        id: "m7-magang", type: "magang", title: "Minta umpan balik dan rekomendasi dari pembimbing", minutes: 60, week: 11, section: "latihan",
        note: "Tunjukkan studi kasus (tanpa data internal) dan minta izin menyebut proyek itu di CV dan LinkedIn.",
      },
      {
        id: "m7-proyek", type: "project", title: "Publikasikan portofolio online", minutes: 180, week: 11, section: "uji",
        note: "Situs portofolio dengan tiga proyek, CV yang bisa diunduh, dan tautan ke GitHub serta LinkedIn.",
        rubric: [
          "Situs bisa dibuka publik dan tampil baik di HP.",
          "Tiga proyek tampil dengan ringkasan, gambar, dan tautan.",
          "CV satu halaman tersedia dalam PDF.",
          "Profil LinkedIn diperbarui dan menautkan ke portofolio.",
          "Setiap repositori proyek punya README yang rapi.",
        ],
      },
      { id: "m7-wrap", type: "wrap", title: "Refleksi portofolio", minutes: 20, week: 11, section: "uji" },
    ],
  },
  {
    id: "m8",
    phase: 3,
    title: "Siap kerja",
    description:
      "Latihan wawancara, soal SQL gaya tes kerja, tugas take-home, dan mengirim lamaran pertama.",
    objectives: [
      "Menjawab pertanyaan wawancara perilaku dengan metode STAR.",
      "Menyelesaikan soal SQL gaya tes teknis dengan batas waktu.",
      "Mengerjakan dan mempresentasikan tugas take-home.",
      "Mengirim lamaran pertama dan mencatat prosesnya.",
    ],
    weeks: [12, 12],
    items: [
      { id: "m8-intro", type: "intro", title: "Pengantar persiapan kerja", minutes: 10, week: 12, section: "mulai" },
      {
        id: "m8-wawancara", type: "reading", title: "Persiapan wawancara data analyst", minutes: 60, week: 12, section: "pelajari",
        note: "Pertanyaan umum, metode STAR, dan cara menceritakan proyek portofolio dalam dua menit.",
      },
      {
        id: "m8-datalemur", type: "course", title: "DataLemur: soal SQL tingkat medium", minutes: 120, week: 12, section: "latihan",
        url: "https://datalemur.com/questions",
        note: "Kerjakan minimal lima soal tingkat medium dengan batas waktu 20 menit per soal.",
      },
      {
        id: "m8-takehome", type: "lab", title: "Latihan tugas take-home", minutes: 120, week: 12, section: "latihan",
        note: "Kerjakan satu studi kasus dalam dua jam, lalu buat ringkasan tiga slide.",
      },
      { id: "m8-kuis", type: "quiz", title: "Kuis siap kerja", minutes: 15, week: 12, section: "latihan" },
      {
        id: "m8-lamaran", type: "project", title: "Kirim lamaran pertama", minutes: 120, week: 12, section: "uji",
        note: "Pilih lowongan yang sesuai, sesuaikan CV, dan kirim lamaran pertama.",
        rubric: [
          "Daftar minimal lima lowongan yang sesuai sudah dibuat.",
          "CV disesuaikan dengan kata kunci lowongan yang dipilih.",
          "Surat lamaran singkat ditulis untuk lowongan tersebut.",
          "Lamaran terkirim dan dicatat di pelacak lamaran.",
        ],
      },
      { id: "m8-wrap", type: "wrap", title: "Refleksi siap kerja", minutes: 20, week: 12, section: "uji" },
    ],
  },
  {
    id: "ekstra",
    phase: 3,
    title: "Serah terima magang",
    description:
      "Minggu terakhir magang: mendokumentasikan pekerjaan, menyerahkan ke tim, dan menutup kursus.",
    objectives: [
      "Menulis dokumentasi yang bisa dipakai tim tanpa bantuan teknis.",
      "Mempresentasikan hasil magang kepada atasan.",
      "Merefleksikan perjalanan 13 minggu dan menetapkan langkah berikutnya.",
    ],
    weeks: [13, 13],
    items: [
      { id: "ekstra-intro", type: "intro", title: "Pengantar serah terima", minutes: 10, week: 13, section: "mulai" },
      {
        id: "ekstra-dokumentasi", type: "magang", title: "Dokumentasi serah terima", minutes: 180, week: 13, section: "latihan",
        note: "Panduan langkah demi langkah untuk laporan, spreadsheet, atau dashboard yang Anda buat. Tulis untuk orang non-teknis.",
      },
      {
        id: "ekstra-presentasi", type: "magang", title: "Presentasi hasil magang", minutes: 120, week: 13, section: "latihan",
        note: "Presentasi 10 menit: apa yang dikerjakan, dampaknya, dan saran untuk tim ke depan.",
      },
      { id: "ekstra-wrap", type: "wrap", title: "Refleksi akhir kursus", minutes: 30, week: 13, section: "uji" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Fungsi bantu

/** Semua item dalam urutan kursus (urut modul, lalu urutan di dalam modul). */
export const COURSE_ITEMS: Item[] = MODULES.flatMap((m) => m.items);

const ITEM_TO_MODULE = new Map<string, Module>(
  MODULES.flatMap((m) => m.items.map((item) => [item.id, m] as const)),
);

export function getModule(moduleId: string): Module | undefined {
  return MODULES.find((m) => m.id === moduleId);
}

export function getItem(itemId: string): Item | undefined {
  return COURSE_ITEMS.find((item) => item.id === itemId);
}

export function getModuleOfItem(itemId: string): Module | undefined {
  return ITEM_TO_MODULE.get(itemId);
}

/** Semua item, urut minggu (tenggat) lalu urutan kursus. */
export function allItems(): Item[] {
  return [...COURSE_ITEMS].sort((a, b) => a.week - b.week);
}

export function itemsByWeek(week: number): Item[] {
  return COURSE_ITEMS.filter((item) => item.week === week);
}

export function itemsBySection(module: Module, section: Section): Item[] {
  return module.items.filter((item) => item.section === section);
}

/** Item sebelum dan sesudah dalam urutan kursus, untuk navigasi di halaman item. */
export function adjacentItems(itemId: string): { prev?: Item; next?: Item } {
  const index = COURSE_ITEMS.findIndex((item) => item.id === itemId);
  if (index === -1) return {};
  return { prev: COURSE_ITEMS[index - 1], next: COURSE_ITEMS[index + 1] };
}

export function sumMinutes(items: Item[]): number {
  return items.reduce((total, item) => total + item.minutes, 0);
}

export function moduleMinutes(module: Module): number {
  return sumMinutes(module.items);
}

/** Nomor modul untuk label, misalnya "Modul 2". Modul ekstra tidak bernomor. */
export function moduleNumber(module: Module): number | null {
  const match = /^m(\d+)$/.exec(module.id);
  return match ? Number(match[1]) : null;
}
