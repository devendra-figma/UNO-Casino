import type { Fixture } from './data';

export interface MarketOption { id: string; label: string; odds: number }
export interface Market { id: string; title: string; options: MarketOption[] }
export interface MarketGroup { id: string; title: string; markets: Market[] }

const option = (id: string, label: string, odds: number): MarketOption => ({ id, label, odds });
const market = (id: string, title: string, options: MarketOption[]): Market => ({ id, title, options });
const group = (id: string, title: string, markets: Market[]): MarketGroup => ({ id, title, markets });

/** Fictional, static market data derived from the existing demo fixtures. */
export function getMarketGroups(fixture: Fixture): MarketGroup[] {
  if (fixture.marketGroups?.length) return fixture.marketGroups;
  const f = fixture;
  const winner = group('main', 'Main Markets', [market('match-winner', 'Match Winner', [
    option('home', f.home, f.odds[0]),
    ...(f.odds.length === 3 ? [option('draw', 'Draw', f.odds[1])] : []),
    option('away', f.away, f.odds.at(-1)!),
  ])]);
  if (f.sport === 'Football') return [winner,
    group('double-chance', 'Double Chance', [market('double-chance', 'Double Chance', [option('home-draw', `${f.home} or Draw`, 1.34), option('home-away', 'Either team', 1.29), option('draw-away', `Draw or ${f.away}`, 1.62)])]),
    group('totals', 'Over / Under', [market('goals-2-5', 'Total Goals 2.5', [option('over', 'Over 2.5', 1.88), option('under', 'Under 2.5', 1.94)]), market('goals-3-5', 'Total Goals 3.5', [option('over', 'Over 3.5', 2.75), option('under', 'Under 3.5', 1.47)])]),
    group('handicap', 'Handicap', [market('handicap-0-5', 'Match Handicap 0.5', [option('home', `${f.home} −0.5`, 2.18), option('away', `${f.away} +0.5`, 1.72)])]),
    group('btts', 'Both Teams to Score', [market('btts', 'Both Teams to Score', [option('yes', 'Yes', 1.77), option('no', 'No', 2.08)])]),
    group('correct-score', 'Correct Score', [market('correct-score', 'Full Time Score', ['1–0', '1–1', '2–0', '2–1', '0–1', '0–0'].map((label, i) => option(label, label, [7.2, 5.8, 8.1, 7.6, 8.4, 9.5][i])))]),
    group('halves', 'Half Markets', [market('first-half', 'First Half Result', [option('home', f.home, 2.52), option('draw', 'Draw', 2.15), option('away', f.away, 3.2)]), market('second-half', 'Second Half Result', [option('home', f.home, 2.37), option('draw', 'Draw', 2.45), option('away', f.away, 2.96)])]),
    group('specials', 'Specials', [market('first-goal', 'First Goal', [option('home', f.home, 1.86), option('none', 'No goal', 12), option('away', f.away, 2.14)]), market('corners', 'Total Corners 9.5', [option('over', 'Over', 1.9), option('under', 'Under', 1.9)])]),
    group('players', 'Player Markets', [market('home-forward', `${f.home} forward to score`, [option('yes', 'Yes', 2.7), option('no', 'No', 1.48)]), market('away-forward', `${f.away} forward to score`, [option('yes', 'Yes', 3.15), option('no', 'No', 1.38)])]),
  ];
  if (f.sport === 'Basketball') return [winner,
    group('spread', 'Handicap', [market('spread-4-5', 'Point Spread 4.5', [option('home', `${f.home} −4.5`, 1.9), option('away', `${f.away} +4.5`, 1.9)]), market('spread-8-5', 'Point Spread 8.5', [option('home', `${f.home} −8.5`, 2.37), option('away', `${f.away} +8.5`, 1.58)])]),
    group('totals', 'Over / Under', [market('points-159-5', 'Total Points 159.5', [option('over', 'Over', 1.82), option('under', 'Under', 2.01)]), market('points-169-5', 'Total Points 169.5', [option('over', 'Over', 2.24), option('under', 'Under', 1.65)])]),
    group('halves', 'Half Markets', [market('first-half', 'First Half Winner', [option('home', f.home, 1.92), option('away', f.away, 1.92)])]),
    group('specials', 'Specials', [market('race-20', 'First to 20 Points', [option('home', f.home, 1.84), option('away', f.away, 1.98)]), market('home-total', `${f.home} Points 79.5`, [option('over', 'Over', 1.87), option('under', 'Under', 1.95)])]),
  ];
  return [winner,
    group('set-betting', 'Set Betting', [market('set-score', 'Correct Set Score', ['2–0', '2–1', '0–2', '1–2'].map((label, i) => option(label, label, [3.05, 3.8, 3.35, 3.65][i])))]),
    group('totals', 'Over / Under', [market('games-20-5', 'Total Games 20.5', [option('over', 'Over', 1.84), option('under', 'Under', 1.98)]), market('games-22-5', 'Total Games 22.5', [option('over', 'Over', 2.2), option('under', 'Under', 1.66)])]),
    group('halves', 'Set Markets', [market('first-set', 'First Set Winner', [option('home', f.home, 1.79), option('away', f.away, 2.04)])]),
    group('handicap', 'Handicap', [market('game-handicap', 'Game Handicap 2.5', [option('home', `${f.home} −2.5`, 1.92), option('away', `${f.away} +2.5`, 1.89)])]),
    group('specials', 'Specials', [market('tiebreak', 'Tie Break in Match', [option('yes', 'Yes', 2.54), option('no', 'No', 1.52)])]),
  ];
}

export const additionalMarketCount = (fixture: Fixture) => getMarketGroups(fixture).slice(1).reduce((count, group) => count + group.markets.length, 0);
