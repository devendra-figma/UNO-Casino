import { useMemo, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Heart, Search, Trophy } from 'lucide-react';
import { fixtures, type Fixture, type Selection } from './data';
import { MatchCard } from './MatchCard';
import { leaguePath, leaguesFor, sportPath, sports, type SportsFavorite } from './sportsbook-data';
import './sportsbook-pages.css';

type Props = { selections:Selection[]; choose:(fixture:Fixture,index:number)=>void; slip:ReactNode; favorites:SportsFavorite[]; toggleFavorite:(key:SportsFavorite)=>void };
const eventKey = (id:string):SportsFavorite => `event:${id}`;
const sportKey = (sport:string):SportsFavorite => `sport:${sport}`;
const leagueKey = (sport:string,league:string):SportsFavorite => `league:${sport}:${league}`;
const teamKey = (team:string):SportsFavorite => `team:${team}`;

function Favorite({item,label,favorites,toggle}:{item:SportsFavorite;label:string;favorites:SportsFavorite[];toggle:(key:SportsFavorite)=>void}) {
  const active=favorites.includes(item);
  return <button className="sports-favorite icon-button" type="button" aria-label={`${active?'Remove':'Add'} ${label} ${active?'from':'to'} sports favorites`} aria-pressed={active} onClick={()=>toggle(item)}><Heart size={18} fill={active?'currentColor':'none'}/></button>;
}
function EventList({items,props}:{items:Fixture[];props:Props}) {
  return items.length ? <div className="sports-matches">{items.map(f=><div className="sports-event-with-favorite" key={f.id}><MatchCard fixture={f} selections={props.selections} choose={props.choose}/><Favorite item={eventKey(f.id)} label={`${f.home} versus ${f.away}`} favorites={props.favorites} toggle={props.toggleFavorite}/></div>)}</div> : <div className="empty"><Search size={30}/><h2>No events here yet.</h2><p>Try another sport or league.</p></div>;
}
function Section({title,items,props}:{title:string;items:Fixture[];props:Props}) {return <section className="sportsbook-result-section"><h2>{title} <small>{items.length}</small></h2><EventList items={items} props={props}/></section>}
function Shell({eyebrow,title,description,children,slip}:{eyebrow:string;title:string;description:string;children:ReactNode;slip:ReactNode}) {return <div className="sportsbook-page"><div className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}<span>.</span></h1><p>{description}</p></div><div className="sports-layout"><div>{children}</div><aside className="desktop-slip">{slip}</aside></div></div>}

