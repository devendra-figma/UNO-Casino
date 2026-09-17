# AUREL prototype

React, TypeScript and Vite casino/sportsbook design concept. All fixtures, games, balances and promotions are fictional. No financial services, authentication or game-provider integration.

## Development

`npm install`, then `npm run dev`. `npm run build` checks TypeScript and produces `dist`. `npm test` checks betting rules.

Routes: `/`, `/casino`, `/sports`, `/bets`. Vite and Sites static hosting serve the SPA entry for direct routes.

Demo state uses localStorage key `aurel-demo-v1`; reset via Account. Singles stake is per selection. Accumulators use one total stake. Bets remain pending; no settlement is simulated.

Original artwork generated with built-in imagegen. `public/hero.png`: charcoal/gold lion, football, roulette and chips with left negative space. `public/games.png`: 3×2 atlas of temple, astronaut, falcon, dragon, gems and roulette. Fonts: Google Fonts DM Sans and Manrope, with sans-serif fallback. Icons: Lucide. Working brand AUREL has not been commercially cleared.
