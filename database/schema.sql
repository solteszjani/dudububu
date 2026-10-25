-- Dudu és Bubu – Neon PostgreSQL séma
-- Az API is létrehozza/frissíti ezeket a mezőket az első kéréskor.
CREATE TABLE IF NOT EXISTS dudu_bubu_worlds (
  room_code TEXT PRIMARY KEY,
  owner_token TEXT NOT NULL,
  join_token TEXT NOT NULL,
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  revision BIGINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS dudu_bubu_worlds_updated_at_idx ON dudu_bubu_worlds (updated_at DESC);