export function SportsDirectory(props:Props) {
  return <Shell eyebrow="EXPLORE THE SPORTSBOOK" title="All sports" description="Browse fictional leagues and demo fixtures." slip={props.slip}><div className="sportsbook-link-grid">{sports.map(s=><div className="sportsbook-link-card" key={s}><Link to={sportPath(s)}><Trophy size={20}/><strong>{s}</strong><span>{fixtures.filter(f=>f.sport===s).length} events <ArrowRight size={15}/></span></Link><Favorite item={sportKey(s)} label={s} favorites={props.favorites} toggle={props.toggleFavorite}/></div>)}</div><div className="sportsbook-quick-links"><Link to="/sports/live">Live events <ArrowRight size={16}/></Link><Link to="/sports/search">Search sports <ArrowRight size={16}/></Link><Link to="/sports/favorites">Sports favorites <ArrowRight size={16}/></Link></div><Section title="Live now" items={fixtures.filter(f=>f.live)} props={props}/><Section title="Upcoming" items={fixtures.filter(f=>!f.live)} props={props}/><details className="sportsbook-system-examples"><summary>Preview unavailable event states</summary><Link to="/sports/demo-finished/markets">Finished event</Link><Link to="/sports/demo-suspended/markets">Suspended event</Link><Link to="/sports/demo-no-markets/markets">No markets</Link></details></Shell>;
}
export function SportDetail(props:Props) {
  const {sport:raw}=useParams();const sport=sports.find(s=>s.toLowerCase()===decodeURIComponent(raw||'').toLowerCase());
  if(!sport)return <Missing/>;
  const list=fixtures.filter(f=>f.sport===sport);
  return <Shell eyebrow="SPORT" title={sport} description="Live and upcoming demo events by league." slip={props.slip}><div className="sportsbook-heading-action"><Favorite item={sportKey(sport)} label={sport} favorites={props.favorites} toggle={props.toggleFavorite}/><Link to="/sports/all">All sports <ArrowRight size={15}/></Link></div><div className="sportsbook-link-grid">{leaguesFor(sport).map(l=><div className="sportsbook-link-card" key={l}><Link to={leaguePath(sport,l)}><Trophy size={18}/><strong>{l}</strong><span>{list.filter(f=>f.league===l).length} events <ArrowRight size={15}/></span></Link><Favorite item={leagueKey(sport,l)} label={l} favorites={props.favorites} toggle={props.toggleFavorite}/></div>)}</div><Section title="Live" items={list.filter(f=>f.live)} props={props}/><Section title="Upcoming" items={list.filter(f=>!f.live)} props={props}/></Shell>;
}
export function LeagueDetail(props:Props) {
  const {sport:rawSport,league:rawLeague}=useParams();const sport=sports.find(s=>s.toLowerCase()===decodeURIComponent(rawSport||'').toLowerCase());const league=sport&&leaguesFor(sport).find(l=>l.toLowerCase()===decodeURIComponent(rawLeague||'').toLowerCase());
  if(!sport||!league)return <Missing/>;
  const list=fixtures.filter(f=>f.sport===sport&&f.league===league);
  return <Shell eyebrow={sport.toUpperCase()} title={league} description={`${list.length} fictional ${list.length===1?'fixture':'fixtures'} · Demo odds`} slip={props.slip}><div className="sportsbook-heading-action"><Favorite item={leagueKey(sport,league)} label={league} favorites={props.favorites} toggle={props.toggleFavorite}/><Link to={sportPath(sport)}>{sport} <ArrowRight size={15}/></Link></div><Section title="Live" items={list.filter(f=>f.live)} props={props}/><Section title="Upcoming" items={list.filter(f=>!f.live)} props={props}/></Shell>;
}
export function LiveSports(props:Props) {return <Shell eyebrow="IN PLAY" title="Live events" description="Live scores, match clocks, and fictional demo odds." slip={props.slip}><div className="sportsbook-quick-links">{sports.map(s=><Link key={s} to={sportPath(s)}>{s}<ArrowRight size={15}/></Link>)}</div><Section title="Live now" items={fixtures.filter(f=>f.live)} props={props}/></Shell>}
export function SportsSearch(props:Props) {
  const [query,setQuery]=useState('');const q=query.trim().toLocaleLowerCase();
  const matchingSports=useMemo(()=>q?sports.filter(s=>s.toLowerCase().includes(q)):[],[q]);
  const matchingLeagues=useMemo(()=>q?sports.flatMap(s=>leaguesFor(s).filter(l=>l.toLowerCase().includes(q)).map(l=>({sport:s,league:l}))):[],[q]);
  const matchingTeams=useMemo(()=>q?[...new Set(fixtures.flatMap(f=>[f.home,f.away]))].filter(t=>t.toLowerCase().includes(q)):[],[q]);
  const matchingEvents=useMemo(()=>q?fixtures.filter(f=>`${f.home} ${f.away} ${f.league} ${f.sport}`.toLowerCase().includes(q)):[],[q]);
  return <Shell eyebrow="DISCOVER" title="Sports search" description="Find sports, leagues, teams, and events." slip={props.slip}><label className="search-field sports-search"><Search size={18}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search sports, leagues, teams or events" aria-label="Search sportsbook"/></label>{!q?<div className="empty"><Search size={30}/><h2>What are you looking for?</h2><p>Enter a sport, league, team, or event.</p></div>:<>{matchingSports.length+matchingLeagues.length+matchingTeams.length+matchingEvents.length===0?<div className="empty"><Search size={30}/><h2>No results found.</h2><p>Try a different name or clear your search.</p><button className="outline-button" onClick={()=>setQuery('')}>Clear search</button></div>:<><div className="sportsbook-search-results">{matchingSports.map(s=><div key={s}><Link to={sportPath(s)}>Sport · {s} <ArrowRight size={14}/></Link><Favorite item={sportKey(s)} label={s} favorites={props.favorites} toggle={props.toggleFavorite}/></div>)}{matchingLeagues.map(({sport,league})=><div key={`${sport}-${league}`}><Link to={leaguePath(sport,league)}>League · {league} <ArrowRight size={14}/></Link><Favorite item={leagueKey(sport,league)} label={league} favorites={props.favorites} toggle={props.toggleFavorite}/></div>)}{matchingTeams.map(team=><div key={team}><span>Team · {team}</span><Favorite item={teamKey(team)} label={team} favorites={props.favorites} toggle={props.toggleFavorite}/></div>)}</div><Section title="Events" items={matchingEvents} props={props}/></>}</>}</Shell>;
}
export function SportsFavorites(props:Props) {
  const favoriteSports=sports.filter(s=>props.favorites.includes(sportKey(s)));
  const favoriteLeagues=sports.flatMap(s=>leaguesFor(s).filter(l=>props.favorites.includes(leagueKey(s,l))).map(l=>({sport:s,league:l})));
  const favoriteTeams=[...new Set(fixtures.flatMap(f=>[f.home,f.away]))].filter(t=>props.favorites.includes(teamKey(t)));
  const events=fixtures.filter(f=>props.favorites.includes(eventKey(f.id))||favoriteTeams.includes(f.home)||favoriteTeams.includes(f.away));
  return <Shell eyebrow="YOUR SPORTSBOOK" title="Sports favorites" description="Your saved sports, leagues, teams, and events stay on this device." slip={props.slip}>{!props.favorites.length?<div className="empty"><Heart size={30}/><h2>No sports favorites yet.</h2><p>Save a sport, league, team, or event to find it here.</p><Link className="gold-button" to="/sports/all">Explore sports <ArrowRight size={15}/></Link></div>:<><div className="sportsbook-search-results">{favoriteSports.map(s=><div key={s}><Link to={sportPath(s)}>Sport · {s} <ArrowRight size={14}/></Link><Favorite item={sportKey(s)} label={s} favorites={props.favorites} toggle={props.toggleFavorite}/></div>)}{favoriteLeagues.map(({sport,league})=><div key={`${sport}-${league}`}><Link to={leaguePath(sport,league)}>League · {league} <ArrowRight size={14}/></Link><Favorite item={leagueKey(sport,league)} label={league} favorites={props.favorites} toggle={props.toggleFavorite}/></div>)}{favoriteTeams.map(t=><div key={t}><span>Team · {t}</span><Favorite item={teamKey(t)} label={t} favorites={props.favorites} toggle={props.toggleFavorite}/></div>)}</div><Section title="Saved events and teams" items={events} props={props}/></>}</Shell>;
}
function Missing(){return <div className="empty"><Trophy size={30}/><h2>Sports page unavailable.</h2><p>That demo sport or league could not be found.</p><Link className="gold-button" to="/sports/all">All sports</Link></div>}
