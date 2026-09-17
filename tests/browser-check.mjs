import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await mkdir('test-results',{recursive:true});
await page.addInitScript(()=>{document.modelContext={registerTool(tool){window.__aurelTool=tool;}};});
try{
for(const width of [360,390,768,1440]){
 await page.setViewportSize({width,height:1000});
 for(const route of ['/','/casino','/sports','/bets']){
  await page.goto('http://127.0.0.1:5173'+route);await page.waitForSelector('h1');
  const sizes=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(sizes.scroll<=sizes.client,`${route} overflows at ${width}: ${JSON.stringify(sizes)}`);
  if(route==='/')await page.screenshot({path:`test-results/home-${width}.png`,fullPage:true});
 }
}
await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:5173/casino');
await page.getByRole('button',{name:'Add Temple of Fortune to favorites'}).click();await page.reload();
assert.equal(await page.getByRole('button',{name:'Remove Temple of Fortune from favorites'}).count(),1);
await page.getByRole('button',{name:'Favorites',exact:true}).click();assert.equal(await page.locator('.game-card').count(),1);
await page.getByRole('textbox',{name:'Search casino games'}).fill('missing game');assert.equal(await page.getByText('No games in this corner yet.').count(),1);
await page.getByRole('button',{name:'Reset filters',exact:true}).click();
await page.getByRole('button',{name:'Preview Temple of Fortune',exact:true}).click();
await page.getByRole('button',{name:'Launch demo preview'}).click();await page.getByText('You’re in preview mode.').waitFor();
await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').count(),0);
await page.goto('http://127.0.0.1:5173/sports');
await page.getByRole('button',{name:'Northbridge FC versus Kingsport United: Northbridge FC at 1.85'}).click();
await page.getByRole('button',{name:'Northbridge FC versus Kingsport United: Kingsport United at 4.20'}).click();
assert.equal(await page.locator('.desktop-slip .slip-selection').count(),1);
await page.getByRole('button',{name:'Real Aurora versus Milano City: Real Aurora at 2.15'}).click();
const slip=page.locator('.desktop-slip');await slip.getByRole('button',{name:'Accumulator',exact:true}).click();await slip.getByRole('spinbutton',{name:'Stake'}).fill('1001');await slip.getByRole('button',{name:'Place demo bet'}).click();await slip.getByRole('alert').waitFor();
await slip.getByRole('spinbutton',{name:'Stake'}).fill('10');await slip.getByRole('button',{name:'Place demo bet'}).click();
await page.goto('http://127.0.0.1:5173/bets');assert.equal(await page.locator('.history-card').count(),1);await page.reload();assert.equal(await page.locator('.history-card').count(),1);assert.ok((await page.locator('.bets-summary').textContent()).includes('$990.00'));
await page.getByRole('button',{name:'Log in',exact:true}).click();await page.getByRole('button',{name:'Reset demo account'}).click();assert.ok((await page.locator('.account-wallet').textContent()).includes('$1,000.00'));
await page.keyboard.press('Escape');assert.equal(await page.locator('.history-card').count(),0);
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:5173/sports');await page.getByRole('button',{name:'Northbridge FC versus Kingsport United: Northbridge FC at 1.85'}).click();await page.getByRole('button',{name:'Bet slip 1'}).click();await page.getByRole('dialog',{name:'Your bet slip'}).waitFor();
await page.screenshot({path:'test-results/mobile-betslip.png',fullPage:true});
await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>!!document.activeElement?.closest('dialog')),true);await page.keyboard.press('Escape');
await page.getByRole('button',{name:'Search games and matches'}).click();await page.getByPlaceholder('Search games, teams or leagues').fill('Westhaven');await page.getByRole('button',{name:/Westhaven Athletic vs Eastford Rovers/}).click();await page.getByRole('button',{name:'Westhaven Athletic versus Eastford Rovers: Westhaven Athletic at 2.40'}).waitFor();
const result=await page.evaluate(()=>{const t=window.__aurelTool;const valid=t.execute({query:'Temple'});let failed=false;try{t.execute({query:2});}catch{failed=true;}return {name:t.name,valid,failed};});assert.equal(result.valid.length,1);assert.equal(result.failed,true);
assert.deepEqual(errors,[]);console.log('PASS: four routes at four sizes, favorites, empty filters, game preview, bet replacement, accumulator, invalid stake, persistence, reset, mobile slip, keyboard dialog, global search, WebMCP contract; no browser errors.');
}finally{await browser.close();}
