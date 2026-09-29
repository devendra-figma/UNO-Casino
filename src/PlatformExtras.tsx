import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowDownLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Gift, Heart, LogOut, Rocket, ShieldCheck, Wallet } from 'lucide-react';
import { money, type Game } from './data';

export const crashGames: Game[] = [
  {id:'crash-ignition',name:'Ignition',provider:'UNO Studios',category:'Crash',tile:0,image:'/uno-tile-crash.webp',tag:'NEW'},
  {id:'crash-orbit',name:'Orbit Rush',provider:'UNO Studios',category:'Crash',tile:1,image:'/uno-tile-crash.webp'},
  {id:'crash-neon',name:'Neon Velocity',provider:'Orbit Games',category:'Crash',tile:2,image:'/uno-tile-crash.webp'},
  {id:'crash-solar',name:'Solar Flight',provider:'Ember Play',category:'Crash',tile:3,image:'/uno-tile-crash.webp'},
];

const offers = [
  {id:'welcome',category:'Casino',title:'Your golden beginning.',highlight:'Welcome collection',description:'Discover a selection of casino favorites for your first visit.',image:'casino',color:'gold',to:'/casino',terms:'Welcome bonus concept only. No bonus is credited or claimable in this prototype. Eligibility, limits and offer terms are not yet defined.'},
  {id:'matchday',category:'Sports',title:'Make it a matchday.',highlight:'The football edit',description:'Explore the fixtures taking center stage in our demo sportsbook.',image:'sports',color:'emerald',to:'/sports',terms:'Sports promotion concept. Fixtures and odds are fictional. No odds boost or promotional payout is applied.'},
  {id:'tables',category:'Live casino',title:'An evening at the tables.',highlight:'Live table collection',description:'Roulette, blackjack and a new seat at the table.',image:'live',color:'violet',to:'/casino?category=Live%20casino',terms:'Live casino promotion concept. Previews only; no live dealer or game provider is connected.'},
  {id:'launch',category:'Crash',title:'Ready for ignition?',highlight:'Discover Crash Games',description:'Meet the newest addition to your UNO playground.',image:'crash',color:'coral',to:'/crash',terms:'Crash collection concept. Launches show a simulated preview. There are no real rounds, multipliers, wagers or rewards.'},
  {id:'weekend',category:'Casino',title:'The weekend selection.',highlight:'Something new to explore',description:'Colorful worlds and fresh picks from the demo collection.',image:'casino',color:'violet',to:'/casino',terms:'Weekend promotion concept only. No free spins, prizes or time-limited benefits can be claimed.'},
  {id:'kickoff',category:'Sports',title:'Before the first whistle.',highlight:'Upcoming fixtures',description:'Browse what is next and build your virtual bet slip.',image:'sports',color:'gold',to:'/sports?tab=Upcoming',terms:'Upcoming matches are fictional. Demo bets use virtual USD and remain pending; no actual event or payout is connected.'},
];

export function Promotions(){
  const [params]=useSearchParams();
  const initialFilter=params.get('category')||'All promotions';
  const [filter,setFilter]=useState(['All promotions','Casino','Sports','Live casino','Crash'].includes(initialFilter)?initialFilter:'All promotions');
  const [expanded,setExpanded]=useState<string|null>(params.get('offer'));
  const visible=offers.filter(o=>filter==='All promotions'||o.category===filter);
  return <>
    <div className="page-title"><span className="eyebrow">THE EXTRA MOMENTS</span><h1>Promotions<span>.</span></h1><p>A little more to explore across every part of UNO.</p></div>
    <div className="promo-intro"><Gift size={24}/><p>All offers below are <strong>demo concepts</strong>. No real bonuses or rewards can be claimed.</p></div>
    <div className="tabs promo-tabs" aria-label="Promotion categories">{['All promotions','Casino','Sports','Live casino','Crash'].map(c=><button key={c} aria-pressed={filter===c} className={filter===c?'active':''} onClick={()=>{setFilter(c);setExpanded(null);}}>{c}</button>)}</div>
    <div className="promotions-grid">{visible.map(o=><article className={`promotion-card tile-${o.color}`} key={o.id}>
      <div className="promotion-art"><span className="offer-demo">DEMO OFFER</span><img src={`/uno-tile-${o.image}.webp`} alt="" width="640" height="640" loading="lazy"/><span className="promotion-category">{o.category}</span></div>
      <div className="promotion-copy"><span className="eyebrow">{o.highlight}</span><h2>{o.title}</h2><p>{o.description}</p><button className="offer-details" aria-expanded={expanded===o.id} aria-controls={`offer-${o.id}`} onClick={()=>setExpanded(expanded===o.id?null:o.id)}>View offer details <ChevronDown size={17}/></button>
      {expanded===o.id&&<div className="promotion-terms" id={`offer-${o.id}`}><p>{o.terms}</p><Link to={o.to}>Explore {o.category==='Crash'?'Crash Games':o.category} <ArrowRight size={16}/></Link></div>}</div>
    </article>)}</div>
  </>;
}

