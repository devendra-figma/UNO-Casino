import test from 'node:test';
import assert from 'node:assert/strict';
import { addUsage, initialResponsibleState, limitBlock, periodRange, playBlock, updateLimit, usedAmount } from '../src/responsible-play.ts';

const date=new Date('2026-10-03T12:00:00Z');
test('daily, weekly, and monthly counters reset at their calendar boundaries',()=>{
  const state=addUsage(initialResponsibleState(date),'deposit',25,new Date('2026-10-02T12:00:00Z'));
  assert.equal(usedAmount(state,'deposit','daily',date),0);
  assert.equal(usedAmount(state,'deposit','weekly',date),25);
  assert.equal(usedAmount(state,'deposit','monthly',date),25);
  assert.ok(periodRange('daily',date).reset>date);
});
test('deposit and betting limits block excess but allow exact remainder',()=>{
  let state=updateLimit(initialResponsibleState(date),'deposit','daily',50);
  state=addUsage(state,'deposit',20,date);
  assert.equal(limitBlock(state,'deposit',30,date),null);
  assert.match(limitBlock(state,'deposit',31,date)!,/daily deposit limit/);
  state=updateLimit(state,'wager','weekly',10);
  assert.match(limitBlock(state,'wager',11,date)!,/weekly wager limit/);
});
test('settled loss cap, cooling-off, session limit, and exclusion block actions',()=>{
  let state=updateLimit(initialResponsibleState(date),'loss','daily',20);
  state=addUsage(state,'loss',20,date);
  assert.match(limitBlock(state,'wager',1,date)!,/loss limit/);
  state={...state,coolingUntil:new Date(date.getTime()+86_400_000).toISOString()};
  assert.match(playBlock(state,date)!,/Cooling-off/);
  state={...state,coolingUntil:null,sessionMinutes:30,sessionStartedAt:new Date(date.getTime()-31*60_000).toISOString()};
  assert.match(playBlock(state,date)!,/session limit/);
  state={...state,excludedAt:date.toISOString()};
  assert.match(playBlock(state,date)!,/Self-exclusion/);
});
