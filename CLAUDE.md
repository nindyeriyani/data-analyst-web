# CLAUDE.md — Data Analyst

File ini adalah panduan proyek untuk Claude Code. Baca seluruhnya sebelum mengerjakan apa pun.

## Ringkasan proyek

Aplikasi web pribadi untuk belajar menjadi data analyst. Rencana awalnya 12 minggu ditambah satu minggu ekstra, tetapi pengguna mengatur sendiri tanggal mulai dan lama kursus (8–26 minggu) di halaman Pengaturan. Semua modul terbuka: materi boleh dipelajari berurutan maupun tidak. Hanya dipakai oleh satu orang, yaitu pemilik repositori ini.

Aplikasi ini adalah pelacak belajar sekaligus wadah materi: dashboard progres, modul dengan materi bacaan, lab, kuis, proyek dengan rubrik, jadwal mingguan, glosarium, dan daftar sumber gratis. Progres disimpan di Supabase agar sama di MacBook dan HP.

### Tentang pelajar (konteks untuk materi dan contoh)

- Latar belakang front-end (HTML, CSS, JavaScript), hanya sebagai konteks dan bukan bahan perumpamaan (lihat aturan materi di bawah). Pernah belajar SQL dasar. Pernah memakai Python, tapi sebagian besar dibantu AI.
- Sedang magang sebagai data analyst di instansi pemerintahan. Di sana tidak ada orang teknis maupun IT.
- Memakai MacBook, sehingga Power BI Desktop tidak dipakai. Alat dashboard: Tableau Public dan Looker Studio.
- Fokus Python (bukan R). Seluruh jalur belajar gratis.
- Target akhir: berkarier sebagai data analyst.

## Stack

- **Next.js** (App Router, TypeScript strict mode), versi stabil terbaru saat setup.
- **Tailwind CSS** untuk styling.
- **Supabase**: Auth (magic link email), Postgres, Row Level Security. Pakai `@supabase/supabase-js` dan `@supabase/ssr`.
- **Markdown** untuk materi: `react-markdown` + `remark-gfm` + `rehype-raw` (konten berasal dari repo sendiri sehingga HTML dianggap tepercaya).
- **Deploy**: GitHub ke Vercel, otomatis setiap push ke `main`.
- Font: Plus Jakarta Sans (teks) dan JetBrains Mono (kode), lewat `next/font/google`.

Jangan menambah dependensi lain tanpa bertanya dulu. Utamakan solusi sederhana.

## Perintah

```bash
npm run dev      # server lokal di http://localhost:3000
npm run lint     # wajib lolos sebelum commit
npm run build    # wajib lolos sebelum commit
```

## Variabel lingkungan

Simpan di `.env.local` (jangan pernah di-commit) dan di pengaturan Environment Variables Vercel.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # kunci publishable/anon dari dashboard Supabase
ALLOWED_EMAIL=                          # satu-satunya email yang boleh masuk
```

Jangan pernah memakai service role key atau secret key di kode aplikasi.

## Struktur folder

```
app/
  layout.tsx              # html, font, tema (tanpa header)
  (kursus)/               # route group: semua halaman yang perlu login
    layout.tsx            # ProgressProvider, header, navigasi bawah
    page.tsx              # Dashboard
    jadwal/page.tsx
    glosarium/page.tsx
    sumber/page.tsx
    pengaturan/page.tsx   # nama panggilan, jadwal belajar (tanggal mulai dan lama kursus), tombol keluar
    modul/[moduleId]/layout.tsx       # sidebar modul
    modul/[moduleId]/page.tsx
    modul/[moduleId]/[itemId]/page.tsx
  login/page.tsx          # form magic link (server action di login/actions.ts)
  auth/callback/page.tsx  # tukar token dari tautan magic link menjadi sesi (di browser)
components/               # komponen UI
content/
  course.ts               # struktur kursus: fase, modul, item (satu sumber kebenaran)
  items/<itemId>.md       # isi materi per item
  quizzes/<itemId>.json   # soal kuis per item
  glossary.ts
  resources.ts
