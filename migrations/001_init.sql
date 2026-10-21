CREATE TABLE source_state (
  source_id text PRIMARY KEY,
  initialized_at timestamptz,
  etag text,
  last_modified text,
  config_fingerprint text,
  last_success_at timestamptz,
  last_error text,
  last_error_at timestamptz
);

CREATE TABLE source_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id text NOT NULL,
  external_key text NOT NULL,
  url text NOT NULL,
  normalized_url text NOT NULL,
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  is_baseline boolean NOT NULL DEFAULT false,
  UNIQUE (source_id, external_key)
);

CREATE INDEX source_items_normalized_url_idx ON source_items (normalized_url);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_item_id uuid NOT NULL REFERENCES source_items (id),
  destination_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('new')),
  dedupe_key text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'uncertain')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  next_attempt_at timestamptz,
  claimed_until timestamptz,
  claim_token uuid,
  remote_message_id text,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  sent_at timestamptz,
  UNIQUE (destination_id, dedupe_key),
  CHECK ((status = 'sending') = (claim_token IS NOT NULL AND claimed_until IS NOT NULL))
);

CREATE INDEX notifications_pending_idx ON notifications (created_at, id) WHERE status = 'pending';

CREATE TABLE job_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mode text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running'
    CHECK (status IN ('running', 'success', 'partial', 'failed', 'skipped')),
  counts jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_summary text
);

CREATE INDEX job_runs_started_at_idx ON job_runs (started_at DESC);

CREATE TABLE job_locks (
  name text PRIMARY KEY,
  owner uuid NOT NULL,
  expires_at timestamptz NOT NULL
);
