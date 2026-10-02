import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fixtures, toggleSelection, quote, type Selection } from '../src/data.ts';
import { additionalMarketCount, getMarketGroups } from '../src/markets.ts';

test('every fixture has a distinct, selectable set of fictional markets', () => {
  for (const fixture of fixtures) {
    const groups = getMarketGroups(fixture);
    const markets = groups.flatMap(group => group.markets);
    assert.ok(fixture.kickoffAt && !Number.isNaN(Date.parse(fixture.kickoffAt)));
    assert.equal(markets[0].id, 'match-winner');
    assert.deepEqual(markets[0].options.map(option => option.odds), fixture.odds);
    assert.equal(additionalMarketCount(fixture), markets.length - 1);
    assert.equal(new Set(markets.map(market => market.id)).size, markets.length);
    assert.ok(markets.every(market => market.options.length >= 2 && market.options.every(option => Number.isFinite(option.odds) && option.odds > 1)));
  }
});

test('market changes replace the same event while preserving selections from other events', () => {
  const winner: Selection = { fixtureId: 'f1', match: 'Northbridge FC vs Kingsport United', outcome: 'Northbridge FC', odds: 1.85, marketId: 'match-winner', market: 'Match Winner' };
  const firstGoal: Selection = { ...winner, marketId: 'first-goal', market: 'First Goal', odds: 1.86 };
  const otherEvent: Selection = { fixtureId: 'f2', match: 'Real Aurora vs Milano City', outcome: 'Real Aurora', odds: 2.15 };
  assert.deepEqual(toggleSelection([winner, otherEvent], firstGoal), [otherEvent, firstGoal]);
  assert.deepEqual(toggleSelection([firstGoal], firstGoal), []);
  assert.equal(quote([firstGoal, otherEvent], 20, 'accumulator').cost, 20);
});
