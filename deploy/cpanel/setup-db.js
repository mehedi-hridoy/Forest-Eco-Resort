// One-time database setup for a host without shell access.
// If <importDir>/forest-data.json.gz exists:
//   1. creates the tables from the bundled Prisma migrations (only if they don't exist yet),
//   2. imports the exported rows (only if the database has no users yet),
//   3. writes a report to <importDir>/setup-report.txt and renames the data file to *.done.
// Does nothing when there is no pending data file, so normal restarts are unaffected.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

// Parent rows before children (foreign keys).
const ORDER = ['user', 'session', 'passwordReset', 'lead', 'leadActivity', 'content', 'media', 'mediaFile', 'notification', 'auditLog', 'event'];

function revive(value) {
  if (Array.isArray(value)) return value.map(revive);
  if (value && typeof value === 'object') {
    if (typeof value.$bytes === 'string' && Object.keys(value).length === 1) return Buffer.from(value.$bytes, 'base64');
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = revive(v);
    return out;
  }
  return value;
}

async function createTables(db, migrationsDir, log) {
  const [{ exists }] = await db.$queryRawUnsafe(`select to_regclass('public."User"') is not null as exists`);
  if (exists) return log('Tables already exist — skipped creating them.');
  await db.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) PRIMARY KEY NOT NULL, "checksum" VARCHAR(64) NOT NULL, "finished_at" TIMESTAMPTZ,
    "migration_name" VARCHAR(255) NOT NULL, "logs" TEXT, "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "applied_steps_count" INTEGER NOT NULL DEFAULT 0)`);
  for (const name of fs.readdirSync(migrationsDir).filter((n) => /^\d+_/.test(n)).sort()) {
    const sql = fs.readFileSync(path.join(migrationsDir, name, 'migration.sql'), 'utf8');
    const statements = sql.split('\n').filter((l) => !l.trim().startsWith('--')).join('\n')
      .split(';').map((s) => s.trim()).filter(Boolean);
    await db.$transaction(statements.map((s) => db.$executeRawUnsafe(s)));
    // Record it the way `prisma migrate deploy` does, so future migrations apply cleanly.
    await db.$executeRawUnsafe(
      `INSERT INTO "_prisma_migrations" ("id","checksum","finished_at","migration_name","applied_steps_count") VALUES ($1,$2,now(),$3,1)`,
      crypto.randomUUID(), crypto.createHash('sha256').update(sql).digest('hex'), name);
    log(`Applied migration ${name} (${statements.length} statements).`);
  }
}

module.exports = async function setup(importDir, appDir) {
  const dataFile = path.join(importDir, 'forest-data.json.gz');
  if (!fs.existsSync(dataFile)) return;
  const lines = [];
  const log = (m) => { lines.push(`[${new Date().toISOString()}] ${m}`); console.log('[setup-db]', m); };
  const report = () => fs.writeFileSync(path.join(importDir, 'setup-report.txt'), lines.join('\n') + '\n');
  // Same engine-free client as the app (server/prisma-client.ts): Prisma + the pure-JS "pg" driver.
  const { PrismaClient } = require(path.join(appDir, 'node_modules', '@prisma', 'client'));
  const { PrismaPg } = require(path.join(appDir, 'node_modules', '@prisma', 'adapter-pg'));
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 2 }) });
  try {
    const [{ version }] = await db.$queryRawUnsafe('select version()');
    log(`Connected: ${version}`);
    await createTables(db, path.join(importDir, 'migrations'), log);

    const data = JSON.parse(zlib.gunzipSync(fs.readFileSync(dataFile)).toString('utf8'));
    if ((await db.user.count()) > 0) {
      log('Database already has users — data import skipped (nothing was changed).');
    } else {
      for (const model of ORDER) {
        const rows = revive(data.tables[model] || []);
        if (model === 'mediaFile') for (const r of rows) await db.mediaFile.create({ data: r }); // large rows one at a time
        else for (let i = 0; i < rows.length; i += 500) await db[model].createMany({ data: rows.slice(i, i + 500) });
      }
      log(`Imported data exported at ${data.exportedAt}.`);
    }
    let ok = true;
    for (const model of ORDER) {
      const expected = (data.tables[model] || []).length, actual = await db[model].count();
      if (actual !== expected) ok = false;
      log(`${actual === expected ? 'OK ' : 'MISMATCH'} ${model}: ${actual} in database, ${expected} in export`);
    }
    log(ok ? 'SUCCESS — all tables match the export.' : 'WARNING — some counts differ, see above.');
    if (ok) fs.renameSync(dataFile, dataFile + '.done');
  } catch (err) {
    log(`FAILED: ${err && err.stack || err}`);
  } finally {
    report();
    await db.$disconnect();
  }
};
