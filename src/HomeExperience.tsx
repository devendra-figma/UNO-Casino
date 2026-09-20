import { useState, type ReactNode, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronRight, CircleDot, Dices, Pause, Play, Trophy } from 'lucide-react';
import { fixtures, type Fixture, type Selection } from './data';

export function HeroExperience() {
  const [motion, setMotion] = useState(!document.documentElement.classList.contains('motion-paused'));
  function toggleMotion() {
    setMotion(!motion);
    document.documentElement.classList.toggle('motion-paused', motion);
  }
  return <section className="uno-hero" aria-labelledby="hero-title">
    <div className="hero-orbit" aria-hidden="true" />
    <picture className="uno-hero-art" aria-hidden="true">
      <source media="(max-width: 700px)" srcSet="/uno-hero-mobile.webp" />
      <img src="/uno-hero.webp" alt="" fetchPriority="high" width="1536" height="1024" />
    </picture>
    <div className="uno-hero-copy">
      <span className="uno-eyebrow"><span /> WELCOME TO YOUR NEXT LEVEL</span>
      <h1 id="hero-title">One world.<br/>Every kind of <em>play.</em></h1>
      <p>The thrill of the game. The energy of matchday.<br className="desktop-break"/> All together at UNO.</p>
      <div className="uno-hero-actions">
        <Link className="gold-button" to="/casino">Explore casino <ArrowUpRight size={18}/></Link>
        <Link className="outline-button" to="/sports">Explore sports <ArrowUpRight size={18}/></Link>
      </div>
      <div className="hero-discovery"><span>CASINO</span><i/><span>SPORTS</span><i/><span>LIVE TABLES</span></div>
    </div>
    <div className="hero-art-caption" aria-hidden="true"><span>THE UNO EXPERIENCE</span><span>PLAY BEYOND THE ORDINARY</span></div>
    <button className="motion-toggle" onClick={toggleMotion} aria-pressed={!motion} aria-label={motion?'Pause decorative animations':'Resume decorative animations'}>{motion?<Pause size={13}/>:<Play size={13}/>}<span>{motion?'Pause motion':'Resume motion'}</span></button>
  </section>;
}

const entrances = [
  {name:'Casino',shortName:'Casino',description:'Find your next favorite',to:'/casino',color:'gold',image:'casino'},
  {name:'Sportsbook',shortName:'Sports',description:'Feel every moment',to:'/sports',color:'emerald',image:'sports'},
  {name:'Live casino',shortName:'Live casino',description:'Take your seat',to:'/casino?category=Live%20casino',color:'violet',image:'live'},
  {name:'Crash Games',shortName:'Crash Games',description:'Ready for lift off',to:'/crash',color:'coral',image:'crash'},
];
export function CategoryEntrances(){
  return <nav className="category-tiles" aria-label="Explore UNO">
    {entrances.map(({name,shortName,description,to,color,image},index)=><Link className={`category-tile tile-${color} reveal`} to={to} key={name} aria-label={`Explore ${name}`} style={{'--reveal-delay':`${index*80}ms`} as CSSProperties}>
      <div className="category-object"><img src={`/uno-tile-${image}.webp`} alt="" width="640" height="640" loading="lazy" decoding="async"/></div>
      <div className="category-label"><div><h2><span className="category-desktop-name">{name}</span><span className="category-mobile-name">{shortName}</span></h2><p>{description}</p></div><span className="category-arrow" aria-hidden="true"><ArrowUpRight size={21}/></span></div>
    </Link>)}
  </nav>;
}

export function MatchSpotlight({selections,choose,renderMatch}:{selections:Selection[];choose:(f:Fixture,i:number)=>void;renderMatch:(f:Fixture)=>ReactNode}){
  const f=fixtures[0];
  return <section className="spotlight-section reveal" aria-labelledby="spotlight-title">
    <div className="section-heading"><div><span className="uno-eyebrow section-kicker">THE MATCHDAY EDIT</span><h2 id="spotlight-title">Big games. Bigger moments.</h2><p>Your front-row seat to the action.</p></div><Link to="/sports">All sports <ChevronRight size={16}/></Link></div>
    <div className="spotlight-layout">
      <article className="featured-match">
        <img src="/uno-stadium.webp" alt="" loading="lazy" width="1536" height="768"/>
        <div className="featured-match-content">
          <div className="featured-match-top"><span><Trophy size={15}/> {f.league}</span><span className="featured-live"><span/> LIVE · DEMO</span></div>
          <div className="featured-teams"><div><span className="featured-crest">N<span>FC</span></span><h3>{f.home}</h3></div><div className="featured-score"><strong>{f.score}</strong><span>{f.time}</span></div><div><span className="featured-crest away">K<span>UTD</span></span><h3>{f.away}</h3></div></div>
          <div className="featured-market"><span>Match result</span><small>Fictional fixture · Demo odds</small></div>
          <div className="odds-row featured-odds">{f.odds.map((o,i)=>{const outcome=i===0?f.home:i===2?f.away:'Draw';const active=selections.some(s=>s.fixtureId===f.id&&s.outcome===outcome);return <button key={outcome} className={active?'selected':''} onClick={()=>choose(f,i)} aria-label={`${f.home} versus ${f.away}: ${outcome} at ${o.toFixed(2)}`} aria-pressed={active}><span>{i===0?'1 · Northbridge':i===1?'X · Draw':'2 · Kingsport'}</span><strong>{o.toFixed(2)}</strong></button>;})}</div>
        </div>
      </article>
      <div className="spotlight-secondary">{fixtures.slice(1,3).map(f=><div key={f.id}>{renderMatch(f)}</div>)}<Link className="matchday-link" to="/sports">Find your next match <ArrowRight size={17}/></Link></div>
    </div>
  </section>;
}
