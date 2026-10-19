# Forest Eco Resort

A Next.js App Router / TypeScript public website and custom administration workspace, backed by an Express API, Prisma and a persistent database. The original brief is preserved in `docs/PROJECT-BRIEF.md`.

## Start locally

Requires Node.js 22 or newer and pnpm. SQLite is the local development database.

```sh
pnpm install
cp .env.example .env
# If creating the SQLite database for the first time:
touch prisma/dev.db
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open http://127.0.0.1:3000 and http://127.0.0.1:3000/admin. The Express API binds to 127.0.0.1:4000; Next proxies `/api/v1` to it. Use the exact origin configured in `.env`.

For a production-mode local preview:

```sh
pnpm build
pnpm start
```

On this Mac, `Launch Forest.command` locates the bundled runtime and starts the already-built project. `Create Admin.command` securely asks for a local administrator email and password. No default production account is included.

## Administration

Provision the first Super Admin using `pnpm admin:create`, with `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` of at least 14 characters provided in the process environment. Remove those variables afterward. Prefer the interactive launcher over putting secrets in shell history. Additional staff can be provisioned in Admin → Users.

- Overview shows actual database records, never invented statistics.
- Leads supports search, filters, notes, contact/follow-up dates, assignment, statuses and authorized CSV export.
- Content includes pages, structured sections, navigation, settings, villas, experiences, facilities, masterplan, gallery, articles, brochures and FAQs.
- Display order controls sequence. Unpublish using Draft, or archive with confirmation. Scheduled publishing is processed every 30 seconds while the API runs.
- Masterplan fields preserve English/Bengali text, supplied area/cost values and all 64 facilities.
- Media files start private/draft. Publish approved files and reference the displayed URL in content fields. Replace a file by uploading a new asset and updating references.
- Brochures need a published PDF media ID, version and optional expiry. Private brochures are not downloadable publicly.
- Notifications reports unconfigured providers and failures; failed jobs can be retried after configuration.
- Draft pages and articles are not visible publicly. Preview content within the editor before publishing.

The source models repeated editorial content with a shared `Content` entity (kind + typed UI field definitions + JSON data), rather than many nearly identical tables. Leads, sessions, users, activities, media, notifications and audit records use dedicated relational models. Foreign keys, indexes and uniqueness are defined in Prisma migrations.

## Production deployment

This project deliberately preserves the requested Next.js + Express + PostgreSQL architecture. It is not a Cloudflare Worker/Sites deployment: that host does not run this separate Express service and native Prisma setup. Deploy on a Node-capable host with persistent storage or containers. No public deployment has been performed.

1. Provision PostgreSQL and a least-privileged application database user.
2. Configure `DATABASE_URL` to the PostgreSQL connection string, `APP_ORIGIN` and `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin, and `NODE_ENV=production` at runtime.
3. Use the PostgreSQL schema and migration, **not** the SQLite migration:

   ```sh
   pnpm exec prisma generate --schema prisma/postgresql/schema.prisma
   pnpm exec prisma migrate deploy --schema prisma/postgresql/schema.prisma
   pnpm exec tsx prisma/seed.ts
   pnpm exec next build
   pnpm exec tsc -p tsconfig.server.json
   pnpm start
   ```

   The convenience `pnpm build` targets the local SQLite schema. Use the commands above for PostgreSQL.
4. Run Next and Express under a process supervisor. Keep Express private on loopback. A reverse proxy terminates TLS and forwards only to Next. Set request size limits and trusted proxy behavior for your infrastructure.
5. Persist `MEDIA_DIRECTORY` outside the release directory, with restrictive permissions and encrypted backups. The included storage adapter uses local disk; object-storage integration would be an additional deployment-specific adapter.
6. Provision an administrator. Review brand assets, permissions and content before opening public access. Run smoke tests and provider tests against staging.

PostgreSQL migration SQL is included, but a live PostgreSQL server is not provided in this local environment. Production deployment, restore drills and provider delivery must be verified on the chosen infrastructure.

## Services and credentials

- Database: local SQLite or production PostgreSQL.
- Email: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM and SALES_NOTIFICATION_EMAIL. Jobs persist before delivery. Failures retry with backoff up to five attempts. The team notification links to the secure dashboard and excludes inquiry contents.
- Password reset uses the same SMTP provider and single-use tokens. If email is not configured the UI explains that recovery is unavailable.
- WhatsApp: no authorized provider was supplied. Contact preference is recorded, but automated WhatsApp delivery is explicitly unavailable. Add an approved provider only after its contract and credentials are supplied.
- Media: persistent local disk. Do not put secrets in CMS settings or tracked files.
- Analytics: no third-party tracker is enabled. An allowlisted consent-gated event API is included; operational brochure-download events are counted without visitor identities. Browser preferences can be changed in the footer.
- Fonts: Nourd files/licensing were not retrievable. Typography is configurable through global settings; install licensed WOFF2 assets and an `@font-face` rule before switching the setting.

## Validation

```sh
pnpm typecheck
pnpm test
pnpm build
```

API tests provision temporary users/content/leads, then clean them up. Use an isolated test database for CI. Tests cover consent validation, persistence, duplicate retry, CSRF/origin, row permissions, assignment restrictions, metrics, CSV access, draft publishing, sensitive-content gate, upload signatures, private media and logout. Browser verification details are in `docs/QA.md`.

## Backups, retention and maintenance

- SQLite: use `sqlite3 prisma/dev.db '.backup /secure/backups/forest.db'` for a consistent snapshot. Back up the media volume with it. Do not simply copy an active WAL database.
- PostgreSQL: use `pg_dump --format=custom` from a managed secret environment; encrypt the result. Restore into a separate database using `pg_restore`, then verify migrations, counts and media references before switching traffic.
- Restore media with matching storage keys. Test a full restore regularly and document recovery objectives with the operator.
- Set a legally approved retention schedule before public launch. Process verified data access/deletion requests administratively; make a backup, delete the requested lead and its related notification records in a transaction, and retain only a minimal non-personal audit event. This is a documented operator process, not an automated retention scheduler.
- Rotate provider credentials, patch dependencies, inspect failed notification jobs and review staff access regularly. Sessions expire after eight hours and are revoked on account access changes.

## Launch dependencies

See `docs/ASSET-INVENTORY.md` for the exact missing folders and approval list. The preview uses labelled illustrative images, a temporary wordmark and fallback typography. No official ownership terms, benefits, returns, prices, room counts, opening dates, approvals or operational statuses have been invented. Legal/privacy pages are review drafts. Official gallery, downloadable documents and public journal use honest empty states until approved material is supplied.