lib/
  schedule.ts             # logika tanggal dan tenggat
  progress-rules.ts       # aturan progres: status, kunci modul, ringkasan dashboard
  supabase/               # client untuk browser dan server
components/ProgressProvider.tsx  # baca/tulis progres ke Supabase (optimistic)
proxy.ts                  # pengganti middleware di Next.js 16: proteksi semua halaman kecuali /login dan /auth/*
supabase/migrations/      # file SQL skema
```

## Model konten

### `content/course.ts`

```ts
export type ItemType =
  | "intro" | "reading" | "course" | "lab" | "quiz"
  | "project" | "magang" | "wrap";

export type Section = "mulai" | "pelajari" | "latihan" | "uji";

export interface Item {
  id: string;          // unik global, format "<moduleId>-<slug>", contoh "m2-join"
  type: ItemType;
  title: string;
  minutes: number;     // estimasi waktu
  week: number;        // minggu dalam rencana 13 minggu (1–13); dipetakan ke minggu kalender sesuai jadwal pengguna
  section: Section;
  url?: string;        // untuk type "course" atau sumber luar
  note?: string;       // keterangan singkat untuk item tanpa file materi
  rubric?: string[];   // untuk type "project"
}

export interface Module {
  id: string;          // "m0" sampai "m8", dan "ekstra"
  phase: 1 | 2 | 3;
  title: string;
  description: string;
  objectives: string[];
  weeks: [number, number];
  items: Item[];
}
```

Isi materi item ada di `content/items/<itemId>.md`. Kalau file tidak ada, halaman item menampilkan `note` dan tombol ke `url`.

### Format Markdown materi

- Markdown biasa plus tabel GFM dan blok kode.
- Jangan memakai perumpamaan atau perbandingan dengan front-end, JavaScript, HTML, atau CSS di materi, kuis, maupun `note`. Jelaskan konsep data secara langsung dengan contoh data.
- Callout memakai sintaks gaya GitHub alert:
  - `> [!tip] Judul` untuk tips (warna biru).
  - `> [!warning] Judul` untuk peringatan (warna merah muda).
- Kunci jawaban yang disembunyikan memakai `<details><summary>Cek jawaban</summary>…</details>`.
- Dataset kecil untuk lab ditulis dalam blok kode ```csv. Tampilkan tombol “Salin data” di atas setiap blok csv.

### `content/quizzes/<itemId>.json`

```json
[
  {
    "question": "Filter hasil agregasi ditulis di…",
    "options": ["WHERE", "HAVING", "ORDER BY", "FROM"],
    "answer": 1,
    "explanation": "HAVING memfilter setelah GROUP BY."
  }
]
```

- Setiap file adalah bank soal berisi 15 soal (`npm run check:content` memberi peringatan jika kurang). Setiap percobaan memakai 5 soal (`QUESTIONS_PER_ATTEMPT` di `lib/progress-rules.ts`).
- `answer` adalah indeks pilihan dalam urutan di file. Urutan tampil diacak, jadi jangan menulis pilihan seperti "Semua jawaban di atas".

### Urutan bebas

Semua modul dan item selalu terbuka. Tidak ada penguncian: pengguna boleh belajar berurutan maupun melompat ke materi mana pun. Kuis tetap memakai nilai lulus 5/5 untuk menandai item kuis selesai, tetapi tidak membuka atau mengunci apa pun.

## Rencana kursus

Rencana dasarnya 13 minggu (kolom "Minggu" di bawah). Tanggal sebenarnya mengikuti jadwal pengguna: tanggal mulai dan lama kursus yang diatur di Pengaturan. Lihat "Logika tanggal".

| Modul | Judul | Minggu (rencana 13 minggu) | Fase |
|---|---|---|---|
| m0 | Orientasi dan persiapan | 1 | 1 |
| m1 | Spreadsheet untuk analisis | 2 | 1 |
| m2 | SQL untuk analisis | 3–4 | 1 |
| m3 | Python dan pandas | 5–6 | 1 |
| m4 | Statistik praktis (modul ringan) | 7 | 2 |
| m5 | Visualisasi dan storytelling | 8 | 2 |
| m6 | Proyek portofolio | 9–10 | 3 |
| m7 | Portofolio online, CV, dan LinkedIn | 11 | 3 |
| m8 | Siap kerja | 12 | 3 |
| ekstra | Serah terima magang | 13 | 3 |

