-- =========================================
-- 1. PROFILES jadvali (Google auth orqali avtomatik to'ldiriladi)
-- =========================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  eco_score integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Google orqali ro'yxatdan o'tganda profiles jadvaliga avtomatik yozish
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', 'Eco User'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================
-- 2. SCANS jadvali — AI natijasining 10 maydoni + advice
-- =========================================
create table public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,

  -- AI tomonidan qaytariladigan 10 ta ma'lumot
  item_name text not null,
  category text not null,
  material text not null,
  recyclable boolean not null,
  confidence numeric(5,2) not null,           -- masalan 98.00
  decomposition_time text not null,           -- masalan "450 years"
  disposal_bin text not null,                 -- "Plastic recycling bin"
  not_to_do text[] not null default '{}',     -- ["Don't burn it", ...]
  environmental_impact text not null,
  fun_fact text not null,

  -- Pastki qism
  advice text not null,                       -- 2-3 qatorlik maslahat
  summary text not null,                      -- 3-4 gaplik umumiy xulosa

  created_at timestamptz not null default now()
);

alter table public.scans enable row level security;

create policy "Users can view own scans"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "Users can insert own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

create index scans_user_id_created_at_idx
  on public.scans (user_id, created_at desc);

-- =========================================
-- 3. Har scan uchun eco_score +10 (trigger orqali avtomatik)
-- =========================================
create or replace function public.increment_eco_score()
returns trigger as $$
begin
  update public.profiles
  set eco_score = eco_score + 10,
      level = 1 + floor((eco_score + 10) / 100)
  where id = new.user_id;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_scan_created
  after insert on public.scans
  for each row execute procedure public.increment_eco_score();

-- =========================================
-- 4. Statistika uchun view (kategoriya bo'yicha son)
-- =========================================
create or replace view public.user_stats as
select
  user_id,
  count(*) as total_scans,
  count(*) filter (where category ilike '%plastic%') as plastic_count,
  count(*) filter (where category ilike '%paper%') as paper_count,
  count(*) filter (where category ilike '%glass%') as glass_count,
  count(*) filter (where category ilike '%organic%') as organic_count
from public.scans
group by user_id;

-- =========================================
-- 5. Storage bucket (rasmlar uchun)
-- =========================================
insert into storage.buckets (id, name, public)
values ('scan-images', 'scan-images', true)
on conflict (id) do nothing;

create policy "Users can upload own scan images"
  on storage.objects for insert
  with check (
    bucket_id = 'scan-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view scan images"
  on storage.objects for select
  using (bucket_id = 'scan-images');
