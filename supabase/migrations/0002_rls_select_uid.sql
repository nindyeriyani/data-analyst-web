-- Performa RLS: bungkus auth.uid() dengan (select ...) agar dihitung sekali per query,
-- bukan sekali per baris (saran Supabase Advisor "auth_rls_initplan").
-- Tidak mengubah tabel, data, maupun siapa yang boleh mengakses.
-- Jalankan sekali di Supabase: SQL Editor > New query > tempel isi file ini > Run.

alter policy "own item_state" on public.item_state
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy "own settings" on public.settings
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
