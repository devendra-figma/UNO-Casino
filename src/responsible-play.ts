export type LimitKind = 'deposit' | 'wager' | 'loss';
export type LimitPeriod = 'daily' | 'weekly' | 'monthly';
export type LimitValues = Record<LimitPeriod, number | null>;
export type UsageEntry = { at:string; amount:number };
export type ResponsibleState = {
  limits:Record<LimitKind,LimitValues>;
  usage:Record<LimitKind,UsageEntry[]>;
  sessionMinutes:number|null;
  sessionStartedAt:string;
  realityMinutes:number|null;
  lastRealityAt:string;
  coolingUntil:string|null;
  excludedAt:string|null;
};
const blank=():LimitValues=>({daily:null,weekly:null,monthly:null});
export function initialResponsibleState(now=new Date()):ResponsibleState{return {limits:{deposit:blank(),wager:blank(),loss:blank()},usage:{deposit:[],wager:[],loss:[]},sessionMinutes:null,sessionStartedAt:now.toISOString(),realityMinutes:null,lastRealityAt:now.toISOString(),coolingUntil:null,excludedAt:null}}
export function loadResponsibleState():ResponsibleState {
  const base=initialResponsibleState();
  try {const saved=JSON.parse(localStorage.getItem('uno-responsible-play-v1')||'null');if(!saved||typeof saved!=='object')return base;
    for(const kind of ['deposit','wager','loss'] as LimitKind[]){for(const period of ['daily','weekly','monthly'] as LimitPeriod[]){const value=saved.limits?.[kind]?.[period];base.limits[kind][period]=typeof value==='number'&&Number.isFinite(value)&&value>0?value:null;}base.usage[kind]=Array.isArray(saved.usage?.[kind])?saved.usage[kind].filter((entry:UsageEntry)=>entry&&Number.isFinite(entry.amount)&&entry.amount>=0&&!Number.isNaN(Date.parse(entry.at))):[];}
    base.sessionMinutes=typeof saved.sessionMinutes==='number'&&saved.sessionMinutes>0?saved.sessionMinutes:null;
    base.realityMinutes=typeof saved.realityMinutes==='number'&&saved.realityMinutes>0?saved.realityMinutes:null;
    for(const key of ['sessionStartedAt','lastRealityAt','coolingUntil','excludedAt'] as const){const value=saved[key];if(typeof value==='string'&&!Number.isNaN(Date.parse(value)))base[key]=value;}
  }catch{/* Fresh local demo controls if storage is unavailable. */}
  return base;
}
export function periodRange(period:LimitPeriod,now=new Date()):{start:Date;reset:Date}{
  const start=new Date(now);start.setHours(0,0,0,0);
  if(period==='weekly')start.setDate(start.getDate()-((start.getDay()+6)%7));
  if(period==='monthly')start.setDate(1);
  const reset=new Date(start);
  if(period==='daily')reset.setDate(reset.getDate()+1);
  if(period==='weekly')reset.setDate(reset.getDate()+7);
  if(period==='monthly')reset.setMonth(reset.getMonth()+1);
  return {start,reset};
}
export function usedAmount(state:ResponsibleState,kind:LimitKind,period:LimitPeriod,now=new Date()):number{const {start}=periodRange(period,now);return Math.round(state.usage[kind].filter(e=>new Date(e.at)>=start&&new Date(e.at)<=now).reduce((sum,e)=>sum+e.amount,0)*100)/100}
export function sessionExpired(state:ResponsibleState,now=new Date()):boolean{const elapsed=now.getTime()-new Date(state.sessionStartedAt).getTime();return state.sessionMinutes!==null&&elapsed<86_400_000&&elapsed>=state.sessionMinutes*60_000}
export function playBlock(state:ResponsibleState,now=new Date()):string|null{
  if(state.excludedAt)return 'Self-exclusion is active in this local demo. Betting and deposits are unavailable.';
  if(state.coolingUntil&&now<new Date(state.coolingUntil))return `Cooling-off is active until ${new Date(state.coolingUntil).toLocaleString()}.`;
  if(sessionExpired(state,now))return 'Your session limit has been reached. End this session and return later.';
  return null;
}
export function limitBlock(state:ResponsibleState,kind:LimitKind,amount:number,now=new Date()):string|null{
  const block=playBlock(state,now);if(block)return block;
  if(kind==='wager'&&(['daily','weekly','monthly'] as LimitPeriod[]).some(p=>state.limits.loss[p]!==null&&usedAmount(state,'loss',p,now)>=state.limits.loss[p]!))return 'Your demo loss limit has been reached. Betting is unavailable until the limit resets.';
  for(const period of ['daily','weekly','monthly'] as LimitPeriod[]){const limit=state.limits[kind][period];if(limit!==null&&usedAmount(state,kind,period,now)+amount>limit+1e-7)return `Your ${period} ${kind} limit would be exceeded. Adjust the amount or wait until the limit resets.`;}
  return null;
}
export function addUsage(state:ResponsibleState,kind:LimitKind,amount:number,now=new Date()):ResponsibleState{return {...state,usage:{...state.usage,[kind]:[...state.usage[kind],{at:now.toISOString(),amount}]}}}
export function updateLimit(state:ResponsibleState,kind:LimitKind,period:LimitPeriod,value:number|null):ResponsibleState{
  if(value!==null&&(!Number.isFinite(value)||value<=0||Math.abs(Math.round(value*100)-value*100)>1e-7))throw new Error('Enter a positive USD limit with up to two decimal places.');
  // This is a local preview; strict delayed increases need server policy in production.
  return {...state,limits:{...state.limits,[kind]:{...state.limits[kind],[period]:value}}};
}
