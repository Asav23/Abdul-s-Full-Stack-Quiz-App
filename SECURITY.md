# Dependency vulnerabilities

GitHub Dependabot flagged 62 open alerts on the default branch as of
2026-09-03 (2 critical, 30 high, 25 moderate, 5 low). All 62 were in
`frontend/package-lock.json` (npm). The backend's `pom.xml` (Maven) had
zero alerts.

## What was fixed

1. **`npm audit fix`** (non-breaking, no major version bumps) - resolved
   both critical alerts and a chunk of the high/moderate ones: `shell-quote`
   (critical, DoS/argument injection), `websocket-driver` (critical,
   resource-limit bypass), plus `ws`, `underscore`, `nth-check`-adjacent
   fixes that had non-breaking patches available at the time.
2. **`react-router-dom` 6.30.6 → 7.18.3** - the one vulnerable package that
   is an actual runtime dependency shipped in the built bundle, rather than
   a build-time-only tool. The installed 6.x line was still inside the
   vulnerable range for
   [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42)
   (open redirect via a same-origin redirect path starting `//`); the fix
   only lands in 7.18.1+. This app only uses `BrowserRouter`, `Routes`,
   `Route`, `Outlet`, `NavLink`, `useNavigate`, `useLocation`, and
   `useParams` - all unchanged in v7's declarative mode - so the upgrade
   was a same-behavior version bump, not a rewrite. Verified with a full
   Docker rebuild and a pass over every route.

Net result: local `npm audit` went from 46 findings (2 critical) down to
30 (0 critical), and the two critical GitHub alerts are resolved.

## What's left, and why it's deferred

Every remaining alert traces back to `react-scripts` 5.0.1's own internal
build tooling, not to anything the app ships:

| Package | Pulled in by | Only used for |
|---|---|---|
| `svgo`, `nth-check`, `@svgr/webpack` | `react-scripts` | Converting imported `.svg` files to components at build time |
| `resolve-url-loader`, `postcss` (old copy) | `react-scripts` | Rewriting `url()` paths in CSS during build |
| `webpack-dev-server`, `sockjs`, `uuid`, `@tootallnate/once` | `react-scripts` | The `npm start` local dev server (hot reload) - not used by `npm run build` |
| `jest`, `jsdom` | `react-scripts` | The test runner (`npm test`) |
| `workbox-webpack-plugin`, `serialize-javascript` | `react-scripts` | Service worker generation - unused, this app doesn't register one |
| `qs`, `body-parser` | `webpack-dev-server` | Same dev-server-only path as above |

None of this code reaches production: [frontend/Dockerfile](frontend/Dockerfile)
only copies the static `npm run build` output into the nginx image -
`node_modules` (and therefore every package above) never enters the
container that actually runs. The realistic exposure is limited to a
developer's own machine while running `npm start` or `npm test` locally,
and even then it requires an attacker already on the same network or with
local access.

`npm audit fix --force` would "fix" these by installing `react-scripts@0.0.0`
- not a real version, just what npm's resolver falls back to when it can't
satisfy the constraint any other way. Running it breaks the build entirely,
so it wasn't used.

**Recommended follow-up (not done here):** Create React App has been
unmaintained since 2023, which is why `react-scripts` still pins these old
transitive versions with no further patches coming. Migrating the frontend
build off CRA to Vite would remove this entire dependency chain at the
root instead of chasing it package by package. That's a separate, larger
piece of work than a dependency bump and is left for a future pass.

## Current state

Re-run `npm audit` in `frontend/` any time to check the live count. As of
this pass: 30 findings (0 critical, 14 high, 7 moderate, 9 low), all
confined to the dev-only build toolchain described above.
