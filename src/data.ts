export interface Game {id:string;name:string;provider:string;category:'Slots'|'Live casino'|'Originals';tile:number;tag?:string}
export interface Fixture {id:string;sport:string;league:string;home:string;away:string;homeCode:string;awayCode:string;live:boolean;time:string;score?:string;odds:number[]}
export interface Selection {fixtureId:string;match:string;outcome:string;odds:number}
export interface DemoBet {id:string;selections:Selection[];stake:number;potential:number;mode:'single'|'accumulator';status:'Pending';createdAt:string}
export interface DemoState {balance:number;favorites:string[];bets:DemoBet[]}
export const games:Game[]=[
{id:'temple',name:'Temple of Fortune',provider:'Aurel Studios',category:'Slots',tile:0,tag:'POPULAR'},
{id:'cosmic',name:'Cosmic Odyssey',provider:'Orbit Games',category:'Slots',tile:1,tag:'NEW'},
{id:'horus',name:'Eye of Horus',provider:'Aurel Studios',category:'Slots',tile:2},
{id:'dragon',name:'Dragon’s Fortune',provider:'Ember Play',category:'Slots',tile:3,tag:'HOT'},
{id:'frost',name:'Frozen Treasures',provider:'Orbit Games',category:'Originals',tile:4},
{id:'roulette',name:'Roulette Privé',provider:'Aurel Studios',category:'Live casino',tile:5,tag:'LIVE'},
{id:'blackjack',name:'Midnight Blackjack',provider:'Ember Play',category:'Live casino',tile:5},
{id:'nova',name:'Nova Rush',provider:'Orbit Games',category:'Originals',tile:1},
];
export const fixtures:Fixture[]=[
{id:'f1',sport:'Football',league:'Premier Division',home:'Northbridge FC',away:'Kingsport United',homeCode:'NFC',awayCode:'KPU',live:true,time:'67′ · 2nd half',score:'2 : 1',odds:[1.85,3.6,4.2]},
{id:'f2',sport:'Football',league:'European Cup',home:'Real Aurora',away:'Milano City',homeCode:'RAU',awayCode:'MIL',live:true,time:'34′ · 1st half',score:'0 : 0',odds:[2.15,3.25,3.4]},
{id:'f3',sport:'Football',league:'Premier Division',home:'Westhaven Athletic',away:'Eastford Rovers',homeCode:'WHA',awayCode:'EFR',live:false,time:'Today · 20:45',odds:[2.4,3.1,2.9]},
{id:'f4',sport:'Basketball',league:'National League',home:'Harbor Hawks',away:'Summit Wolves',homeCode:'HWK',awayCode:'WLV',live:true,time:'Q3 · 05:42',score:'72 : 68',odds:[1.65,2.3]},
{id:'f5',sport:'Tennis',league:'Open Series',home:'Alex Marin',away:'Luca Vale',homeCode:'MAR',awayCode:'VAL',live:false,time:'Tomorrow · 14:00',odds:[1.72,2.1]},
{id:'f6',sport:'Football',league:'European Cup',home:'Lisbon Stars',away:'Bavaria Sporting',homeCode:'LIS',awayCode:'BAV',live:false,time:'Tomorrow · 19:30',odds:[2.6,3.4,2.5]},
];
export const initialState:DemoState={balance:1000,favorites:[],bets:[]};
export const money=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
export function toggleSelection(current:Selection[],next:Selection):Selection[]{const old=current.find(s=>s.fixtureId===next.fixtureId);return [...current.filter(s=>s.fixtureId!==next.fixtureId),...(old?.outcome===next.outcome?[]:[next])];}
export function quote(selections:Selection[],stake:number,mode:'single'|'accumulator') {return {cost:mode==='single'?stake*selections.length:stake,potential:mode==='single'?selections.reduce((n,s)=>n+stake*s.odds,0):stake*selections.reduce((n,s)=>n*s.odds,1)}}
export function placeBets(state:DemoState,selections:Selection[],stake:number,mode:'single'|'accumulator'):DemoState {
 if(!selections.length)throw new Error('Choose at least one outcome first.');
 if(!Number.isFinite(stake)||stake<=0||Math.abs(Math.round(stake*100)-stake*100)>1e-7)throw new Error('Enter a positive stake with up to two decimal places.');
 if(new Set(selections.map(s=>s.fixtureId)).size!==selections.length)throw new Error('Choose only one outcome per match.');
 const {cost}=quote(selections,stake,mode);if(cost>state.balance)throw new Error('Your demo balance is too low for this stake.');
 const groups=mode==='single'?selections.map(s=>[s]):[selections];
 const bets=groups.map((group,i):DemoBet=>({id:`${Date.now()}-${i}-${Math.random().toString(36).slice(2,7)}`,selections:group,stake,potential:Math.round(quote(group,stake,mode).potential*100)/100,mode,status:'Pending',createdAt:new Date().toISOString()}));
 return {...state,balance:Math.round((state.balance-cost)*100)/100,bets:[...bets,...state.bets]};
}
export function loadState():DemoState {try{const v=JSON.parse(localStorage.getItem('aurel-demo-v1')||'null');if(v&&Number.isFinite(v.balance)&&v.balance>=0&&Array.isArray(v.favorites)&&v.favorites.every((x:unknown)=>typeof x==='string')&&Array.isArray(v.bets)&&v.bets.every((b:DemoBet)=>b&&Array.isArray(b.selections)&&Number.isFinite(b.stake)&&Number.isFinite(b.potential)))return v;}catch{/* Fresh demo if storage is unavailable. */}return {...initialState};}
