# KEEPERBOARD

A private, offline-first goalkeeper training board. Pick exercises, build a session and use a block timer on the pitch. German interface, no accounts, no player records, no analytics and no backend.

## What works in Stage 1

- Six starter exercise cards based on the corrected E-youth goalkeeper plan: warm-up, ready stance, catching, two safe diving progressions and a passing triangle.
- Search and focus filters; short descriptions, equipment, total participants including the coach, coaching notes and source links.
- Add your own exercises. Do not put player names or personal notes in free-text fields.
- Save multiple sessions, rename them, set block duration (1-120 minutes), reorder and remove blocks.
- Pause/reset a deadline-based timer; advance manually after a block. Changes to blocks reset the current timer.
- Local JSON backup/restore with schema, size, URL and reference checks. Import only replaces existing data after confirmation.
- Print a session, or save it as PDF from the browser's print dialog.
- Installable PWA with locally bundled icons and offline service worker.

No external exercise feeds or imports. The summaries are adaptations, not copied videos/images or a claim to a complete training curriculum. Diving requires suitable ground, safe landing technique and appropriate supervision. Never progress through fear or pain.

## Run on your computer

Install Node.js, download this private repository, extract it and open a terminal in the folder:

```sh
node serve.cjs
```

Open **http://localhost:8765**. Stop with Ctrl+C. The app has no runtime dependencies; Node is only used for the local server. Do not double-click index.html if you want PWA/offline behavior.

## Install on a phone

This repository is **not deployed**. A GitHub repository page is not the running app. A phone needs a private HTTPS origin to install the PWA properly. Localhost is secure only on the device running the server; typing a computer's LAN address on a phone is not equivalent.

Once privately hosted with permission: load the app once, then use Chrome's install option on Android, or Safari > Share > Add to Home Screen on iPhone. Browser support varies. No App Store build or store submission is included. Private hosting is a separate step and has not been set up.

## Storage and timer limits

Data is stored in `localStorage` on this browser and origin. There is no cross-device sync or encryption promise. Clearing browser data, private browsing or storage eviction may erase plans. Download a backup regularly. Offline assets are stored in a versioned service-worker cache; increase the cache version when shipping changed assets. Source links open external websites only when selected.

The timer uses a wall-clock deadline, so ordinary background throttling does not accumulate interval drift. It does not hold a screen wake lock. A locked screen, suspended browser or closed app may suppress the sound. Keep the screen available and check the remaining time when returning. Changing the system clock also changes the timer.

## Test

```sh
npm ci
npm test
```

Tests use Playwright with a local Chrome executable at `/usr/bin/google-chrome` (change the test executable path for another machine). The test server is loopback-only. The tests generate raster icons from `icon.svg`, then exercise filters, coaching dialogs, add/remove/reorder, durations, persistence, timer pause/next, multiple sessions, custom exercises, backup export/import/rejection and offline reload. Screenshots are written to `/downloads` in the build environment; adjust that path locally.

Tested: Chrome on Linux, 390px mobile viewport and 1280px desktop viewport, offline reload after initial load, and no JavaScript page errors. Not tested: a physical Android/iPhone, Safari installation, screen-locked alarms or a deployed HTTPS origin.

## Files

`index.html` contains the interface and CSS. `app.js` owns exercises, state, validation and timer logic. `sw.js` caches only the app shell. `manifest.webmanifest` and icons describe the installable shell. `serve.cjs` is the local development server; `test.cjs` is the browser smoke suite.

## Starter sources

These links support the techniques. Session times, distances and the child-friendly game variants are adaptations.

- [DFB: Gymnastik and ready stance](https://www.dfb-akademie.de/teil-2-gymnastik/-/id-11011649)
- [DFB: Goalkeeper basic techniques](https://www.dfb-akademie.de/teil-4-grundtechniken-der-torhueterinnen/-/id-11011651)
- [Soccerdrills: Erste Hechter](https://www.soccerdrills.de/trainingsuebungen/torwart/uebungen/erste-hechter/767/)
- [torwart.de / Thomas Schlieck: The goalkeeper as the 11th outfield player](https://www.torwart.de/magazin/training/grundtechniken-mit-thomas-schlieck/der-torwart-als-11-feldspieler.html)
