// Sumber belajar gratis, dikelompokkan per kebutuhan.

export interface Resource {
  title: string;
  url: string;
  description: string;
}

export interface ResourceGroup {
  id: string;
  title: string;
  resources: Resource[];
}

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    id: "kursus",
    title: "Kursus",
    resources: [
      {
        title: "Kaggle Learn",
        url: "https://www.kaggle.com/learn",
        description: "Kursus singkat dan praktis: Python, pandas, SQL, visualisasi, dan pembersihan data.",
      },
      {
        title: "freeCodeCamp: Data Analysis with Python",
        url: "https://www.freecodecamp.org/learn/data-analysis-with-python/",
        description: "Kurikulum analisis data dengan Python, NumPy, dan pandas, lengkap dengan proyek dan sertifikat.",
      },
    ],
  },
  {
    id: "sql",
    title: "Latihan SQL",
    resources: [
      {
        title: "SQLBolt",
        url: "https://sqlbolt.com/",
        description: "Pelajaran interaktif SQL langsung di browser, dari SELECT sampai JOIN.",
      },
      {
        title: "SQLZoo",
        url: "https://sqlzoo.net/",
        description: "Kumpulan latihan SQL bertahap dengan data nyata dan pemeriksaan jawaban otomatis.",
      },
      {
        title: "DataLemur: SQL tutorial",
        url: "https://datalemur.com/sql-tutorial",
        description: "Tutorial SQL untuk analisis, dari dasar sampai window function.",
      },
      {
        title: "BigQuery sandbox",
        url: "https://cloud.google.com/bigquery/docs/sandbox",
        description: "Menjalankan SQL di BigQuery secara gratis tanpa kartu kredit, dengan batas penyimpanan dan query bulanan.",
      },
      {
        title: "Dataset theLook e-commerce",
        url: "https://console.cloud.google.com/marketplace/product/bigquery-public-data/thelook-ecommerce",
        description: "Dataset publik toko daring fiktif di BigQuery: pesanan, produk, pengguna, dan kunjungan.",
      },
    ],
  },
  {
    id: "python",
    title: "Python",
    resources: [
      {
        title: "Google Colab",
        url: "https://colab.research.google.com/",
        description: "Notebook Python gratis di browser. Cukup masuk dengan akun Google.",
      },
      {
        title: "10 minutes to pandas",
        url: "https://pandas.pydata.org/docs/user_guide/10min.html",
        description: "Pengantar singkat resmi pandas: membuat, memilih, memfilter, dan meringkas DataFrame.",
      },
      {
        title: "Kaggle Learn: Pandas",
        url: "https://www.kaggle.com/learn/pandas",
        description: "Latihan pandas langkah demi langkah dengan dataset nyata.",
      },
    ],
  },
  {
    id: "statistik",
    title: "Statistik",
    resources: [
      {
        title: "Khan Academy: Statistics and probability",
        url: "https://www.khanacademy.org/math/statistics-probability",
        description: "Ukuran pusat dan sebaran, distribusi, peluang, dan inferensi dasar.",
      },
      {
        title: "Seeing Theory",
        url: "https://seeing-theory.brown.edu/",
        description: "Konsep peluang dan statistik dijelaskan lewat visualisasi interaktif.",
      },
      {
        title: "OpenIntro Statistics",
        url: "https://www.openintro.org/book/os/",
        description: "Buku teks statistik pengantar yang bisa diunduh gratis dalam bentuk PDF.",
      },
    ],
  },
  {
    id: "visualisasi",
    title: "Visualisasi",
    resources: [
      {
        title: "Tableau Public",
        url: "https://public.tableau.com/",
        description: "Membuat dan memublikasikan dashboard secara gratis. Semua yang disimpan bisa dilihat publik.",
      },
      {
        title: "Looker Studio",
        url: "https://lookerstudio.google.com/",
        description: "Dashboard gratis dari Google yang terhubung langsung ke Google Sheets dan BigQuery.",
      },
      {
        title: "From Data to Viz",
        url: "https://www.data-to-viz.com/",
        description: "Panduan memilih jenis grafik berdasarkan bentuk data yang dimiliki.",
      },
    ],
  },
  {
    id: "data",
    title: "Sumber data",
    resources: [
      {
        title: "Badan Pusat Statistik",
        url: "https://www.bps.go.id/",
        description: "Data resmi kependudukan, ekonomi, dan sosial Indonesia sampai tingkat kabupaten dan kota.",
      },
      {
        title: "Satu Data Indonesia",
        url: "https://data.go.id/",
        description: "Portal data terbuka pemerintah Indonesia dari berbagai kementerian dan daerah.",
      },
      {
        title: "BigQuery public datasets",
        url: "https://cloud.google.com/bigquery/public-data",
        description: "Ratusan dataset publik yang bisa langsung di-query dari BigQuery sandbox.",
      },
      {
        title: "Kaggle Datasets",
        url: "https://www.kaggle.com/datasets",
        description: "Ribuan dataset dari berbagai topik, lengkap dengan contoh notebook dari pengguna lain.",
      },
    ],
  },
  {
    id: "karier",
    title: "Karier",
    resources: [
      {
        title: "DataLemur: soal wawancara",
        url: "https://datalemur.com/questions",
        description: "Soal SQL dan statistik dari wawancara kerja data analyst, sebagian besar gratis.",
      },
      {
        title: "GitHub Pages",
        url: "https://pages.github.com/",
        description: "Hosting gratis untuk situs portofolio langsung dari repositori GitHub.",
      },
      {
        title: "LinkedIn",
        url: "https://www.linkedin.com/",
        description: "Profil profesional, jaringan, dan lowongan kerja. Tampilkan proyek portofolio di bagian Featured.",
      },
      {
        title: "Glints",
        url: "https://glints.com/id",
        description: "Portal lowongan kerja di Indonesia, termasuk posisi data analyst tingkat pemula.",
      },
      {
        title: "Kalibrr",
        url: "https://www.kalibrr.id/",
        description: "Portal lowongan kerja di Indonesia dengan filter berdasarkan pengalaman dan lokasi.",
      },
      {
        title: "JobStreet",
        url: "https://id.jobstreet.com/",
        description: "Portal lowongan kerja besar di Indonesia. Cari dengan kata kunci \"data analyst\".",
      },
    ],
  },
];
