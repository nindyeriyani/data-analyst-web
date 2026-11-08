# Data Analyst

Aplikasi web pribadi untuk belajar menjadi data analyst dalam 12 minggu. Panduan lengkap proyek ada di [CLAUDE.md](CLAUDE.md).

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env.local   # isi nilainya, lihat "Menyiapkan Supabase"
npm run dev                  # http://localhost:3000
```

Sebelum commit: `npm run lint` dan `npm run build` harus lolos.

## Menyiapkan Supabase

Dilakukan sekali. Semua langkah ada di dashboard Supabase (paket gratis cukup).

1. **Buat proyek.** supabase.com, New project. Pilih region Singapore (terdekat), simpan database password di pengelola kata sandi.
2. **Jalankan migrasi.** SQL Editor, New query, tempel isi `supabase/migrations/0001_init.sql`, lalu Run.
3. **Ambil kunci.** Project Settings, API Keys: salin Project URL dan publishable key (`sb_publishable_…`). Jangan memakai secret key.
4. **Isi variabel lingkungan** di `.env.local` dan di Vercel (Project Settings, Environment Variables, untuk Production dan Preview):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<id-proyek>.supabase.co   # tanpa /rest/v1 di belakang
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ALLOWED_EMAIL=<email-anda>
   ```

   Setelah mengubah variabel di Vercel, lakukan Redeploy agar nilainya terpakai.
5. **Buat akun pemilik.** Authentication, Users, Add user, Create new user: isi email yang sama dengan `ALLOWED_EMAIL`, kata sandi acak (tidak dipakai), centang Auto Confirm User.
6. **Matikan pendaftaran baru.** Authentication, Sign In / Providers: matikan "Allow new users to sign up".
7. **Atur URL.** Authentication, URL Configuration:
   - Site URL: `https://<domain-vercel>`
   - Redirect URLs: `http://localhost:3000/auth/callback**` dan `https://<domain-vercel>/auth/callback**`

Template email bawaan Supabase tidak perlu diubah (dan memang terkunci tanpa custom SMTP). Tautan di email tetap bisa dibuka di perangkat mana pun, misalnya diminta di MacBook lalu dibuka di HP.

Catatan: tanpa custom SMTP, Supabase hanya mengirim email ke alamat anggota tim organisasi Supabase. Pakai email akun Supabase Anda sebagai `ALLOWED_EMAIL`.

### Masuk dengan Google (opsional, untuk foto profil)

Login Google memakai email yang sama dengan `ALLOWED_EMAIL`, sehingga tersambung otomatis ke akun yang sudah ada (progres tetap sama). Foto dan nama dari akun Google dipakai di header.

1. **Google Cloud Console** (console.cloud.google.com): buat project baru, misalnya `kursus-data-analyst`.
2. **Google Auth Platform, Branding**: isi nama aplikasi dan email dukungan.
3. **Audience**: pilih External. Selama status Testing, tambahkan email Anda sebagai test user.
4. **Clients, Create client**: tipe Web application.
   - Authorized JavaScript origins: `https://<domain-vercel>` dan `http://localhost:3000`
   - Authorized redirect URIs: Callback URL yang tertera di Supabase (langkah 5), biasanya `https://<id-proyek>.supabase.co/auth/v1/callback`
   - Klik Create, lalu salin Client ID dan Client Secret.
5. **Supabase, Authentication, Sign In / Providers, Google**: aktifkan, isi Client ID dan Client Secret, lalu Save. Callback URL untuk langkah 4 tertera di halaman ini.

Redirect URLs di URL Configuration (langkah 7 di atas) sudah mencakup `/auth/callback**`, jadi tidak perlu diubah.

### Jika ada masalah

- **"Gagal memuat progres" atau galat izin (permission denied) di konsol.** Proyek Supabase baru kadang tidak otomatis membuka tabel ke API. Jalankan di SQL Editor:

  ```sql
  grant select, insert, update, delete on public.item_state, public.settings to authenticated;
  ```

- **Tautan masuk membuka halaman login dengan pesan "tidak valid".** Periksa Redirect URLs (langkah 7). Tautan hanya bisa dipakai sekali dan kedaluwarsa setelah beberapa waktu; minta tautan baru.
- **Email tidak datang.** Server email bawaan Supabase dibatasi beberapa email per jam. Tunggu sebentar, periksa folder spam.