export function CrashCollection({favorites,favorite,openGame,compact=false}:{favorites:string[];favorite:(id:string)=>void;openGame:(g:Game)=>void;compact?:boolean}){
  const [query,setQuery]=useState('');
  const visible=crashGames.filter(g=>g.name.toLowerCase().includes(query.toLowerCase()));
  return <>
    {!compact&&<><div className="crash-banner"><div><span className="eyebrow">THE NEXT CHAPTER OF PLAY</span><h1>Lift off.<br/><em>Explore Crash.</em></h1><p>Four fictional worlds. One new way to explore UNO.</p><span className="crash-demo"><ShieldCheck size={15}/> Demo previews · No real wagering</span></div><img src="/uno-tile-crash.webp" alt="Gold and coral rocket" width="640" height="640"/></div><label className="search-field crash-search"><Rocket size={19}/><input aria-label="Search crash games" placeholder="Search Crash Games" value={query} onChange={e=>setQuery(e.target.value)}/></label></>}
    <div className="crash-grid">{visible.map(g=><article className={`crash-card crash-color-${g.tile}`} key={g.id}><button className="crash-preview" onClick={()=>openGame(g)} aria-label={`Preview ${g.name}`}><span className="crash-card-tag">{g.tag||'DEMO'}</span><img src={g.image} alt="" width="640" height="640" loading="lazy"/><div><span>{g.provider}</span><h3>{g.name}</h3><span className="crash-play">Explore game <ArrowUpRight size={17}/></span></div></button><button className="favorite" aria-label={`${favorites.includes(g.id)?'Remove':'Add'} ${g.name} ${favorites.includes(g.id)?'from':'to'} favorites`} aria-pressed={favorites.includes(g.id)} onClick={()=>favorite(g.id)}><Heart size={16} fill={favorites.includes(g.id)?'currentColor':'none'}/></button></article>)}</div>
    {!visible.length&&<div className="empty"><Rocket/><h2>No Crash Games found.</h2><p>Try another game name.</p><button className="outline-button" onClick={()=>setQuery('')}>Clear search</button></div>}
  </>;
}

export function DemoAccount({name,loggedIn,balance,onLogin,onLogout,onDeposit,onReset,onProfileMenu}:{name:string;loggedIn:boolean;balance:number;onLogin:()=>void;onLogout:()=>void;onDeposit:()=>void;onReset:()=>void;onProfileMenu:()=>void}){
  return loggedIn?<><div className="account-identity"><button className="avatar" aria-label="Open account menu" aria-haspopup="menu" onClick={onProfileMenu}>{name.trim().charAt(0).toUpperCase()||'U'}</button><div><h3>{name}</h3><span>Demo account · This browser</span></div><span className="account-status">DEMO</span></div><div className="crypto-wallet"><div><Wallet size={20}/><span>Total demo balance</span></div><strong>{money(balance)}</strong><span>USD · Virtual funds</span><div className="wallet-asset"><span className="coin-icon">₮</span><span>Demo USD wallet<small>Crypto-style interface preview</small></span><Check size={18}/></div></div><button className="gold-button full" onClick={onDeposit}><ArrowDownLeft size={18}/> Deposit</button><p className="wallet-note">No real cryptocurrency, wallet address or payment is connected.</p><div className="account-options"><Link to="/bets"><Wallet size={17}/> View demo bets <ArrowUpRight size={16}/></Link><button onClick={onReset}>Reset demo account <ArrowRight size={16}/></button><button onClick={onLogout}><LogOut size={17}/> Log out</button></div><small className="muted">Reset restores $1,000 and clears your demo bets and favorites.</small></>:<div className="demo-login"><div className="login-emblem"><Wallet size={34}/></div><span className="eyebrow">WELCOME TO UNO</span><h3>Your play.<br/>All in one place.</h3><p>Preview your personal wallet, favorites and bets with $1,000 in virtual funds.</p><button className="gold-button full" onClick={onLogin}>Enter demo account <ArrowRight size={18}/></button><small>No password or personal details needed. This is a simulated login saved in this browser.</small></div>;
}

export function DemoDeposit({balance,onDeposit}:{balance:number;onDeposit:(amount:number)=>void}){
  const [amount,setAmount]=useState('100');const [error,setError]=useState('');const [success,setSuccess]=useState<number|null>(null);
  return <div className="deposit-panel"><div className="deposit-asset"><span className="coin-icon">₮</span><div><strong>Demo USD</strong><span>Virtual wallet · No blockchain transfer</span></div><span className="offer-demo">DEMO</span></div><div className="deposit-balance"><span>Available balance</span><strong>{money(balance)}</strong></div><form onSubmit={e=>{e.preventDefault();try{const value=Number(amount);onDeposit(value);setError('');setSuccess(value);}catch(e){setError((e as Error).message);setSuccess(null);}}} noValidate><label className="stake-label">Amount to add<div className="stake-input"><span>USD</span><input autoFocus aria-label="Demo deposit amount" type="number" min="1" max="10000" step="0.01" value={amount} onChange={e=>{setAmount(e.target.value);setError('');setSuccess(null);}}/></div></label><div className="stake-presets">{[100,250,500,1000].map(v=><button key={v} type="button" onClick={()=>{setAmount(String(v));setError('');setSuccess(null);}}>${v}</button>)}</div>{error&&<p className="form-error" role="alert">{error}</p>}{success!==null&&<p className="deposit-success" role="status"><Check size={18}/>{money(success)} added to your demo wallet.</p>}<button className="gold-button full" type="submit"><ArrowDownLeft size={18}/> Add demo funds</button></form><p className="wallet-note"><ShieldCheck size={17}/> For preview only. No money is charged and no cryptocurrency is transferred. Add $1–$10,000 per demo deposit.</p></div>;
}
