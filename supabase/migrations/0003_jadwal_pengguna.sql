-- Jadwal belajar milik pengguna: tanggal mulai dan lama kursus (minggu).
-- Kolom boleh kosong; kosong berarti aplikasi memakai jadwal bawaan
-- (mulai Senin minggu berjalan, 13 minggu). Tidak mengubah data yang ada.
-- Jalankan sekali di Supabase: SQL Editor > New query > tempel isi file ini > Run.

alter table public.settings
  add column if not exists start_date date,
  add column if not exists target_weeks smallint
    check (target_weeks between 8 and 26);
