# API reference

All paths are prefixed `/api/v1`. JSON responses use objects; list responses use `{items,total,page}` where paginated. Errors use `{error:{message,fields?}}`. Server validation returns 422; access failures 401/403; missing records 404; unique collisions 409. Pagination uses `page` and `limit` (maximum 100).

Mutations require an `Origin` matching `APP_ORIGIN`. Authenticated mutations also require `x-csrf-token`, returned by login or `/auth/me`. Sessions use opaque random tokens in HttpOnly, SameSite=Strict cookies. Only hashed session tokens are stored. Production cookies require HTTPS. No secrets are stored in browser local storage.

| Method | Path | Access / behavior |
|---|---|---|
| GET | /health | Database readiness |
| POST | /auth/login | `{email,password}`; throttled; returns user and CSRF token |
| GET | /auth/me | Current session and CSRF token |
| POST | /auth/logout | Invalidates server session |
| POST | /auth/forgot-password | Generic response; configured email required |
| POST | /auth/reset-password | `{token,password}`; single-use token, 30 minute expiry, revokes sessions |
| POST | /leads | Validated inquiry, privacy consent and UUID submissionKey; idempotent retry |
| GET | /admin/leads | Sales/analyst; sales executive sees only assigned records |
| GET | /admin/leads/:id | Lead and activity history, ownership checks |
| PATCH | /admin/leads/:id | Sales; status, priority, follow-up/contact timestamps, notes; assignment restricted to manager/admin |
| GET | /admin/leads/export | Manager/admin; filtered CSV, formula neutralization, audit trail |
| GET | /admin/analytics | Real lead metrics; same row-access scope |
| GET | /admin/staff | Active sales staff |
| GET | /content/:kind | Published content only; optional `slug`, `page`, `limit` |
| GET | /pages, /settings, /villas, /facilities, /experiences, /masterplan, /gallery, /articles | Public aliases for content groups |
| GET | /admin/content/:kind | Content admin, super admin or analyst |
| POST | /admin/content | Create structured content |
| PUT | /admin/content/:id | Update, reorder, publish, schedule or archive |
| GET | /admin/media | List assets; `q`, `status` filters |
| POST | /admin/media | Multipart `file`, `alt`, `caption`, `assetType`, optional `association`; 12 MB limit |
| PATCH | /admin/media/:id | Alt text, caption, classification, publication status |
| GET | /media/:id | Published files, or content/admin access to drafts |
| GET | /brochures/:id/download | Published, unexpired, public brochure with published PDF; logs download |
| GET/POST | /admin/users | Super admin only; list or provision users |
| PATCH | /admin/users/:id | Super admin; role/active state; revokes existing sessions |
| GET | /admin/audit | Super admin or analyst |
| GET | /admin/notifications | Manager/admin; delivery status, no provider secrets |
| POST | /admin/notifications/:id/retry | Manager/admin; configured provider required |
| POST | /events | Allowlisted event names; explicit consent required; no form contents |

Lead list and export filters: `q`, `status`, `interest`, `source`, `assignedTo`, `from`, `to`, `sort=date|priority`, `page`, `limit`. Dates accept ISO strings. UI date-range ends include the selected day's end.

Content kinds: pages, sections, navigation, settings, villas, experiences, facilities, masterplan, gallery, articles, brochures, faqs. Common fields: `kind`, unique `slug` within kind, `title`, `status`, `sortOrder`, `data`, optional `publishAt`. Statuses: Draft, In Review, Scheduled, Published, Archived. Sensitive ownership claims require a Super Admin's approval when published. Published masterplan content must be unpublished before archiving. Structured content fields are displayed as text, never injected as raw HTML.

Role policy is centralized in `server/app.ts`. Super Admin has all access; Content Administrator manages content/media; Sales Manager manages all leads and assignments/export; Sales Executive works assigned leads only; Analyst / Viewer has read-only content, reporting and lead access, but no export. Narrow analyst access further if the operator's privacy policy requires it.