Fase: 1 = Fondasi, 2 = Analisis dan visualisasi, 3 = Portofolio dan karier.

Setiap modul punya urutan bagian: Mulai (pengantar), Pelajari (bacaan dan kursus luar), Latihan (lab, kuis, tugas magang), Uji dan refleksi (proyek, penutup). Item bertipe `magang` adalah tugas mingguan di tempat magang.

Proyek portofolio: (1) analisis e-commerce dataset theLook di BigQuery dengan segmentasi RFM dan retensi kohort, dashboard di Tableau Public; (2) dashboard indikator daerah dari data terbuka BPS atau Satu Data Indonesia; (3) studi kasus proyek magang, tanpa menampilkan data internal.

Sumber belajar utama (semua gratis): Kaggle Learn, SQLBolt, BigQuery sandbox, Google Colab, freeCodeCamp, Khan Academy, Tableau Public, Looker Studio, DataLemur, BPS, Satu Data Indonesia.

## Halaman dan fitur

### Header (semua halaman)
Logo dan judul “Data Analyst” dengan baris kecil “Kursus pribadi · n minggu · ≈x jam/minggu”, navigasi Dashboard, Jadwal, Glosarium, Sumber (menu aktif berlatar pil), penanda sinkronisasi (“Tersimpan”, “Menyimpan…”), lalu foto atau inisial nama pengguna. Di layar kecil, navigasi pindah ke bar bawah.

### Dashboard (`/`)
1. Hero berlatar biru tipis: baris kecil (“Mulai Sen, 9 Nov” atau “Minggu n dari m”), sapaan “Halo, {nama}”, kalimat status (dan tautan “Atur jadwal” selama jadwal masih bawaan), tombol pil “Lanjutkan: {item berikutnya}” (item pertama yang belum selesai, urut tenggat) dan “Lihat jadwal”, serta ilustrasi alur data di kanan (disembunyikan di HP).
2. Empat kartu angka mendatar (ikon di kiri, angka besar, keterangan kecil): progres (x / total item, dengan cincin persen), status (“Sesuai jadwal”, “Tertinggal n item”, atau “Belum mulai”), hitung mundur hari ke akhir jadwal, dan tenggat terdekat.
3. Grafik batang per minggu kalender (sebanyak lama kursus): tinggi batang = total menit item minggu itu, bagian terisi = menit item yang selesai. Minggu berjalan diberi penanda.
4. “Minggu ini” (judul di luar kartu): subjudul tenggat minggu itu, lalu item yang jatuh tempo dengan ikon tipe berwarna, bisa dicentang langsung; item selesai menampilkan chip hijau “✓ tanggal”. Sebelum kursus mulai, tampilkan minggu 1. Kalau minggu ini tanpa tenggat (jadwal yang diregangkan), tampilkan tenggat berikutnya.
5. Badge pencapaian (6) dalam grid 3×2, dengan tanggal diraih atau tanggal target: Modul pertama (m0 selesai), SQL tuntas (proyek m2), Python tuntas (proyek m3), Proyek portofolio pertama (proyek pertama m6), Portofolio online (proyek m7), Lamaran pertama (item lamaran di m8). Badge yang belum diraih tampil abu-abu.
6. “Baru selesai”: 4 item terakhir yang diselesaikan, tanggal dalam huruf mono hijau.
7. “Isi kursus”: kartu semua modul, dikelompokkan per fase (nama fase berwarna dan rentang tanggal). Setiap kartu: pita gradasi warna fase berisi label pil putih “Modul n · minggu a–b” dan grafik batang mini (satu batang per item, terisi jika selesai), judul, jumlah item, estimasi jam, rentang tanggal, bilah progres, dan status (Belum mulai, Berjalan, Selesai, Tertinggal).

