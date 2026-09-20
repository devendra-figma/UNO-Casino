import {test} from 'node:test';
import assert from 'node:assert/strict';
import {addDemoFunds,initialState} from '../src/data.ts';
test('demo deposits preserve bets and favorites and add exact cents',()=>{const before={...initialState,balance:12.1,favorites:['crash-ignition']};const after=addDemoFunds(before,2.29);assert.equal(after.balance,14.39);assert.deepEqual(after.favorites,before.favorites);assert.equal(before.balance,12.1);});
test('demo deposits reject invalid amounts and unsafe balances',()=>{for(const amount of [0,-1,NaN,Infinity,.99,10000.01,1.001])assert.throws(()=>addDemoFunds(initialState,amount));assert.equal(addDemoFunds(initialState,10000).balance,11000);assert.throws(()=>addDemoFunds({...initialState,balance:Number.MAX_SAFE_INTEGER},100));});
