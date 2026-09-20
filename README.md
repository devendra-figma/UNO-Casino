# UNO prototype

React, TypeScript and Vite casino/sportsbook design concept. All fixtures, games, balances and promotions are fictional. No real financial services, authentication or game-provider integration. Login and deposits are simulated for client review.

## Development

`npm install`, then `npm run dev`. `npm run build` checks TypeScript and produces `dist`. `npm test` checks betting rules.

Routes: `/`, `/casino`, `/sports`, `/bets`, `/promotions`, `/crash`. Vite and Sites static hosting serve the SPA entry for direct routes.

Demo state uses localStorage key `uno-demo-v1`; reset via Account. Singles stake is per selection. Accumulators use one total stake. Bets remain pending; no settlement is simulated.

## UNO visual refresh

`src/HomeExperience.tsx` contains the layered hero, illustrated category entrances and four illustrated category entrances. The original compact sportsbook cards are restored on the homepage. `src/experience.css` applies their responsive styling and shared touch improvements after the original stylesheet. Motion has an explicit pause control and respects reduced-motion settings. Live tables are included in search, category filters and favorites. Images have optimized WebP versions; original supplied assets remain intact.

Run `node tests/experience-check.mjs` against the local preview for 40 route/viewport checks from 320 to 1920 pixels and the main demo interactions. Uses the installed Edge browser. The earlier `browser-check.mjs` targets the original AUREL catalog; use the current experience check for UNO.

New original graphics were generated with built-in imagegen and optimized for web delivery: `public/uno-hero.webp` and `uno-hero-mobile.webp` (black/gold football, playing cards, floating chips and a luminous gold orbit, left negative space); `public/uno-categories.webp` (gold roulette, emerald football and violet live-table triptych); `public/uno-stadium.webp` (empty night football stadium with emerald turf, side floodlights and a dark central score area). No embedded labels or brand marks. Mobile navigation and match selection stay available without hover. Category artwork uses separate transparent cutouts.

The revised category entrances use `src/category-tiles.css` and separate transparent WebP assets: `uno-tile-casino.webp`, `uno-tile-sports.webp`, and `uno-tile-live.webp`. Built-in imagegen prompts requested cohesive bright 3D cutouts on transparent backgrounds: tilted gold roulette/chips; black-white football with emerald accents and gold trophy; fanned black/gold playing cards with violet chips/ribbon. Standard playing-card ranks appear in the artwork. Natural image proportions use `object-fit: contain`; mobile displays the four category choices in a spacious two-column grid. The earlier triptych is retained only for supporting promotional artwork.

Original artwork generated with built-in imagegen. `public/hero.png`: charcoal/gold lion, football, roulette and chips with left negative space. `public/games.png`: 3×2 atlas of temple, astronaut, falcon, dragon, gems and roulette. Fonts: Google Fonts DM Sans and Manrope, with sans-serif fallback. Icons: Lucide. Working brand AUREL has not been commercially cleared.

## Wallet, promotions and Crash Games

The desktop sidebar collapses into an icon rail; its preference is saved under `uno-sidebar-collapsed`. Mobile uses a keyboard-accessible drawer. The simulated account session uses `uno-demo-login`; Log in → Enter demo account reveals the wallet balance, a single Deposit button and account avatar. Deposit adds virtual USD only ($1–$10,000, up to two decimal places); there is no address, payment, blockchain connection or currency conversion. Reset clears demo bets/favorites and restores $1,000. Logout preserves the browser's demo data.

Promotions contains six fictional concepts with category filters and expandable details. Crash Games has a dedicated route, homepage collection, search, favorites and simulated previews. New artwork: `public/uno-tile-crash.webp`. Built-in imagegen prompt: premium sleek sculptural rocket pointing upper-right, brushed gold and coral-red enamel, dark glass cockpit, warm gold exhaust and orbit ring; centered square composition with full object in frame, true transparent background, no labels or logos. Preserved alpha and optimized to 640px WebP.

Run `node tests/platform-check.mjs` for new routes at 360/390/768/1440px, sidebar persistence, login/logout, demo deposits, promotions and Crash flows. `tests/wallet.test.ts` validates money precision and invalid deposits. On Windows environments where tsx cannot read the user profile, `node --experimental-strip-types --test tests/betting.test.ts tests/wallet.test.ts` runs the same tests directly with Node 24.

## Navigation and homepage polish

`src/Sidebar.tsx` groups Play and account destinations, matches active routes including query filters, and supplies keyboard/hover labels for the collapsed rail. The mobile drawer follows the actual header position and traps keyboard focus. `src/polish.css` contains the sidebar, match-card, curated game-row and compact promotion treatments. Homepage offers open the corresponding category and expanded offer details. The full game catalog is unchanged. Reduced-motion and pause settings are respected. `tests/polish-check.mjs` covers the new navigation, offer routing and layout behavior.
