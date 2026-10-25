import { createHash } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
let schemaReady;

async function ensureSchema() {
  if (!sql) throw new Error('A DATABASE_URL nincs beállítva a Vercel környezeti változói között.');
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS dudu_bubu_worlds (
        room_code TEXT PRIMARY KEY,
        owner_token TEXT NOT NULL,
        join_token TEXT NOT NULL,
        state JSONB NOT NULL DEFAULT '{}'::jsonb,
        revision BIGINT NOT NULL DEFAULT 1,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS dudu_bubu_worlds_updated_at_idx ON dudu_bubu_worlds (updated_at DESC)`;
      // Upgrade an earlier prototype schema without losing saved worlds.
      await sql`ALTER TABLE dudu_bubu_worlds ADD COLUMN IF NOT EXISTS owner_token TEXT`;
      await sql`ALTER TABLE dudu_bubu_worlds ADD COLUMN IF NOT EXISTS join_token TEXT`;
      await sql`ALTER TABLE dudu_bubu_worlds ADD COLUMN IF NOT EXISTS revision BIGINT NOT NULL DEFAULT 1`;
      await sql`ALTER TABLE dudu_bubu_worlds ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`;
      // Old prototype rows have no credentials; they are not writable/readable until a new room is created.
    })().catch((error) => { schemaReady = undefined; throw error; });
  }
  return schemaReady;
}

const validRoom = (value) => typeof value === 'string' && /^[a-zA-Z0-9_-]{3,128}$/.test(value);
const validToken = (value) => typeof value === 'string' && /^[a-f0-9]{48,128}$/i.test(value);
const tokenHash = (value) => createHash('sha256').update(value).digest('hex');
const json = (res, status, payload) => res.status(status).json(payload);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Room-Token');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return json(res, 405, { error: 'Nem támogatott HTTP-metódus.' });
  }

  try {
    await ensureSchema();
    if (req.method === 'GET') {
      const room = typeof req.query?.room === 'string' ? req.query.room.trim() : '';
      const joinToken = req.headers['x-room-token'];
      if (!validRoom(room)) return json(res, 400, { error: 'Érvényes szobakód szükséges.' });
      if (!validToken(joinToken)) return json(res, 401, { error: 'Hiányzó vagy érvénytelen meghívókód.' });
      const joinTokenHash = tokenHash(joinToken);
      const rows = await sql`SELECT room_code, state, revision, updated_at FROM dudu_bubu_worlds WHERE room_code = ${room} AND join_token = ${joinTokenHash} LIMIT 1`;
      if (rows.length) return json(res, 200, { found: true, world: rows[0] });
      const exists = await sql`SELECT room_code FROM dudu_bubu_worlds WHERE room_code = ${room} LIMIT 1`;
      if (exists.length) return json(res, 403, { error: 'A meghívókód nem megfelelő ehhez a szobához.' });
      return json(res, 200, { found: false, world: null });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const room = typeof body?.roomCode === 'string' ? body.roomCode.trim() : '';
    const ownerToken = body?.ownerToken;
    const joinToken = body?.joinToken;
    const state = body?.state;
    if (!validRoom(room) || !validToken(ownerToken) || !validToken(joinToken) || !state || typeof state !== 'object' || Array.isArray(state)) {
      return json(res, 400, { error: 'Érvényes szobakód, jogosultsági tokenek és világállapot szükséges.' });
    }
    const serialized = JSON.stringify(state);
    if (new TextEncoder().encode(serialized).byteLength > 100_000) return json(res, 413, { error: 'A mentés túl nagy (maximum 100 KB).' });
    const ownerTokenHash = tokenHash(ownerToken);
    const joinTokenHash = tokenHash(joinToken);
    const rows = await sql`INSERT INTO dudu_bubu_worlds (room_code, owner_token, join_token, state, revision, created_at, updated_at)
      VALUES (${room}, ${ownerTokenHash}, ${joinTokenHash}, ${serialized}::jsonb, 1, NOW(), NOW())
      ON CONFLICT (room_code) DO UPDATE SET state = EXCLUDED.state, revision = dudu_bubu_worlds.revision + 1, updated_at = NOW()
      WHERE dudu_bubu_worlds.owner_token = EXCLUDED.owner_token AND dudu_bubu_worlds.join_token = EXCLUDED.join_token
      RETURNING revision, updated_at`;
    if (!rows.length) return json(res, 403, { error: 'A szoba tulajdonosi jogosultsága nem megfelelő.' });
    return json(res, 200, { ok: true, revision: Number(rows[0].revision), savedAt: rows[0].updated_at });
  } catch (error) {
    console.error('Dudu-Bubu Neon API hiba:', error);
    return json(res, 500, { error: 'Az adatbázis jelenleg nem érhető el. Ellenőrizd a DATABASE_URL beállítást.' });
  }
}
