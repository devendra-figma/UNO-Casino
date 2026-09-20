import { useEffect, useState, type ReactNode, type MouseEvent, type FocusEvent } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, CircleDot, CircleHelp, Dices, Gift, Heart, Home, PanelLeftClose, PanelLeftOpen, Rocket, ShieldCheck, Ticket, Trophy, Wallet, Zap } from 'lucide-react';

type SidebarProps = {collapsed:boolean;menu:boolean;toggle:()=>void;bets:number;favorites:number;account:()=>void;info:(kind:string)=>void};
const playLinks = [
  {to:'/',label:'Home',icon:Home,tone:'gold'},
  {to:'/casino',label:'Casino',icon:Dices,tone:'gold'},
  {to:'/sports',label:'Sports',icon:Trophy,tone:'green'},
  {to:'/casino?category=Live%20casino',label:'Live casino',icon:CircleDot,tone:'violet'},
  {to:'/crash',label:'Crash Games',icon:Rocket,tone:'coral'},
  {to:'/casino?category=Originals',label:'Originals',icon:Zap,tone:'blue'},
];

export function Sidebar({collapsed,menu,toggle,bets,favorites,account,info}:SidebarProps){
  const location=useLocation();
  const [hintVisible,setHintVisible]=useState(false);
  const [hint,setHint]=useState<{text:string;top:number}|null>(null);
  useEffect(()=>{setHintVisible(false);},[collapsed,menu,location.pathname,location.search]);
  useEffect(()=>{const dismiss=()=>setHintVisible(false);const key=(e:KeyboardEvent)=>{if(e.key==='Escape')dismiss();};window.addEventListener('resize',dismiss);window.addEventListener('scroll',dismiss,true);window.addEventListener('keydown',key);return()=>{window.removeEventListener('resize',dismiss);window.removeEventListener('scroll',dismiss,true);window.removeEventListener('keydown',key);};},[]);
  function show(text:string,e:MouseEvent<HTMLElement>|FocusEvent<HTMLElement>){if(collapsed&&window.matchMedia('(min-width:981px)').matches){setHintVisible(true);setHint({text,top:Math.min(innerHeight-52,Math.max(8,e.currentTarget.getBoundingClientRect().top+4))});}}
  const hintEvents=(text:string)=>({onMouseEnter:(e:MouseEvent<HTMLElement>)=>show(text,e),onMouseLeave:()=>setHintVisible(false),onFocus:(e:FocusEvent<HTMLElement>)=>show(text,e),onBlur:()=>setHintVisible(false)});
  function active(to:string){const target=new URL(to,window.location.origin);return location.pathname===target.pathname&&location.search===target.search;}
  function item(to:string,label:string,icon:ReactNode,tone='gold',badge?:ReactNode){return <Link key={to} to={to} className={`sidebar-item tone-${tone} ${active(to)?'active':''}`} aria-label={label} aria-current={active(to)?'page':undefined} {...hintEvents(label)}><span className="sidebar-icon">{icon}</span><span className="nav-label">{label}</span>{badge}<ChevronRight className="nav-chevron" size={14}/></Link>;}
  return <><aside id="uno-sidebar" className={`sidebar polished-sidebar ${menu?'menu-open':''}`}>
    <div className="sidebar-heading"><span className="sidebar-label"><span className="sidebar-brand-dot"/> YOUR UNO</span><button className="icon-button sidebar-toggle" aria-label={collapsed?'Expand sidebar':'Collapse sidebar'} aria-expanded={!collapsed} aria-controls="sidebar-links" onClick={toggle}>{collapsed?<PanelLeftOpen size={19}/>:<PanelLeftClose size={19}/>}</button></div>
    <div className="sidebar-scroll">
      <div className="sidebar-group-label">PLAY</div>
      <nav id="sidebar-links" aria-label="Sidebar">{playLinks.map(({to,label,icon:Icon,tone})=>item(to,label,<Icon size={20}/>,tone,to==='/sports'?<span className="side-live"><i/>LIVE</span>:undefined))}</nav>
      <div className="sidebar-group-label account-group">YOUR ACCOUNT</div>
      <nav aria-label="Your account">
        {item('/bets','My bets',<Ticket size={20}/>,'gold',bets>0?<span className="side-count">{bets}</span>:undefined)}
        {item('/casino?favorites=true','Favorites',<Heart size={20}/>,'rose',favorites>0?<span className="side-count">{favorites}</span>:undefined)}
        <button className="sidebar-item tone-gold" aria-label="My wallet" onClick={account} {...hintEvents('My wallet')}><span className="sidebar-icon"><Wallet size={20}/></span><span className="nav-label">My wallet</span><ChevronRight className="nav-chevron" size={14}/></button>
      </nav>
      <Link to="/promotions" className={`sidebar-offer ${location.pathname==='/promotions'?'active':''}`} aria-label="Promotions" aria-current={location.pathname==='/promotions'?'page':undefined} {...hintEvents('Promotions')}><img src="/uno-tile-casino.webp" alt="" width="80" height="80"/><Gift className="offer-rail-icon" size={20}/><span className="nav-label"><small>A LITTLE EXTRA</small><strong>Promotions</strong><span>Explore demo offers <ArrowUpRight size={12}/></span></span></Link>
    </div>
    <div className="sidebar-utilities">
      <button className="sidebar-item" aria-label="Responsible play" onClick={()=>info('responsible')} {...hintEvents('Responsible play')}><span className="sidebar-icon"><ShieldCheck size={18}/></span><span className="nav-label">Responsible play</span><span className="side-age">18+</span></button>
      <button className="sidebar-item" aria-label="Help and support" onClick={()=>info('help')} {...hintEvents('Help & support')}><span className="sidebar-icon"><CircleHelp size={18}/></span><span className="nav-label">Help & support</span></button>
      <div className="sidebar-locale"><span>English</span><span>USD <i/> Demo</span></div>
    </div>
  </aside>{hint&&collapsed&&createPortal(<div className="sidebar-tooltip" data-visible={hintVisible} style={{top:hint.top}} aria-hidden="true">{hint.text}</div>,document.body)}</>;
}

export function HomePromotions(){return <section className="home-promotions" aria-labelledby="home-promotions-title"><div className="section-heading"><div><h2 id="home-promotions-title"><Gift/> A little extra play</h2><p>Two ways to discover more. Demo offers only.</p></div><Link to="/promotions">All promotions <ChevronRight size={16}/></Link></div><div className="home-promo-grid">
  <Link to="/promotions?category=Casino&offer=welcome" className="home-promo promo-gold"><div><span className="promo-mini-label">CASINO COLLECTION · DEMO</span><h3>A golden<br/>first chapter.</h3><span className="promo-action">Explore the offer <ArrowUpRight size={17}/></span></div><img src="/uno-tile-casino.webp" alt="" width="640" height="640" loading="lazy"/></Link>
  <Link to="/promotions?category=Sports&offer=matchday" className="home-promo promo-green"><div><span className="promo-mini-label">THE MATCHDAY EDIT · DEMO</span><h3>Your next<br/>big match.</h3><span className="promo-action">Explore the offer <ArrowUpRight size={17}/></span></div><img src="/uno-tile-sports.webp" alt="" width="640" height="640" loading="lazy"/></Link>
  </div></section>;}
