-- Extend bookings for payment provider metadata
alter table public.bookings
  add column if not exists payment_provider text,
  add column if not exists payment_intent_id text,
  add column if not exists payment_meta jsonb,
  add column if not exists paid_at timestamptz;

-- Function to safely mark paid via provider confirmation
create or replace function public.book_mark_paid(p_booking_id uuid, p_provider text, p_payment_id text)
returns jsonb
language plpgsql
security definer
as $$
declare v_book public.bookings%rowtype; begin
  select * into v_book from public.bookings where id = p_booking_id for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if v_book.payment_status = 'paid' then return jsonb_build_object('ok', true, 'status', 'already_paid'); end if;
  update public.bookings
    set payment_status = 'paid', status = 'confirmed', paid_at = now(), payment_provider = p_provider, payment_intent_id = p_payment_id
    where id = p_booking_id;
  return jsonb_build_object('ok', true, 'status', 'paid');
end $$;

create or replace function public.book_mark_failed(p_booking_id uuid, p_provider text, p_payment_id text)
returns jsonb
language plpgsql
security definer
as $$
declare v_book public.bookings%rowtype; begin
  select * into v_book from public.bookings where id = p_booking_id for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if v_book.payment_status = 'paid' then return jsonb_build_object('ok', false, 'error','already_paid'); end if;
  update public.bookings
    set status = 'failed', payment_status = 'unpaid', payment_provider = p_provider, payment_intent_id = p_payment_id
    where id = p_booking_id;
  return jsonb_build_object('ok', true, 'status', 'failed');
end $$;

