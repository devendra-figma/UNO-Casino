import type { MarketGroup } from './markets';
export interface Game {id:string;name:string;provider:string;category:'Slots'|'Live casino'|'Originals'|'Crash';tile:number;image?:string;tag?:string}
export interface Fixture {id:string;sport:string;league:string;home:string;away:string;homeCode:string;awayCode:string;live:boolean;time:string;score?:string;odds:number[];kickoffAt?:string;marketGroups?:MarketGroup[];status?:'finished'|'suspended'}
export interface Selection {fixtureId:string;match:string;outcome:string;odds:number;marketId?:string;market?:string;oddsChangedFrom?:number;suspended?:boolean}
export type BetStatus = 'Pending'|'Won'|'Lost'|'Void';
export interface DemoBet {id:string;selections:Selection[];stake:number;potential:number;mode:'single'|'accumulator';status:BetStatus;createdAt:string;settledAt?:string;actualReturn?:number}
export interface DemoState {balance:number;favorites:string[];bets:DemoBet[]}
export const games:Game[]=[
{id:'vatica',name:'Vatica - Voice of Lost Souls',provider:'UNO Studios',category:'Slots',tile:0,image:'/optimized/Vatica - Voice of Lost Souls.webp',tag:'POPULAR'},
{id:'eastern',name:'Eastern Fury',provider:'Ember Play',category:'Slots',tile:1,image:'/optimized/Eastern Fury.webp',tag:'HOT'},
{id:'helios',name:'Helios - Triple Sun',provider:'UNO Studios',category:'Slots',tile:2,image:'/optimized/Helios - Triple Sun.webp',tag:'NEW'},
{id:'johnny',name:'Johnny vs Chicken',provider:'Orbit Games',category:'Slots',tile:3,image:'/optimized/Johnny vs Chicken.webp'},
{id:'lebandit',name:'Le Bandit Hold & Win',provider:'Ember Play',category:'Slots',tile:4,image:'/optimized/Le Bandit Hold & Win.webp'},
{id:'triplehop',name:'Triple Hop Pots',provider:'UNO Studios',category:'Originals',tile:5,image:'/optimized/Triple Hop Pots.webp',tag:'LIVE'},
{id:'bloodrebels',name:'Blood Rebels',provider:'Ember Play',category:'Slots',tile:0,image:'/optimized/Blood Rebels.webp',tag:'HOT'},
{id:'bookhidden',name:'Book of Hidden Tombs',provider:'UNO Studios',category:'Slots',tile:1,image:'/optimized/Book of Hidden Tombs.webp'},
{id:'cursedmoon',name:'Cursed Moon Power Collection',provider:'Orbit Games',category:'Slots',tile:2,image:'/optimized/Cursed Moon Power Collection.webp',tag:'NEW'},
{id:'deadmans',name:"Dead Man's Bounty: Hold & Win",provider:'Ember Play',category:'Slots',tile:3,image:'/optimized/dead-mans-bounty.webp'},
{id:'depths2',name:'Depths of Fortune 2',provider:'UNO Studios',category:'Slots',tile:4,image:'/optimized/Depths of Fortune 2.webp'},
{id:'dragonguardian',name:'Dragon Guardian: 3 Pots',provider:'Orbit Games',category:'Slots',tile:5,image:'/optimized/Dragon Guardian_ 3 Pots.webp'},
{id:'fortunetrio',name:'Fortune Trio: Minions of Fu',provider:'UNO Studios',category:'Slots',tile:0,image:'/optimized/Fortune Trio_ Minions of Fu.webp'},
{id:'goldenretriever',name:'Golden Retriever',provider:'Orbit Games',category:'Originals',tile:1,image:'/optimized/Golden Retriever.webp',tag:'NEW'},
{id:'luckycaiman',name:'Lucky Caiman',provider:'Ember Play',category:'Slots',tile:2,image:'/optimized/Lucky Caiman.webp'},
{id:'luckypinball',name:'Lucky Pinball',provider:'UNO Studios',category:'Originals',tile:3,image:'/optimized/Lucky Pinball.webp'},
{id:'redhotchilli',name:'Red Hot Chilli Chickens',provider:'Orbit Games',category:'Slots',tile:4,image:'/optimized/Red Hot Chilli Chickens.webp',tag:'HOT'},
{id:'supernova',name:'Supernova Galaxy Orbs Hold & Win',provider:'Ember Play',category:'Slots',tile:5,image:'/optimized/Supernova Galaxy Orbs Hold & Win.webp'},
{id:'blackjack',name:'Midnight Blackjack',provider:'Ember Play',category:'Live casino',tile:5},
{id:'nova',name:'Nova Rush',provider:'Orbit Games',category:'Originals',tile:1},
];
export const liveGames:Game[]=[
{id:'lc-amroulette',name:'American Roulette',provider:'UNO Studios',category:'Live casino',tile:5,image:'/optimized/American Roulette.webp',tag:'LIVE'},
{id:'lc-autoroulette',name:'Auto Roulette VIP',provider:'UNO Studios',category:'Live casino',tile:5,image:'/optimized/Auto Roulette VIP.webp',tag:'LIVE'},
{id:'lc-baccarat3',name:'Baccarat 3',provider:'Ember Play',category:'Live casino',tile:5,image:'/optimized/Baccarat 3.webp',tag:'LIVE'},
{id:'lc-bj106',name:'Blackjack 106',provider:'Ember Play',category:'Live casino',tile:5,image:'/optimized/Blackjack 106.webp',tag:'LIVE'},
{id:'lc-bj107',name:'Blackjack 107',provider:'Ember Play',category:'Live casino',tile:5,image:'/optimized/Blackjack 107.webp',tag:'LIVE'},
{id:'lc-bj108',name:'Blackjack 108',provider:'Ember Play',category:'Live casino',tile:5,image:'/optimized/Blackjack 108.webp',tag:'LIVE'},
{id:'lc-bj109',name:'Blackjack 109',provider:'Orbit Games',category:'Live casino',tile:5,image:'/optimized/Blackjack 109.webp',tag:'LIVE'},
{id:'lc-bj110',name:'Blackjack 110',provider:'Orbit Games',category:'Live casino',tile:5,image:'/optimized/Blackjack 110.webp',tag:'LIVE'},
{id:'lc-bj12',name:'Blackjack 12',provider:'UNO Studios',category:'Live casino',tile:5,image:'/optimized/Blackjack 12.webp',tag:'LIVE'},
{id:'lc-bj52',name:'Blackjack 52',provider:'Orbit Games',category:'Live casino',tile:5,image:'/optimized/Blackjack 52.webp',tag:'LIVE'},
{id:'lc-bj54',name:'Blackjack 54',provider:'UNO Studios',category:'Live casino',tile:5,image:'/optimized/Blackjack 54.webp',tag:'LIVE'},
{id:'lc-bj55',name:'Blackjack 55',provider:'Ember Play',category:'Live casino',tile:5,image:'/optimized/Blackjack 55.webp',tag:'LIVE'},
{id:'lc-prive1',name:'Privé Lounge 1',provider:'UNO Studios',category:'Live casino',tile:5,image:'/optimized/Prive Lounge 1.webp',tag:'LIVE'},
{id:'lc-prive2',name:'Privé Lounge 2',provider:'UNO Studios',category:'Live casino',tile:5,image:'/optimized/Prive Lounge 2.webp',tag:'LIVE'},
{id:'lc-speedroulette',name:'Speed Roulette 2',provider:'Orbit Games',category:'Live casino',tile:5,image:'/optimized/Speed Roulette 2.webp',tag:'LIVE'},
{id:'lc-vipbaccarat',name:'VIP Speed Baccarat',provider:'Ember Play',category:'Live casino',tile:5,image:'/optimized/Baccarat 3.webp',tag:'LIVE'},
];
export const fixtures:Fixture[]=[
{id:'f1',kickoffAt:'2026-10-02T16:30:00Z',sport:'Football',league:'Premier Division',home:'Northbridge FC',away:'Kingsport United',homeCode:'NFC',awayCode:'KPU',live:true,time:'67′ · 2nd half',score:'2 : 1',odds:[1.85,3.6,4.2]},
{id:'f2',kickoffAt:'2026-10-02T17:30:00Z',sport:'Football',league:'European Cup',home:'Real Aurora',away:'Milano City',homeCode:'RAU',awayCode:'MIL',live:true,time:'34′ · 1st half',score:'0 : 0',odds:[2.15,3.25,3.4]},
{id:'f3',kickoffAt:'2026-10-02T16:45:00Z',sport:'Football',league:'La Liga Elite',home:'Atletico Central',away:'Valencia Real',homeCode:'ATC',awayCode:'VAL',live:true,time:'58′ · 2nd half',score:'1 : 1',odds:[2.05,3.1,3.6]},
{id:'f4',kickoffAt:'2026-10-03T19:45:00Z',sport:'Football',league:'Premier Division',home:'Westhaven Athletic',away:'Eastford Rovers',homeCode:'WHA',awayCode:'EFR',live:false,time:'Today · 20:45',odds:[2.4,3.1,2.9]},
{id:'f5',kickoffAt:'2026-10-04T18:30:00Z',sport:'Football',league:'European Cup',home:'Lisbon Stars',away:'Bavaria Sporting',homeCode:'LIS',awayCode:'BAV',live:false,time:'Tomorrow · 19:30',odds:[2.6,3.4,2.5]},
{id:'f6',kickoffAt:'2026-10-04T20:00:00Z',sport:'Football',league:'Serie Masters',home:'Torino FC',away:'Napoli United',homeCode:'TOR',awayCode:'NAP',live:false,time:'Tomorrow · 21:00',odds:[1.95,3.3,3.8]},
{id:'f7',kickoffAt:'2026-10-02T16:00:00Z',sport:'Basketball',league:'National League',home:'Harbor Hawks',away:'Summit Wolves',homeCode:'HWK',awayCode:'WLV',live:true,time:'Q3 · 05:42',score:'72 : 68',odds:[1.65,2.3]},
{id:'f8',kickoffAt:'2026-10-02T18:00:00Z',sport:'Basketball',league:'Euro League',home:'Madrid Basket',away:'Athens City',homeCode:'MAD',awayCode:'ATH',live:true,time:'Q4 · 02:15',score:'84 : 81',odds:[1.8,2.05]},
{id:'f9',kickoffAt:'2026-10-02T17:15:00Z',sport:'Basketball',league:'Pro Cup',home:'Chicago Strikers',away:'Boston Knights',homeCode:'CHI',awayCode:'BOS',live:true,time:'Q2 · 08:10',score:'45 : 42',odds:[1.9,1.9]},
{id:'f10',kickoffAt:'2026-10-02T13:30:00Z',sport:'Tennis',league:'Open Series',home:'Alex Marin',away:'Luca Vale',homeCode:'MAR',awayCode:'VAL',live:true,time:'Set 2 · 4:3',score:'1 : 0',odds:[1.72,2.1]},
{id:'f11',kickoffAt:'2026-10-02T14:30:00Z',sport:'Tennis',league:'Grand Slam',home:'Carlos Santos',away:'Novak V',homeCode:'SAN',awayCode:'NOV',live:true,time:'Set 3 · 2:2',score:'1 : 1',odds:[1.85,1.95]},
{id:'f12',kickoffAt:'2026-10-02T16:00:00Z',sport:'Tennis',league:'World Tour',home:'Stefanos T',away:'Daniil M',homeCode:'STE',awayCode:'DAN',live:true,time:'Set 1 · 5:4',score:'0 : 0',odds:[2.1,1.75]},
];
export const initialState:DemoState={balance:1000,favorites:[],bets:[]};
export const money=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
export function toggleSelection(current:Selection[],next:Selection):Selection[]{const old=current.find(s=>s.fixtureId===next.fixtureId);const same=old?.outcome===next.outcome&&(old?.marketId||'match-winner')===(next.marketId||'match-winner');return [...current.filter(s=>s.fixtureId!==next.fixtureId),...(same?[]:[next])];}
export function quote(selections:Selection[],stake:number,mode:'single'|'accumulator') {return {cost:mode==='single'?stake*selections.length:stake,potential:mode==='single'?selections.reduce((n,s)=>n+stake*s.odds,0):stake*selections.reduce((n,s)=>n*s.odds,1)}}
export function placeBets(state:DemoState,selections:Selection[],stake:number,mode:'single'|'accumulator'):DemoState {
 if(!selections.length)throw new Error('Choose at least one outcome first.');
 if(!Number.isFinite(stake)||stake<=0||Math.abs(Math.round(stake*100)-stake*100)>1e-7)throw new Error('Enter a positive stake with up to two decimal places.');
 if(new Set(selections.map(s=>s.fixtureId)).size!==selections.length)throw new Error('Choose only one outcome per match.');
 if(selections.some(s=>s.suspended))throw new Error('Remove the suspended selection before placing a demo bet.');
 if(selections.some(s=>s.oddsChangedFrom!==undefined))throw new Error('Accept the updated odds before placing a demo bet.');
 const {cost}=quote(selections,stake,mode);if(cost>state.balance)throw new Error('Your demo balance is too low for this stake.');
 const groups=mode==='single'?selections.map(s=>[s]):[selections];
 const bets=groups.map((group,i):DemoBet=>({id:`${Date.now()}-${i}-${Math.random().toString(36).slice(2,7)}`,selections:group,stake,potential:Math.round(quote(group,stake,mode).potential*100)/100,mode,status:'Pending',createdAt:new Date().toISOString()}));
 return {...state,balance:Math.round((state.balance-cost)*100)/100,bets:[...bets,...state.bets]};
}
export function settleDemoBet(state:DemoState,id:string,status:Exclude<BetStatus,'Pending'>):DemoState {
 const bet=state.bets.find(b=>b.id===id);
 if(!bet)throw new Error('Demo bet not found.');
 if(bet.status!=='Pending')throw new Error('This demo bet is already settled.');
 const actualReturn=status==='Won'?bet.potential:status==='Void'?(bet.mode==='single'?bet.stake*bet.selections.length:bet.stake):0;
 return {...state,balance:Math.round((state.balance+actualReturn)*100)/100,bets:state.bets.map(b=>b.id===id?{...b,status,actualReturn,settledAt:new Date().toISOString()}:b)};
}
export function loadState():DemoState {try{const v=JSON.parse(localStorage.getItem('uno-demo-v1')||'null');if(v&&Number.isFinite(v.balance)&&v.balance>=0&&Array.isArray(v.favorites)&&v.favorites.every((x:unknown)=>typeof x==='string')&&Array.isArray(v.bets)&&v.bets.every((b:DemoBet)=>b&&Array.isArray(b.selections)&&Number.isFinite(b.stake)&&Number.isFinite(b.potential)))return v;}catch{/* Fresh demo if storage is unavailable. */}return {...initialState};}

