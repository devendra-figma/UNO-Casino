import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, placeBets, settleDemoBet, toggleSelection, type Selection } from '../src/data.ts';
import { fixtures } from '../src/data.ts';
import { leaguesFor, sportPath } from '../src/sportsbook-data.ts';

const first:Selection={fixtureId:'f1',match:'Northbridge FC vs Kingsport United',outcome:'Northbridge FC',odds:1.85};
const second:Selection={fixtureId:'f2',match:'Real Aurora vs Milano City',outcome:'Real Aurora',odds:2.15};
test('sport and league navigation derives from existing fixtures',()=>{
 assert.equal(sportPath('Football'),'/sports/sport/Football');
 assert.ok(leaguesFor('Football').includes('Premier Division'));
 assert.ok(fixtures.some(f=>f.league==='Premier Division'));
});
test('one selection per event replaces rather than duplicates',()=>{
 const next=toggleSelection([first],{...first,outcome:'Kingsport United',odds:4.2});
 assert.equal(next.length,1);assert.equal(next[0].outcome,'Kingsport United');
});
test('odds change must be accepted and suspended selections cannot be placed',()=>{
 assert.throws(()=>placeBets(initialState,[{...first,oddsChangedFrom:1.85,odds:1.97}],10,'single'),/Accept/);
 assert.throws(()=>placeBets(initialState,[{...first,suspended:true}],10,'single'),/suspended/);
});
test('accumulator settlement credits won or void return only once',()=>{
 const placed=placeBets(initialState,[first,second],10,'accumulator');
 assert.equal(placed.balance,990);
 const won=settleDemoBet(placed,placed.bets[0].id,'Won');
 assert.equal(won.bets[0].status,'Won');
 assert.equal(won.balance,Math.round((990+placed.bets[0].potential)*100)/100);
 assert.throws(()=>settleDemoBet(won,won.bets[0].id,'Lost'),/already settled/);
 const voided=settleDemoBet(placed,placed.bets[0].id,'Void');
 assert.equal(voided.balance,1000);
});