### Halaman modul (`/modul/[moduleId]`)
Sidebar putih penuh setinggi layar di kiri (menempel ke tepi, garis kanan): tautan “← Dashboard”, lalu blok per modul yang bisa dibuka-tutup (modul aktif terbuka) berisi “Modul n · judul” dan “Minggu a–b · tanggal · x/y”. Di dalamnya ada “Ringkasan modul” dan item per bagian dengan bulatan status, judul, serta “tipe · durasi · tenggat”; item aktif diberi garis kiri biru dan latar tipis, dan otomatis digulir ke tampilan. Konten utama: kepala modul bergradasi warna fase (baris kecil “Modul n · fase · minggu · tanggal”, judul besar, deskripsi, bilah progres, ringkasan tebal “x dari y selesai · ≈ jam · tenggat”), tombol pil “Mulai modul: {item}” atau “Lanjutkan: {item}”, kotak tujuan belajar berlatar tipis warna fase, baris “Di modul ini: …” (jumlah item per tipe), lalu “Bagian n · nama” beserta durasinya dan kartu daftar item dengan kotak centang, ikon tipe berwarna, judul, tipe dan durasi, serta tenggat. Di layar kecil, sidebar menjadi menu yang bisa dibuka.

### Halaman item (`/modul/[moduleId]/[itemId]`)
Breadcrumb “Modul n: judul › bagian › tipe”, judul besar, baris “tipe · durasi · tenggat · minggu”, isi materi (tabel berbingkai membulat dengan baris judul abu-abu, kode inline berupa chip, callout berupa kartu dengan bulatan ikon), lalu:
- `course`: kartu tautan keluar dengan `note`.
- `quiz`: kartu pembuka dengan tombol "Mulai kuis". Setiap percobaan mengambil 5 soal acak dari bank soal (soal yang belum pernah muncul diutamakan), dengan urutan pilihan diacak. Soal satu per kartu, pilihan berupa tombol selebar kartu, dan hanya bisa dijawab sekali: setelah memilih, kartu terkunci; jawaban salah ditandai merah, jawaban benar ditandai hijau, lalu panel penjelasan “Benar.” atau “Belum tepat. Jawaban yang benar: …” muncul. Nilai lulus 5/5. Jika belum sempurna, tampil nilai dan tombol "Ulangi dengan soal baru". Item otomatis selesai saat kuis lulus.
- `project`: rubrik berupa kotak centang yang tersimpan, kolom “Tautan hasil kerja” yang tersimpan, dan tombol tandai selesai.
- `wrap`: pertanyaan refleksi (dari markdown) dan kolom catatan yang tersimpan otomatis.
- Semua tipe lain: tombol “Tandai selesai” atau “Batalkan selesai”.
Di bawah: navigasi ke item sebelumnya dan berikutnya.

### Jadwal (`/jadwal`)
Daftar minggu kalender 1 sampai lama kursus: nomor minggu, rentang tanggal, modul, total jam, dan item yang jatuh tempo (bisa dicentang). Minggu tanpa tenggat diberi keterangan. Minggu berjalan disorot dan otomatis di-scroll ke tampilan.

### Glosarium (`/glosarium`)
Sekitar 30 istilah dengan definisi singkat dalam Bahasa Indonesia, dengan kolom pencarian yang memfilter langsung.

### Sumber (`/sumber`)
Tautan gratis dikelompokkan: Kursus, Latihan SQL, Python, Statistik, Visualisasi, Sumber data, Karier.

## Supabase

### Skema

Buat sebagai file di `supabase/migrations/`. Pemilik repo menjalankannya sendiri di SQL Editor Supabase.

