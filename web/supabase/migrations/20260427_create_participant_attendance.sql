create table if not exists public.participant_attendance (
  participant_id uuid primary key references public.participants(id) on delete cascade,
  status text not null default 'absent' check (status in ('present', 'absent')),
  first_badge_downloaded_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists participant_attendance_status_idx
  on public.participant_attendance (status);

create or replace function public.set_participant_attendance_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists participant_attendance_set_updated_at
  on public.participant_attendance;

create trigger participant_attendance_set_updated_at
before update on public.participant_attendance
for each row
execute function public.set_participant_attendance_updated_at();

alter table public.participant_attendance enable row level security;

drop policy if exists "Authenticated users can read participant attendance"
  on public.participant_attendance;
create policy "Authenticated users can read participant attendance"
on public.participant_attendance
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert participant attendance"
  on public.participant_attendance;
create policy "Authenticated users can insert participant attendance"
on public.participant_attendance
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update participant attendance"
  on public.participant_attendance;
create policy "Authenticated users can update participant attendance"
on public.participant_attendance
for update
to authenticated
using (true)
with check (true);