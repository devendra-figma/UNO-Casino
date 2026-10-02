import { useState } from 'react';
import { ArrowLeft, ArrowRight, Gift, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import './promotions-pages.css';

type Category = 'Casino' | 'Sports' | 'Live casino' | 'Crash';
export interface Promotion {
  id: string; category: Category; title: string; description: string; fullDescription: string;
  type: string; value: string; validity: string; image: string; color: string;
  eligibility?: string; minimumDeposit?: string; wagering?: string; expiry?: string; terms: string[];
  cta?: string; to?: string;
}

/** Presentation content only. None of these bonuses changes the demo wallet or odds. */
export const promotions: Promotion[] = [
  {id:'welcome',category:'Casino',title:'The golden welcome',description:'Begin with a bonus concept made for a first visit.',fullDescription:'Start your UNO journey with a fictional first deposit offer. This presentation shows how a welcome bonus could be described to players; no bonus is active or credited.',type:'Welcome bonus',value:'100% up to $500',validity:'First 7 days after joining · Demo',image:'/promotions/welcome.webp',color:'gold',eligibility:'New demo account holders',minimumDeposit:'$20 virtual USD · illustrative',wagering:'35× bonus amount · illustrative',terms:['One conceptual welcome offer per demo account.','All amounts and wagering figures are fictional examples.','No actual deposit, bonus credit or cashout is available.']},
  {id:'cashback',category:'Casino',title:'A little back in play',description:'An easy to understand weekly cashback concept.',fullDescription:'A fictional weekly cashback benefit built around the idea of returning a portion of eligible demo play. The amount shown is for client review only and never alters your virtual balance.',type:'Cashback',value:'10% up to $100',validity:'Weekly review · Demo',image:'/promotions/cashback.webp',color:'emerald',eligibility:'Demo account holders with eligible play',minimumDeposit:'Not required for this concept',wagering:'1× cashback amount · illustrative',terms:['Cashback is calculated only as a design example.','The prototype does not track qualifying losses or grant cashback.','No real currency, payout or financial benefit is involved.']},
  {id:'spins',category:'Casino',title:'The spin collection',description:'A colorful free spins concept for selected slots.',fullDescription:'Discover a fictional bundle of free spins for selected games in the UNO demo catalog. The card demonstrates how game-specific bonus information could appear once provider integrations are available.',type:'Free spins',value:'50 demo free spins',validity:'7 days from offer activation · Demo',image:'/promotions/spins.webp',color:'violet',eligibility:'Demo account holders',minimumDeposit:'Not required for this concept',wagering:'25× winnings · illustrative',terms:['Spins are a presentation concept and cannot be launched or redeemed.','Eligible games and maximum winnings would need operator terms.','No provider connection or real reward exists.']},
  {id:'reload',category:'Casino',title:'Your weekly reset',description:'A reload bonus concept for returning players.',fullDescription:'Keep the momentum going with a fictional weekly reload. This page presents the kind of key details a returning player would need before deciding whether to take part.',type:'Weekly reload',value:'50% up to $250',validity:'Every Monday · Demo',image:'/promotions/reload.webp',color:'blue',eligibility:'Returning demo account holders',minimumDeposit:'$25 virtual USD · illustrative',wagering:'30× bonus amount · illustrative',terms:['One conceptual reload per demo week.','This prototype does not apply reloads to deposits or bets.','All values are for design review only.']},
  {id:'vip',category:'Casino',title:'The private circle',description:'A premium VIP benefit concept with a quieter touch.',fullDescription:'A VIP example for showing tailored account benefits, dedicated offers and clear terms in a premium presentation. VIP tiers and qualification are not implemented in this prototype.',type:'VIP bonus',value:'20% up to $300',validity:'While eligible · Demo',image:'/promotions/vip.webp',color:'gold',eligibility:'Illustrative VIP tier members',minimumDeposit:'$100 virtual USD · illustrative',wagering:'10× bonus amount · illustrative',terms:['VIP eligibility and tier rules are not implemented.','The example does not grant status, bonuses or prizes.','An operator would provide final terms before any live launch.']},
  {id:'referral',category:'Casino',title:'Better together',description:'A referral reward concept for sharing the experience.',fullDescription:'This fictional referral offer illustrates a simple reward structure for inviting friends. There are no invite links, account tracking or credits in the current demo.',type:'Referral bonus',value:'$25 demo reward',validity:'After a qualifying referral · Demo',image:'/promotions/referral.webp',color:'coral',eligibility:'Demo account holders',minimumDeposit:'Not required for this concept',wagering:'Not applicable in this prototype',terms:['No referral tracking or reward credit is connected.','The offer is for presentation only.','A production launch would require complete eligibility and abuse rules.']},
  {id:'weekend',category:'Casino',title:'The weekend selection',description:'Colorful worlds and fresh picks from the demo collection.',fullDescription:'Discover a rotating selection of fictional casino favorites for the weekend. This collection is a design concept; no free spins or other rewards are attached.',type:'Featured collection',value:'Weekend game picks',validity:'Every weekend · Demo',image:'/uno-tile-casino.webp',color:'violet',eligibility:'All demo visitors',terms:['Featured titles are part of the demo game catalog.','No prizes or time-limited benefits can be claimed.'],cta:'Explore casino',to:'/casino'},
  {id:'matchday',category:'Sports',title:'Make it a matchday',description:'A sportsbook offer concept for the football calendar.',fullDescription:'Explore the football fixtures taking center stage in the demo sportsbook. This is a visual sports promotion only; selecting odds follows the ordinary virtual betslip without an enhanced payout.',type:'Sports offer',value:'Matchday edit',validity:'Featured fixtures · Demo',image:'/uno-tile-sports.webp',color:'emerald',eligibility:'All demo visitors',terms:['Fixtures and odds are fictional.','No odds boost or promotional payout is applied.','Demo bets use virtual funds only.'],cta:'Explore sports',to:'/sports'},
  {id:'kickoff',category:'Sports',title:'Before the first whistle',description:'Browse upcoming demo fixtures and build your virtual betslip.',fullDescription:'See what is next in the fictional sportsbook calendar. The upcoming fixtures are static demo events and any selections use the ordinary virtual betslip.',type:'Upcoming fixtures',value:'Next matchday',validity:'Upcoming fixture preview · Demo',image:'/uno-stadium.webp',color:'gold',eligibility:'All demo visitors',terms:['Upcoming fixtures are fictional.','No special odds, payout or bonus is applied.','Selections use virtual USD and remain pending.'],cta:'See upcoming games',to:'/sports?tab=Upcoming'},
  {id:'tables',category:'Live casino',title:'An evening at the tables',description:'A live table collection concept for curious players.',fullDescription:'Preview the atmosphere of roulette, blackjack and baccarat through the demo live casino collection. No live dealer or casino provider is connected.',type:'Live casino feature',value:'Featured tables',validity:'Collection preview · Demo',image:'/uno-tile-live.webp',color:'violet',eligibility:'All demo visitors',terms:['Table previews are simulated.','No live game, bet, bonus or reward is available.'],cta:'Explore live casino',to:'/casino?category=Live%20casino'},
  {id:'launch',category:'Crash',title:'Ready for ignition',description:'Discover the Crash Games demo collection.',fullDescription:'Meet the newest addition to the UNO playground. Crash launches in this prototype show a simulated preview and do not run real rounds or multipliers.',type:'Crash feature',value:'New collection',validity:'Collection preview · Demo',image:'/uno-tile-crash.webp',color:'coral',eligibility:'All demo visitors',terms:['Crash games are previews only.','There are no real rounds, multipliers, wagers or rewards.'],cta:'Explore Crash Games',to:'/crash'},
];

const categories = ['All promotions', 'Casino', 'Sports', 'Live casino', 'Crash'];

export function Promotions() {
  const [params] = useSearchParams();
  const linkedOffer = params.get('offer');
  const [filter, setFilter] = useState(() => {
    const requested = params.get('category') || 'All promotions';
    return categories.includes(requested) ? requested : 'All promotions';
  });
  if (linkedOffer && promotions.some(offer => offer.id === linkedOffer)) return <Navigate replace to={`/promotions/${linkedOffer}`}/>;
  const visible = promotions.filter(offer => filter === 'All promotions' || offer.category === filter);
  return <>
    <div className="page-title"><span className="eyebrow">THE EXTRA MOMENTS</span><h1>Promotions<span>.</span></h1><p>A little more to explore across every part of UNO.</p></div>
    <div className="promo-intro"><Gift size={24}/><p>All offers below are <strong>demo concepts</strong>. No real bonuses or rewards can be claimed.</p></div>
    <div className="tabs promo-tabs" aria-label="Promotion categories">{categories.map(category => <button key={category} aria-pressed={filter === category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div>
    <div className="promotions-grid">{visible.map(offer => <Link className={`promotion-card promo-list-card tile-${offer.color}`} to={`/promotions/${offer.id}`} key={offer.id} aria-label={`${offer.title}, ${offer.value}. View details`}>
      <div className="promotion-art"><span className="offer-demo">DEMO OFFER</span><img src={offer.image} alt="" width="1536" height="1024" loading="lazy"/><span className="promotion-category">{offer.category}</span></div>
      <div className="promotion-copy"><span className="eyebrow">{offer.type}</span><h2>{offer.title}</h2><p>{offer.description}</p><dl className="promo-card-facts"><div><dt>Bonus value</dt><dd>{offer.value}</dd></div><div><dt>Validity</dt><dd>{offer.validity}</dd></div></dl><span className="offer-details">View Details <ArrowRight size={17}/></span></div>
    </Link>)}</div>
  </>;
}

export function PromotionDetails() {
  const { promotionId } = useParams();
  const offer = promotions.find(item => item.id === promotionId);
  const [attempted, setAttempted] = useState(false);
  if (!offer) return <div className="promotion-not-found"><Gift size={38}/><h1>Promotion unavailable.</h1><p>This demo promotion could not be found.</p><Link className="gold-button" to="/promotions">All promotions</Link></div>;
  const fields = [
    ['Bonus type', offer.type], ['Bonus value', offer.value], ['Eligibility', offer.eligibility],
    ['Minimum deposit', offer.minimumDeposit], ['Wagering requirement', offer.wagering],
    ['Validity', offer.validity], ['Expiry', offer.expiry],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
  return <article className="promotion-details-page">
    <Link className="promotion-back" to="/promotions"><ArrowLeft size={17}/> All promotions</Link>
    <div className={`promotion-detail-hero tile-${offer.color}`}><img src={offer.image} alt="" width="1536" height="1024"/><div><span className="offer-demo">DEMO OFFER</span><span className="eyebrow">{offer.category} · {offer.type}</span><h1>{offer.title}</h1><p>{offer.value}</p></div></div>
    <div className="promotion-detail-layout"><div className="promotion-detail-main"><span className="eyebrow">THE OFFER</span><h2>About this promotion</h2><p>{offer.fullDescription}</p><h2>Terms &amp; Conditions</h2><ul>{offer.terms.map(term => <li key={term}>{term}</li>)}</ul><p className="promotion-legal"><ShieldCheck size={16}/> This is an interactive design preview. No real bonus, payment, wager or prize is available.</p></div>
      <aside className="promotion-detail-aside"><h2>At a glance</h2><dl>{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{offer.to ? <Link className="gold-button full" to={offer.to}>{offer.cta} <ArrowRight size={17}/></Link> : <button className="gold-button full" onClick={() => setAttempted(true)}>Claim Now <ArrowRight size={17}/></button>}{attempted && <p className="promotion-claim-status" role="status">Demo preview only. This offer cannot be claimed or activated.</p>}</aside></div>
  </article>;
}
