import { Link, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ArrowLeft, ChevronDown, ShieldCheck, Ticket, Trophy } from 'lucide-react';
import { type Fixture, type Selection } from './data';
import { allSportsFixtures } from './sportsbook-data';
import { additionalMarketCount, getMarketGroups, type Market, type MarketOption } from './markets';
import './all-markets.css';

export function AllMarkets({ selections, choose, slip }: {
  selections: Selection[];
  choose: (fixture: Fixture, market: Market, option: MarketOption) => void;
  slip: ReactNode;
}) {
  const { eventId } = useParams();
  const fixture = allSportsFixtures.find(f => f.id === eventId);
  if (!fixture) return <div className="markets-not-found"><Trophy size={36}/><h1>Event unavailable.</h1><p>This demo event could not be found.</p><Link className="gold-button" to="/sports">Back to sports</Link></div>;
  const groups = fixture.status || fixture.id === 'demo-no-markets' ? [] : getMarketGroups(fixture);
  const kickoff = fixture.kickoffAt ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(fixture.kickoffAt)) + ' UTC' : fixture.time;
  return <div className="all-markets-page">
    <Link className="markets-back" to="/sports"><ArrowLeft size={17}/> All sports</Link>
    <header className="market-event-header">
      <div className="market-event-kicker"><span><Trophy size={16}/>{fixture.sport} · {fixture.league}</span><span className={fixture.live ? 'live-text live-pill-badge' : 'muted upcoming-pill-badge'}>{fixture.status ? fixture.status.toUpperCase() : fixture.live ? 'LIVE' : 'UPCOMING'}</span></div>
      <h1><span className="market-event-team">{fixture.home}</span><span className="market-event-versus">vs</span><span className="market-event-team">{fixture.away}</span></h1>
      <div className={fixture.score ? 'market-event-meta' : 'market-event-meta market-event-meta-no-score'}><span><strong>Kickoff</strong><time dateTime={fixture.kickoffAt}>{kickoff}</time></span><span><strong>Match time</strong>{fixture.time}</span>{fixture.score && <span className="market-event-score"><strong>Score</strong>{fixture.score}</span>}</div>
    </header>
    <div className="market-page-layout"><div className="market-groups"><div className="market-groups-heading"><div><span className="eyebrow">FICTIONAL MARKETS · DEMO ODDS</span><h2>All markets</h2></div><span>{groups.length ? additionalMarketCount(fixture) : 0} additional markets</span></div>
      {!groups.length && <div className="markets-unavailable" role="status"><h3>{fixture.status === 'finished' ? 'Event finished' : fixture.status === 'suspended' ? 'Event suspended' : 'No markets available'}</h3><p>{fixture.status === 'finished' ? 'This demo event has ended. Betting markets are closed.' : fixture.status === 'suspended' ? 'Markets are temporarily suspended. Please check again later.' : 'No betting markets are available for this demo event.'}</p></div>}
      {groups.map((group, index) => <details key={group.id} className="market-group" open={index < 2}>
        <summary><span>{group.title}<small>{group.markets.length} {group.markets.length === 1 ? 'market' : 'markets'}</small></span><ChevronDown size={18}/></summary>
        <div className="market-group-content">{group.markets.map(market => <section className="market-market" key={market.id} aria-label={market.title}>
          <h3>{market.title}</h3><div className={`market-options${market.options.length === 2 ? ' market-options-two' : ''}`}>{market.options.map(option => {
            const selected = selections.some(s => s.fixtureId === fixture.id && (s.marketId || 'match-winner') === market.id && s.outcome === option.label);
            return <button key={option.id} className={selected ? 'selected' : ''} aria-pressed={selected} aria-label={`${market.title}: ${option.label} at ${option.odds.toFixed(2)}`} onClick={() => choose(fixture, market, option)}><span>{option.label}</span><strong>{option.odds.toFixed(2)}</strong></button>;
          })}</div>
        </section>)}</div>
      </details>)}
      <p className="markets-disclaimer"><ShieldCheck size={16}/> All fixtures, scores and odds are fictional. Selections use virtual funds only.</p>
    </div><aside className="desktop-slip">{slip}</aside></div>
    {selections.length > 0 && <span className="sr-only" role="status"><Ticket size={1}/> {selections.length} {selections.length === 1 ? 'selection' : 'selections'} in bet slip</span>}
  </div>;
}
