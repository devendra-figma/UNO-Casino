import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage();
const errors=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:5173'))missing.push(`${r.status()} ${r.url()}`);});
await mkdir('test-results',{recursive:true});
await page.addInitScript(()=>{document.modelContext={registerTool(tool){window.__unoTool=tool;}};});
try{
 for(const width of [320,360,390,430,768,1024,1440,1920]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/casino','/casino?category=Live%20casino','/sports','/bets']){
   await page.goto('http://127.0.0.1:5173'+route);await page.waitForSelector('h1');
   const sizes=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(sizes.scroll<=sizes.client,`${route} overflows at ${width}: ${JSON.stringify(sizes)}`);
   if(route==='/'&&[390,768,1440].includes(width)){
    await page.getByRole('button',{name:'Pause decorative animations'}).click();await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:`test-results/uno-home-${width}.png`,fullPage:true});
    if(width===390)await page.screenshot({path:'test-results/uno-mobile-first-screen.png'});
   }
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:5173/');
 await page.getByRole('button',{name:'Open menu',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Close menu',exact:true}).getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Open menu',exact:true}).count(),1);
 await page.getByRole('button',{name:'Northbridge FC versus Kingsport United: Northbridge FC at 1.85'}).click();await page.getByRole('button',{name:'Bet slip 1'}).click();await page.getByRole('dialog',{name:'Your bet slip'}).waitFor();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>!!document.activeElement?.closest('dialog')),true);await page.keyboard.press('Escape');
 await page.goto('http://127.0.0.1:5173/casino?category=Live%20casino');assert.ok(await page.locator('.game-card').count()>=16);
 await page.getByRole('button',{name:'Add American Roulette to favorites',exact:true}).click();await page.reload();assert.equal(await page.getByRole('button',{name:'Remove American Roulette from favorites',exact:true}).count(),1);
 await page.getByRole('button',{name:'Favorites',exact:true}).click();assert.equal(await page.locator('.game-card').count(),1);
 await page.getByRole('textbox',{name:'Search casino games'}).fill('missing game');await page.getByText('No games in this corner yet.').waitFor();await page.getByRole('button',{name:'Reset filters',exact:true}).click();
 await page.getByRole('button',{name:'Preview American Roulette',exact:true}).click();await page.getByRole('button',{name:'Launch demo preview'}).click();await page.getByText('You’re in preview mode.').waitFor();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Search games and matches'}).click();await page.getByPlaceholder('Search games, teams or leagues').fill('American Roulette');await page.locator('.search-results').getByRole('button',{name:/American Roulette/}).click();await page.getByRole('dialog',{name:'American Roulette',exact:true}).waitFor();await page.keyboard.press('Escape');
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:5173/sports');
 await page.getByRole('button',{name:'Northbridge FC versus Kingsport United: Northbridge FC at 1.85'}).click();await page.getByRole('button',{name:'Northbridge FC versus Kingsport United: Kingsport United at 4.20'}).click();assert.equal(await page.locator('.desktop-slip .slip-selection').count(),1);
 await page.getByRole('button',{name:'Real Aurora versus Milano City: Real Aurora at 2.15'}).click();const slip=page.locator('.desktop-slip');await slip.getByRole('button',{name:'Accumulator',exact:true}).click();await slip.getByRole('spinbutton',{name:'Stake'}).fill('1001');await slip.getByRole('button',{name:'Place demo bet'}).click();await slip.getByRole('alert').waitFor();
 await slip.getByRole('spinbutton',{name:'Stake'}).fill('10');await slip.getByRole('button',{name:'Place demo bet'}).click();await page.goto('http://127.0.0.1:5173/bets');await page.reload();assert.equal(await page.locator('.history-card').count(),1);assert.ok((await page.locator('.bets-summary').textContent()).includes('$990.00'));
 await page.getByRole('button',{name:'Log in',exact:true}).click();await page.getByRole('button',{name:'Enter demo account'}).click();await page.getByRole('button',{name:'Open demo account',exact:true}).click();await page.getByRole('button',{name:'Reset demo account'}).click();assert.ok((await page.locator('.crypto-wallet').textContent()).includes('$1,000.00'));await page.keyboard.press('Escape');
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:5173/');assert.equal(await page.locator('.uno-hero-art').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await page.getByRole('button',{name:'Pause decorative animations'}).isVisible(),false);
 const result=await page.evaluate(()=>{const t=window.__unoTool;const valid=t.execute({query:'American Roulette'});let failed=false;try{t.execute({query:2});}catch{failed=true;}return{valid,failed};});assert.equal(result.valid.length,1);assert.equal(result.failed,true);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);console.log('PASS: 40 route/viewport combinations (320–1920px), mobile menu, hero odds, bet sheet, live catalog/search/favorites, game dialog, staking validation, persistence/reset, reduced motion, images and browser errors.');
}finally{await browser.close();}