export interface LiveBet {
  id: string;
  game: string;
  player: string;
  bet: number;
  multiplier: number;
  profit: number;
}

export interface ContestRank {
  rank: number;
  player: string;
  wager: number;
  prize: number;
}

export const initialLiveBets: LiveBet[] = [
  { id: 'lb1', game: 'Vatica - Voice of Lost Souls', player: 'Hidden', bet: 6.00, multiplier: 0.00, profit: -6.00 },
  { id: 'lb2', game: 'Eastern Fury', player: 'Egilsbalcers', bet: 9.58, multiplier: 0.00, profit: -9.58 },
  { id: 'lb3', game: 'Helios - Triple Sun', player: 'Munachimso', bet: 7.20, multiplier: 0.00, profit: -7.20 },
  { id: 'lb4', game: 'Super Golden Dragon', player: 'sharing_is_caring', bet: 959.20, multiplier: 12.00, profit: 10551.28 },
  { id: 'lb5', game: 'Johnny vs Chicken', player: 'deerobbo1107', bet: 95.90, multiplier: 0.19, profit: -76.72 },
  { id: 'lb6', game: 'Le Bandit Hold & Win', player: 'Gkpfcfe_succ', bet: 9.00, multiplier: 0.55, profit: -4.05 },
  { id: 'lb7', game: 'American Roulette', player: 'jighniusv', bet: 19.20, multiplier: 0.00, profit: -19.20 },
  { id: 'lb8', game: 'Blood Rebels', player: 'rexgv1f3esog', bet: 6.69, multiplier: 0.00, profit: -6.69 },
  { id: 'lb9', game: 'Dead Man\'s Bounty', player: 'Devastator', bet: 45.35, multiplier: 0.00, profit: -45.35 },
  { id: 'lb10', game: 'Triple Hop Pots', player: 'Vortex_Play', bet: 120.00, multiplier: 18.50, profit: 2100.00 },
];