```sql
create table public.item_state (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  item_id text not null,
  completed_at timestamptz,
  quiz jsonb not null default '{}'::jsonb,     -- { "questions": [3, 7], "optionOrder": { "3": [2, 0, 1, 3] }, "answers": { "3": 1 }, "seen": [3, 7] }
  rubric jsonb not null default '{}'::jsonb,   -- { "0": true, "3": true }
  note text,
  link text,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table public.settings (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  display_name text,
  start_date date,                                   -- jadwal: tanggal mulai (0003); kosong = bawaan
  target_weeks smallint check (target_weeks between 8 and 26),  -- jadwal: lama kursus (0003)
  updated_at timestamptz not null default now()
);

alter table public.item_state enable row level security;
alter table public.settings enable row level security;

create policy "own item_state" on public.item_state
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "own settings" on public.settings
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
```

Migrasi: `0001_init.sql` (skema awal), `0002_rls_select_uid.sql` (policy memakai `(select auth.uid())` untuk performa), `0003_jadwal_pengguna.sql` (kolom `start_date` dan `target_weeks` di `settings`). Setiap perubahan skema berikutnya dibuat sebagai file migrasi baru dengan nomor berurutan.

### Akses satu pengguna

- Login dengan magic link email atau tombol "Masuk dengan Google" di `/login`. Google memakai alur PKCE: `signInWithOAuth` dari browser, lalu `/auth/callback?code=` menukar kode menjadi sesi. Akun Google dengan email yang sama tersambung otomatis ke akun yang sudah ada (automatic identity linking). Foto profil (`avatar_url` atau `picture`) dan nama dari Google dipakai di header; nama panggilan di Pengaturan tetap diutamakan. Penyiapan Google ada di README. Server action hanya mengirim tautan jika email sama dengan `ALLOWED_EMAIL`, dengan `shouldCreateUser: false`; pesan yang tampil sama untuk email apa pun.
- Akun pemilik dibuat sekali di dashboard Supabase (Authentication, Users, Add user, centang Auto Confirm). Pendaftaran baru dimatikan.
- Tautan memakai alur implicit agar bisa dibuka di perangkat lain dengan template email bawaan Supabase (template tidak bisa diubah tanpa custom SMTP). `emailRedirectTo` berbentuk `<origin>/auth/callback?next=<jalur>`; Supabase menambahkan `#access_token=…&refresh_token=…`, lalu halaman `/auth/callback` (Client Component) memanggil `setSession` di browser. Halaman itu juga menerima `?token_hash=` dan `?code=` sebagai cadangan.
- `proxy.ts` (Next.js 16 mengganti nama `middleware.ts` menjadi `proxy.ts`) memperbarui sesi, mengarahkan pengguna yang belum login ke `/login?next=…`, menolak sesi dengan email selain `ALLOWED_EMAIL`, dan mengembalikan 404 untuk URL modul atau item yang tidak ada. Identitas diverifikasi dengan `getClaims()`, bukan `getSession()`.
- Redirect URL di Supabase: `http://localhost:3000/auth/callback**` dan `https://<domain-vercel>/auth/callback**`.

### Pola sinkronisasi

- Saat halaman dimuat, ambil semua baris `item_state` milik pengguna sekali, simpan di context React.
- Perubahan (centang, jawaban kuis, rubrik, catatan, tautan) langsung tampil di UI (optimistic), lalu di-upsert ke Supabase.
- Catatan disimpan dengan debounce sekitar 800 ms.
- Jika penyimpanan gagal, tampilkan pesan kecil yang jelas, misalnya “Gagal menyimpan. Periksa koneksi lalu coba lagi.”, dan kembalikan status UI.

## Logika tanggal (`lib/schedule.ts`)

- Jadwal pengguna = `{ start, totalWeeks }` dari `settings.start_date` dan `settings.target_weeks`. Kalau belum diatur: mulai Senin minggu berjalan, 13 minggu.
- Minggu kalender k dimulai `start + 7(k-1)` hari dan berakhir `start + 7k - 1`.
- Minggu rencana w (1–13, dari `course.ts`) dipetakan ke minggu kalender `max(1, round(w × totalWeeks / 13))`. Tenggat item = hari terakhir minggu kalender itu.
- Tanggal hanya dihitung di browser (Client Component), karena bergantung pada jadwal pengguna dan zona waktu perangkat.
- Bandingkan tanggal saja (tanpa jam), dalam zona waktu lokal perangkat.
- Status “tertinggal” = ada item belum selesai dengan tenggat sebelum hari ini.
- Format tanggal Indonesia, misalnya “Min, 15 Nov” atau “Minggu, 15 November 2026”.

