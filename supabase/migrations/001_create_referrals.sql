create table referrals (
  id uuid primary key default gen_random_uuid(),
  scout_id text not null,
  prospect_name text not null,
  company text not null,
  email text not null,
  phone text,
  service_interest text,
  notes text,
  status text not null default 'submitted',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index referrals_scout_id_idx on referrals(scout_id);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger referrals_updated_at
before update on referrals
for each row execute function update_updated_at();