export const highRollerBets: LiveBet[] = [
  { id: 'hr1', game: 'Super Golden Dragon', player: 'WhaleKing_99', bet: 2500.00, multiplier: 45.00, profit: 110000.00 },
  { id: 'hr2', game: 'Helios - Triple Sun', player: 'sharing_is_caring', bet: 1200.00, multiplier: 28.40, profit: 32880.00 },
  { id: 'hr3', game: 'Dead Man\'s Bounty', player: 'CryptoSamurai', bet: 850.00, multiplier: 52.00, profit: 43350.00 },
  { id: 'hr4', game: 'American Roulette', player: 'RoulettePro_88', bet: 3000.00, multiplier: 36.00, profit: 105000.00 },
  { id: 'hr5', game: 'Vatica - Voice of Lost Souls', player: 'Alpha_Rider', bet: 1500.00, multiplier: 18.20, profit: 25800.00 },
  { id: 'hr6', game: 'Le Bandit Hold & Win', player: 'GoldenLion', bet: 750.00, multiplier: 120.00, profit: 89250.00 },
];

export const contestRanks: ContestRank[] = [
  { rank: 1, player: 'WhaleKing_99', wager: 485900.00, prize: 5000.00 },
  { rank: 2, player: 'sharing_is_caring', wager: 392100.00, prize: 3000.00 },
  { rank: 3, player: 'CryptoSamurai', wager: 310450.00, prize: 2000.00 },
  { rank: 4, player: 'RoulettePro_88', wager: 289100.00, prize: 1500.00 },
  { rank: 5, player: 'Devastator', wager: 215400.00, prize: 1000.00 },
  { rank: 6, player: 'Alpha_Rider', wager: 198200.00, prize: 750.00 },
  { rank: 7, player: 'GoldenLion', wager: 164300.00, prize: 500.00 },
  { rank: 8, player: 'rexgv1f3esog', wager: 142100.00, prize: 400.00 },
  { rank: 9, player: 'Egilsbalcers', wager: 118900.00, prize: 300.00 },
  { rank: 10, player: 'Munachimso', wager: 94500.00, prize: 200.00 },
];


export function addDemoFunds(state:DemoState,amount:number):DemoState {
 if(!Number.isFinite(amount)||amount<1||amount>10000||Math.abs(Math.round(amount*100)-amount*100)>1e-7)throw new Error('Enter an amount from $1 to $10,000 with up to two decimal places.');
 const balance=Math.round((state.balance+amount)*100)/100;
 if(!Number.isSafeInteger(Math.round(balance*100)))throw new Error('The demo balance limit has been reached. Reset your account to continue.');
 return {...state,balance};
}
