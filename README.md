# TRAINR

A local football training planner for outfield coaches, goalkeeper coaches and mixed sessions. Pick your age group and weekly slots, browse a small sourced library, then build a session that fits your time and players. German interface, no account, backend, analytics or player records.

The repository still has its original KEEPERBOARD name. The app is TRAINR. It is private and **not deployed**: the repository link is source code, not a working phone app.

## Stage 2

- Three-step onboarding: coach type, Bambini through adult men, training days and start/end times. Edit the profile later.
- 36 original short drill adaptations, with category, age bands, players per group, equipment quantities, coaching and source links. Field, goalkeeper and mixed games.
- Search plus category, coach-type and age filters. Add your own drills locally.
- Explainable recommendations, not an online AI model: filter by age and coach type, rank by player grouping (+100), focus (+40), remaining time (+20), and avoid repeats (-30). No automatic plan generation. No claim of an optimal or certified programme.
- Drag exercises into the plan and reorder blocks. On phones use the add and up/down buttons. Set block minutes, player count, focus and weekly slot; save multiple sessions.
- Show time remaining or overrun, group-size warnings and material requirements. Sequential blocks reuse equipment; simultaneous groups multiply quantities, and the session uses the maximum required per item.
- Export the session as text or CSV; print/save PDF through the browser. Exports include the player count and material overview. JSON backup/restore covers profile, plans and custom drills.
- Deadline-based pause/reset/next timer and offline app shell.

No Community Hub, accounts, player imports, player names or payments. No SpielerPlus integration.

## Run locally

Install Node.js, download this private repository, extract it, and run in that folder:

```sh
node serve.cjs
```

Open **http://localhost:8765**. Stop with Ctrl+C. No runtime dependencies; Node only serves the app locally. Do not double-click the HTML file if you need offline/PWA behavior.

A phone installation needs an approved private HTTPS origin. Hosting has not been set up. A computer's LAN HTTP address does not provide the same secure-context behavior as localhost on the same device. Once privately hosted with permission, use Chrome install on Android or Safari > Share > Add to Home Screen on iPhone. Browser support varies; there is no App Store build.

## Library standards

See [SOURCES.md](SOURCES.md) and each card's source. These are independently written summaries and variants, not copied articles, images or videos. Sources support the coaching principles; the exact age boundaries, durations, equipment quantities and grouping are editorial choices. The library is a starting collection, not 150 verified drills or an entire coaching curriculum.

A drill needs a clear goal, usable setup, short coaching, source provenance, sensible age suitability and safe progression. The 36 drills include variants from the same source, not 36 unrelated official DFB drills. Extend `drills.js` with stable IDs, `type`, `tag`, `ages`, `min/max` players, `minutes`, `description`, `coaching`, structured `equipment` and HTTPS `url`. Keep IDs stable for saved plans. This schema can grow to about 150 curated entries without changing the planner.

Players are counted **without the coach**. Keeper drills with one or two players need an extra helper per parallel group. Mixed games include the keepers in the total. If group sizes cannot fit all players, amounts are provisional and the plan warns instead of pretending the drill fits. Available helper count and equipment inventory are not checked automatically. For custom exercises, the material field is one named equipment bundle per group, not a parser for item quantities.

Bambini should have broad playful ball experiences, not fixed goalkeeper specialisation. Fall drills are limited to later age bands, safe soft level ground and experienced supervision. Stop for fear, pain or unsafe landings. No heading drills. All ages still need adaptation to actual ability, space, supervision and fatigue.

## Local data and limits

Data stays in localStorage on this browser and origin; clearing data, storage eviction or private browsing can erase it. Back up regularly. No sync or encryption promise. No personal names in free-text fields. Source websites open only when selected.

Stage 2 uses the `trainr-v2` storage key. Stage 1 browser data is left untouched under `keeperboard-v1`; it is not migrated automatically and Stage 1 backups are rejected rather than silently converted with changed player-count meanings.

The service worker caches app assets only. Increase its version after an asset update. A timer may not sound while the screen is locked, browser suspended or app closed. It is not a background alarm; changing the system clock affects its deadline.

## Test

```sh
npm ci
npm test
```

The Playwright smoke suite uses Chrome at `/usr/bin/google-chrome`; set `CHROME_PATH` on another system. Screenshots/PDF go to `/downloads` in the build environment; change paths for your local machine.

Tested on Chrome/Linux: onboarding including invalid day/time input, all 36 drills, profile/category/age/search filters, ranking reasons, group and material counts, duration overrun, actual drag/drop add and reorder, button fallback, timer pause/next, own exercises, multiple plans, persistence, text/CSV/PDF output, validated backup/restore/rejection, offline reload and changes, and 390px mobile/1280px desktop views. No JavaScript page errors. Onboarding, desktop, mobile planner and PDF were visually inspected.

Not tested on a physical phone, Safari installation, Windows, screen-locked sound, or deployed HTTPS. No claim of a live/installable phone link yet.

## Structure

`index.html` owns layout/styles, `app.js` state/planning/ranking/timer, `drills.js` the curated catalog, `sw.js` the offline shell, and `manifest.webmanifest` the installation metadata. `BRAND` in `app.js` controls runtime branding. The document title and manifest provide the static startup/install labels. No build step is required.
