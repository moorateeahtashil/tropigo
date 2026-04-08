-- ============================================================
-- Newsletter Subscriptions
-- ============================================================

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscriptions(status);

-- RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Only admins can view
CREATE POLICY "Admins can view newsletter subscriptions"
  ON newsletter_subscriptions FOR SELECT
  USING (is_admin());

-- Public can insert (subscribe)
CREATE POLICY "Public can subscribe"
  ON newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

-- Only admins can update/unsubscribe
CREATE POLICY "Admins can update newsletter subscriptions"
  ON newsletter_subscriptions FOR UPDATE
  USING (is_admin());

-- Only admins can delete
CREATE POLICY "Admins can delete newsletter subscriptions"
  ON newsletter_subscriptions FOR DELETE
  USING (is_admin());

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_newsletter_updated_at ON newsletter_subscriptions;
CREATE TRIGGER trg_newsletter_updated_at
  BEFORE UPDATE ON newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_updated_at();
