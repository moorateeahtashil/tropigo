-- Booking foundation: rules, pickup options, quoting and reservation

-- Rules per tour or global
create table if not exists public.booking_rules (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid references public.tours(id) on delete cascade,
  min_lead_hours int,
  max_lead_days int,
  min_guests int,
  max_guests int,
  allow_same_day boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger booking_rules_updated before update on public.booking_rules
for each row execute procedure set_updated_at();
alter table public.booking_rules enable row level security;
create policy "admin crud rules" on public.booking_rules for all to authenticated using (is_admin()) with check (is_admin());
create policy "public read rules" on public.booking_rules for select using (true);

-- Pickup options per tour (optional surcharge)
create table if not exists public.tours_pickup_options (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  label text not null,
  surcharge numeric(12,2) default 0,
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tours_pickup_options_tour_pos on public.tours_pickup_options(tour_id, position);
create trigger tours_pickup_options_updated before update on public.tours_pickup_options
for each row execute procedure set_updated_at();
alter table public.tours_pickup_options enable row level security;
create policy "public read pickup" on public.tours_pickup_options for select using (active = true);
create policy "admin crud pickup" on public.tours_pickup_options for all to authenticated using (is_admin()) with check (is_admin());

-- Enforce reserved <= capacity
do $$ begin
  alter table public.availability_slots add constraint reserved_leq_capacity check (reserved <= capacity);
exception when duplicate_object then null; end $$;

-- Human booking reference
create or replace function public.book_generate_ref()
returns text language sql as $$
  select 'TG-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(encode(gen_random_bytes(6), 'hex'),1,6));
$$;

-- Price selection helper
create or replace function public.book_effective_unit_price(t public.tours, s public.availability_slots)
returns numeric language sql stable as $$
  select coalesce(s.price, case when t.sale_active and t.sale_price is not null then t.sale_price else t.price_from end);
$$;

-- Quote a single tour slot
create or replace function public.book_quote(
  p_tour_id uuid,
  p_slot_id uuid,
  p_quantity int,
  p_pickup_id uuid default null,
  p_coupon_code text default null
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_tour public.tours%rowtype;
  v_slot public.availability_slots%rowtype;
  v_pickup public.tours_pickup_options%rowtype;
  v_rule public.booking_rules%rowtype;
  v_unit numeric;
  v_surcharge numeric default 0;
  v_subtotal numeric;
  v_discount numeric default 0;
  v_total numeric;
  v_currency text;
  v_now timestamptz := now();
  v_coupon public.coupons%rowtype;
  v_valid boolean := true;
  v_messages text[] := '{}';
begin
  if p_quantity is null or p_quantity <= 0 then
    v_valid := false; v_messages := array_append(v_messages, 'Invalid quantity');
  end if;

  select * into v_tour from public.tours where id = p_tour_id and is_active = true and published = true;
  if not found then
    v_valid := false; v_messages := array_append(v_messages, 'Tour unavailable');
  end if;

  select * into v_slot from public.availability_slots where id = p_slot_id and tour_id = p_tour_id and is_active = true;
  if not found then
    v_valid := false; v_messages := array_append(v_messages, 'Slot unavailable');
  elsif v_slot.ends_at <= v_now then
    v_valid := false; v_messages := array_append(v_messages, 'Slot in the past');
  elsif v_slot.reserved + coalesce(p_quantity,0) > v_slot.capacity then
    v_valid := false; v_messages := array_append(v_messages, 'Insufficient capacity');
  end if;

  -- Lead time rules: tour-specific overrides global
  select * into v_rule from public.booking_rules where tour_id = p_tour_id limit 1;
  if v_rule.id is null then
    select * into v_rule from public.booking_rules where tour_id is null limit 1;
  end if;
  if v_rule.id is not null then
    if v_rule.min_lead_hours is not null and v_slot.starts_at < v_now + (v_rule.min_lead_hours || ' hours')::interval then
      v_valid := false; v_messages := array_append(v_messages, 'Minimum lead time not met');
    end if;
    if v_rule.max_lead_days is not null and v_slot.starts_at > v_now + (v_rule.max_lead_days || ' days')::interval then
      v_valid := false; v_messages := array_append(v_messages, 'Booking too far in advance');
    end if;
    if v_rule.min_guests is not null and p_quantity < v_rule.min_guests then
      v_valid := false; v_messages := array_append(v_messages, 'Below minimum guests');
    end if;
    if v_rule.max_guests is not null and p_quantity > v_rule.max_guests then
      v_valid := false; v_messages := array_append(v_messages, 'Exceeds max guests');
    end if;
    if v_rule.allow_same_day is false and date(v_slot.starts_at) = date(v_now) then
      v_valid := false; v_messages := array_append(v_messages, 'Same-day bookings not allowed');
    end if;
  end if;

  if p_pickup_id is not null then
    select * into v_pickup from public.tours_pickup_options where id = p_pickup_id and tour_id = p_tour_id and active = true;
    if not found then v_valid := false; v_messages := array_append(v_messages, 'Invalid pickup option'); end if;
  end if;

  v_unit := public.book_effective_unit_price(v_tour, v_slot);
  v_surcharge := coalesce(v_pickup.surcharge, 0);
  v_currency := coalesce(v_slot.currency, v_tour.currency, 'MUR');
  v_subtotal := (coalesce(v_unit,0) + v_surcharge) * coalesce(p_quantity,0);

  if p_coupon_code is not null and length(trim(p_coupon_code)) > 0 then
    select * into v_coupon from public.coupons where code = p_coupon_code and active = true and (starts_at is null or starts_at <= v_now) and (ends_at is null or ends_at >= v_now) limit 1;
    if found then
      if v_coupon.applicable_tour_id is null or v_coupon.applicable_tour_id = p_tour_id then
        if v_coupon.discount_kind = 'percent' then
          v_discount := round(v_subtotal * (v_coupon.discount_value/100.0), 2);
        else
          v_discount := v_coupon.discount_value;
        end if;
        if v_coupon.min_subtotal is not null and v_subtotal < v_coupon.min_subtotal then
          v_discount := 0; v_messages := array_append(v_messages, 'Coupon minimum not met');
        end if;
      else
        v_messages := array_append(v_messages, 'Coupon not applicable');
      end if;
    else
      v_messages := array_append(v_messages, 'Invalid coupon');
    end if;
  end if;

  v_total := greatest(v_subtotal - coalesce(v_discount,0), 0);

  return jsonb_build_object(
    'valid', v_valid,
    'messages', v_messages,
    'unit_price', v_unit,
    'pickup_surcharge', v_surcharge,
    'subtotal', v_subtotal,
    'discount', v_discount,
    'total', v_total,
    'currency', v_currency,
    'slot_starts_at', v_slot.starts_at,
    'slot_ends_at', v_slot.ends_at
  );
end $$;

-- Reserve booking (single-item)
create or replace function public.book_reserve(
  p_tour_id uuid,
  p_slot_id uuid,
  p_quantity int,
  p_pickup_id uuid default null,
  p_coupon_code text default null,
  p_customer_email text,
  p_customer_name text,
  p_customer_phone text default null,
  p_idempotency_key text
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_quote jsonb;
  v_valid boolean;
  v_messages text[];
  v_slot public.availability_slots%rowtype;
  v_tour public.tours%rowtype;
  v_ref text;
  v_booking_id uuid;
  v_currency text;
  v_subtotal numeric;
  v_discount numeric;
  v_total numeric;
begin
  -- Idempotency check
  if exists(select 1 from public.bookings where idempotency_key = p_idempotency_key) then
    return jsonb_build_object('status','exists');
  end if;

  select * into v_slot from public.availability_slots where id = p_slot_id for update;
  select * into v_tour from public.tours where id = p_tour_id;

  v_quote := public.book_quote(p_tour_id, p_slot_id, p_quantity, p_pickup_id, p_coupon_code);
  v_valid := (v_quote->>'valid')::boolean;
  v_messages := array(select jsonb_array_elements_text(coalesce(v_quote->'messages','[]'::jsonb)));
  if not v_valid then
    return jsonb_build_object('status','invalid','messages',v_messages);
  end if;

  -- Capacity check again in-lock
  if v_slot.reserved + p_quantity > v_slot.capacity then
    return jsonb_build_object('status','invalid','messages',array['Insufficient capacity']);
  end if;

  v_ref := public.book_generate_ref();
  v_currency := coalesce(v_quote->>'currency','MUR');
  v_subtotal := (v_quote->>'subtotal')::numeric;
  v_discount := coalesce((v_quote->>'discount')::numeric,0);
  v_total := (v_quote->>'total')::numeric;

  insert into public.bookings(
    user_id, booking_ref, status, payment_status, currency,
    subtotal_amount, discount_amount, total_amount, coupon_code,
    customer_email, customer_name, customer_phone, idempotency_key, source
  ) values (
    auth.uid(), v_ref, 'reserved', 'unpaid', v_currency,
    v_subtotal, v_discount, v_total, p_coupon_code,
    p_customer_email, p_customer_name, p_customer_phone, p_idempotency_key, 'web'
  ) returning id into v_booking_id;

  insert into public.booking_items(
    booking_id, tour_id, title, starts_at, ends_at, guests, quantity, unit_price, subtotal, metadata
  ) values (
    v_booking_id, p_tour_id, v_tour.name, v_quote->>'slot_starts_at', v_quote->>'slot_ends_at', p_quantity, p_quantity, (v_quote->>'unit_price')::numeric, (v_quote->>'subtotal')::numeric, jsonb_build_object('pickup_id', p_pickup_id)
  );

  update public.availability_slots set reserved = reserved + p_quantity where id = p_slot_id;

  return jsonb_build_object('status','reserved','booking_id',v_booking_id,'booking_ref',v_ref,'total',v_total,'currency',v_currency);
end $$;

