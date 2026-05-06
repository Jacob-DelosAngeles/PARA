---
name: backend
description: Use when working on the PARA Supabase backend — auth flows, DB schema, RLS, RPCs, realtime, or PostGIS. Always diagnose with list_tables/list_migrations/get_advisors/get_logs before any DDL. All DDL goes through apply_migration plus a mirror file in supabase/migrations/.
---

This skill governs all backend work on PARA's Supabase project (`fgaudnxzupfsozhgvgor`). Invoke it before any change that touches schema, auth, RLS, RPCs, realtime publications, edge functions, or storage. Frontend-only work uses [frontend-design](../frontend-design/SKILL.md) instead.

The cardinal rule: **diagnose with read-only MCP tools before proposing any DDL**. Most "broken backend" bugs are diagnosable in 3–4 tool calls — guessing wastes a migration slot and pollutes history.

---

## 1. Diagnose-before-DDL (mandatory order)

For every backend bug or change, run these in parallel before writing any SQL:

1. `mcp__supabase__list_tables` (`schemas: ["public"]`, `verbose: true`) — current schema, RLS state, FKs, advisory flags.
2. `mcp__supabase__list_migrations` — what's been applied remotely (the source of truth — the repo may lag behind).
3. `mcp__supabase__get_advisors` — run for **both** `security` and `performance`. Cite advisor codes (e.g. `0011_function_search_path_mutable`) in the plan.
4. `mcp__supabase__get_logs` for the relevant service:
   - `auth` — signup / sign-in / JWT failures
   - `postgres` — RLS denials, SQL errors, trigger failures
   - `realtime` — subscription / channel issues
   - `api` — PostgREST request errors
   - `edge-function` — deno function logs
   - `storage` — upload / object errors

Only after these four does the agent propose a fix. Quote advisor codes and log error codes in the plan — this prevents guessing.

**Worked example — the bug this skill was born from:**
- Symptom: `POST /signup` returns 500 "Database error saving new user".
- Step 1 — `list_tables`: `public.profiles` exists with FK to `auth.users.id`.
- Step 4 — `get_logs auth`: `relation "profiles" does not exist (SQLSTATE 42P01)` despite step 1.
- Step 3 — `get_advisors security`: `function_search_path_mutable` on `public.handle_new_user`.
- Conclusion: three of the four diagnostic calls were enough — the trigger is `SECURITY DEFINER` without `SET search_path` → unqualified `profiles` reference fails to resolve. No guessing required.

---

## 2. Migrations are the source of truth

**Hard rule: never use `execute_sql` for DDL.** It bypasses Supabase migration history, leaving the repo and remote out of sync forever.

Every schema change follows the same loop:

1. Write SQL into `supabase/migrations/<UTC-timestamp>_<snake_case_name>.sql` in the repo. Timestamp format: `YYYYMMDDHHMMSS`.
2. Apply with `mcp__supabase__apply_migration` using the same `name` (without timestamp) and the same SQL body.
3. `mcp__supabase__list_migrations` to confirm it landed.
4. `mcp__supabase__get_advisors security` to confirm no new lints.

**Repo–remote drift:** the remote currently has migrations the repo does not (`20260503025755`, `20260503025809`, `20260503074113`). When time permits, backfill by `pg_dump --schema-only --schema=public` or `supabase db pull` (CLI required) and commit the bodies. New migrations should be added on top of the remote history's UTC timestamp.

`execute_sql` is fine for read-only diagnostics (`select`), data spot-checks, and one-off data fixes that you've already discussed with the user.

---

## 3. SECURITY DEFINER & trigger conventions

These rules would have prevented the original signup bug. They are non-negotiable:

- **Always set `search_path`.** Every `SECURITY DEFINER` function must include `SET search_path = public, pg_catalog` in its definition. Mutable search_path is advisor `0011_function_search_path_mutable` and is the most common cause of "relation does not exist" inside SECURITY DEFINER functions.
- **Always fully qualify cross-schema references.** Write `public.profiles`, not `profiles`, even with search_path set — defense in depth.
- **Wrap `auth.users` triggers in EXCEPTION handlers.** A trigger that errors will roll back the entire auth signup transaction, and the user sees a generic 500. Pattern:
  ```sql
  begin
    -- … insert / update logic …
    return new;
  exception
    when others then
      raise warning 'trigger_name failed for %: %', new.id, sqlerrm;
      return new;  -- never block auth signup
  end;
  ```
