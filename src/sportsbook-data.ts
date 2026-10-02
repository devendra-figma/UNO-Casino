import { fixtures, type Fixture } from './data.ts';

// Keep presentation-only system examples separate from the approved sports listing.
export const systemFixtures: Fixture[] = [
  { id:'demo-finished', sport:'Football', league:'Demo States', home:'Riverton', away:'Oakfield', homeCode:'RIV', awayCode:'OAK', live:false, time:'Full time', score:'2 : 0', odds:[], status:'finished' },
  { id:'demo-suspended', sport:'Football', league:'Demo States', home:'Coastal City', away:'Hillcrest', homeCode:'COA', awayCode:'HIL', live:false, time:'Temporarily paused', odds:[], status:'suspended' },
  { id:'demo-no-markets', sport:'Football', league:'Demo States', home:'Eastbank', away:'Westport', homeCode:'EAS', awayCode:'WES', live:false, time:'Markets unavailable', odds:[], marketGroups:[] },
];
export const allSportsFixtures = [...fixtures, ...systemFixtures];
export const sports = [...new Set(fixtures.map(f => f.sport))];
export const leaguesFor = (sport: string) => [...new Set(fixtures.filter(f => f.sport === sport).map(f => f.league))];
export const sportPath = (sport: string) => `/sports/sport/${encodeURIComponent(sport)}`;
export const leaguePath = (sport: string, league: string) => `/sports/league/${encodeURIComponent(sport)}/${encodeURIComponent(league)}`;

export type SportsFavorite = `sport:${string}` | `league:${string}:${string}` | `team:${string}` | `event:${string}`;
export function loadSportsFavorites(): SportsFavorite[] {
  try { const value = JSON.parse(localStorage.getItem('uno-sports-favorites') || '[]'); return Array.isArray(value) ? value.filter((item): item is SportsFavorite => typeof item === 'string' && /^(sport|league|team|event):/.test(item)) : []; }
  catch { return []; }
}