## Desain

- Bersih, mudah dibaca, nyaman untuk sesi belajar panjang. Layout dan pola mengikuti aplikasi kursus Katie (dashboard, kartu modul berwarna per fase, sidebar modul).
- Warna:
  - Latar `#F4F6FA`, permukaan `#FFFFFF`, teks `#161B26`, teks sekunder `#5B6474`, garis `#E0E5EC`.
  - Aksi utama `#0B57D0` (biru), latar tipis `#E8F0FE`.
  - Fase 1 `#0B57D0` (biru), fase 2 `#1E7E34` (hijau), fase 3 `#7B3FC4` (ungu); masing-masing punya ujung gradasi (`--phase-n-to`) dan latar tipis (`--phase-n-soft`).
  - Ikon tipe item berwarna (`--type-*`): pengantar dan bacaan biru, kursus luar merah, lab toska, kuis kuning, proyek hijau, magang oranye, refleksi ungu. Kelasnya di `components/phase-styles.ts`.
  - Selesai `#157A3A`, tertinggal `#B42318`.
- Tombol utama berbentuk pil (`rounded-full`). Lebar konten diatur per halaman, bukan di layout.
- Aplikasi selalu tampil dalam mode terang (tanpa dark mode). Definisikan semua warna sebagai CSS variables yang dipakai lewat Tailwind.
- Responsif sampai layar HP. Fokus keyboard terlihat. Hormati `prefers-reduced-motion`.
- Teks antarmuka memakai huruf kapital di awal kalimat saja (sentence case), tanpa label huruf kapital semua.

## Aturan kerja untuk Claude Code

- Teks antarmuka dan materi dalam Bahasa Indonesia. Nama variabel, fungsi, dan file dalam bahasa Inggris.
- Kerjakan satu tahap per sesi. Jelaskan rencana dulu sebelum menulis kode, lalu tunggu persetujuan.
- Server Component sebagai default; Client Component hanya untuk bagian interaktif.
- Jangan mengubah skema database tanpa bertanya. Setiap perubahan skema dibuat sebagai file migrasi baru.
- Jangan pernah commit `.env.local` atau kunci apa pun.
- Pastikan `npm run lint` dan `npm run build` lolos sebelum menyarankan commit.
- Setelah setiap tahap, ringkas apa yang berubah dan cara mengujinya di browser, dalam Bahasa Indonesia.

## Di luar cakupan

- Tutor AI di dalam aplikasi (butuh API berbayar). Pemilik bertanya ke Claude di luar aplikasi.
- Multi-pengguna, fitur berbagi, analitik, notifikasi.
- Unggah atau menyimpan data dari tempat magang. Data internal instansi tidak boleh masuk ke repo maupun Supabase ini.

## Tahapan pembangunan

Centang setiap tahap yang selesai.

- [x] 1. Inisialisasi Next.js + TypeScript + Tailwind, font, CSS variables dan dark mode, header, deploy pertama ke Vercel.
- [x] 2. Model konten: `course.ts` dengan semua modul dan item, `lib/schedule.ts`, beberapa file materi dan kuis contoh.
- [x] 3. Halaman item: render markdown, callout, tombol salin data csv, kartu tautan keluar.
- [x] 4. Komponen kuis.
- [x] 5. Halaman modul dengan sidebar.
- [x] 6. Dashboard lengkap.
- [x] 7. Jadwal, glosarium, sumber.
- [x] 8. Supabase: migrasi, auth magic link, proxy, sinkronisasi progres, rubrik, catatan, tautan, nama pengguna, penguncian modul.
- [x] 9. Rapikan tampilan di HP, uji alur lengkap, deploy produksi.
- [x] 10. Lengkapi seluruh isi materi dan kuis per modul.