- **Revoke EXECUTE on internal SECURITY DEFINER functions.** Advisors `0028` / `0029` warn when these are RPC-callable from the API. After defining, run:
  ```sql
  revoke execute on function public.fn_name() from anon, authenticated, public;
  ```
  Triggers still work after the revoke — only the REST RPC path is blocked.

---

## 4. RLS conventions for PARA tables

Every public table has `enable row level security`. Default deny + explicit allow.

| Table | INSERT | SELECT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | trigger only (no policy) | authenticated | `auth.uid() = id` | none |
| `vehicles` | `auth.uid() = driver_id` | authenticated | `auth.uid() = driver_id` | `auth.uid() = driver_id` |
| `demand_signals` | `auth.uid() = user_id` | authenticated | none | `auth.uid() = user_id` |
| `reports` | `auth.uid() = reporter_id` | authenticated | none | none |
| `report_validations` | `auth.uid() = user_id` | authenticated | none | none |
| `points_ledger` | none (server only) | `auth.uid() = user_id` | none | none |
| `routes` | none (admin only) | anon + authenticated | none | none |

Check current state with `select * from pg_policies where schemaname = 'public'`.

---

## 5. Realtime publication

Every table the React Native client subscribes to must be in the `supabase_realtime` publication. Confirmed dependencies from current code:

- `vehicles` — [para-app/hooks/useNearbyVehicles.ts:54](../../para-app/hooks/useNearbyVehicles.ts#L54)
- `demand_signals` — [para-app/hooks/useDemandSignals.ts:100](../../para-app/hooks/useDemandSignals.ts#L100), [para-app/hooks/useDriverNotifications.ts:71](../../para-app/hooks/useDriverNotifications.ts#L71)

Verify with:
```sql
select schemaname, tablename from pg_publication_tables where pubname = 'supabase_realtime';
```

To add a new table to realtime:
```sql
alter publication supabase_realtime add table public.<name>;
```

---

## 6. PostGIS conventions

- `geography(Point, 4326)` for distance queries (`ST_DWithin` works in meters automatically).
- `geometry(LineString, 4326)` for route shapes.
- Always `ST_GeogFromText('POINT(<lng> <lat>)')` — **longitude first**.
- GIST index every spatial column: `create index <name>_<col>_gix on <name> using gist (<col>);`.
- The PostGIS extension is currently in the `public` schema (advisor `0014`). Don't try to move it — it'll break existing RPCs.
- Match the style of existing RPCs (`nearby_vehicles`, `route_demand_heatmap`, `route_dropoffs`, `nearest_arrival`).

---

## 7. Verification loop after every backend change

In order, every time:

1. `mcp__supabase__get_advisors security` — no new errors. Quote what you fixed.
2. `mcp__supabase__get_logs <service>` — re-run the user-facing flow on device, expect no new errors.
3. `mcp__supabase__execute_sql` (read-only) — assert expected rows materialised. Example: `select count(*) from public.profiles where id = '<new uid>'` should be 1 after a fresh signup.
4. **Device test on the actual iPhone via Expo Go.** No synthetic curl. Per [CLAUDE.md](../../CLAUDE.md), the user tests on hardware and shares screenshots — wait for that confirmation before declaring done.

---

## 8. Anti-patterns (project-specific)

- ❌ Inserting profile rows from the client (`sign-up.tsx`). The `handle_new_user` trigger owns this.
- ❌ Using `execute_sql` for DDL. Bypasses migration history.
- ❌ Adding tables/columns/RPCs not in [PARA_PRD.md](../../PARA_PRD.md). Per CLAUDE.md hard rules.
- ❌ Fixing advisor warnings outside the current task's scope. Surface them as follow-ups instead — keeps PRs focused.
- ❌ Editing the live remote via the Supabase dashboard instead of a migration. Untracked drift becomes the repo's problem next session.
- ❌ Hardcoding the PostGIS schema in RPC bodies. PostGIS lives in `public`; functions that reference it should set `search_path = public, pg_catalog`.

---

## 9. Cross-references

- MCP wiring on this WSL2 host: see auto-memory `mcp_config_split.md` (Supabase MCP runs Windows-side; loaded via `MEMORY.md`).
- Project PRD: [PARA_PRD.md](../../PARA_PRD.md) — authoritative scope.
- Project rules: [CLAUDE.md](../../CLAUDE.md) — frontend rules + global hard rules.
- Frontend counterpart skill: [frontend-design](../frontend-design/SKILL.md).
