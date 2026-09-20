import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage();const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400&&r.url().includes('127.0.0.1'))errors.push(r.url());});
try{
for(const width of [360,390,768,1440]){
 await page.setViewportSize({width,height:1000});
 for(const route of ['/','/promotions','/crash','/sports']){
  await page.goto('http://127.0.0.1:5173'+route);await page.locator('h1').waitFor();
  await page.evaluate(()=>{document.documentElement.classList.add('motion-paused');document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible'));});
  await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${route} ${width}`);
  if([390,1440].includes(width))await page.screenshot({path:`test-results/new-${route.slice(1)||'home'}-${width}.png`,fullPage:true});
 }
}
await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:5173/');
await page.getByRole('button',{name:'Collapse sidebar',exact:true}).click();await page.reload();assert.equal(await page.getByRole('button',{name:'Expand sidebar',exact:true}).count(),1);
await page.screenshot({path:'test-results/new-collapsed.png'});
await page.getByRole('button',{name:'Expand sidebar',exact:true}).click();
await page.getByRole('button',{name:'Log in',exact:true}).click();await page.getByRole('button',{name:'Enter demo account'}).click();await page.getByRole('button',{name:'Deposit',exact:true}).click();
await page.getByRole('spinbutton',{name:'Demo deposit amount'}).fill('-1');await page.getByRole('button',{name:'Add demo funds'}).click();await page.getByRole('alert').waitFor();
await page.getByRole('spinbutton',{name:'Demo deposit amount'}).fill('250');await page.getByRole('button',{name:'Add demo funds'}).click();assert.ok((await page.locator('.deposit-balance').textContent()).includes('$1,250.00'));await page.screenshot({path:'test-results/new-deposit.png'});await page.keyboard.press('Escape');
await page.reload();assert.ok((await page.locator('.header-wallet').textContent()).includes('$1,250.00'));
for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`logged in overflow ${width}`);await page.screenshot({path:`test-results/new-wallet-${width}.png`});}
await page.setViewportSize({width:390,height:900});await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.locator('#uno-sidebar').getByRole('link',{name:'Promotions',exact:true}).click();await page.waitForURL('**/promotions');await page.locator('.promotion-card').first().waitFor();assert.equal(await page.locator('.promotion-card').count(),6);
await page.getByRole('button',{name:'Sports',exact:true}).click();assert.equal(await page.locator('.promotion-card').count(),2);await page.getByRole('button',{name:'View offer details'}).first().click();await page.locator('.promotion-terms').waitFor();
await page.goto('http://127.0.0.1:5173/crash');await page.getByRole('textbox',{name:'Search crash games'}).fill('nothing');await page.getByText('No Crash Games found.').waitFor();await page.getByRole('button',{name:'Clear search'}).click();
await page.getByRole('button',{name:'Add Ignition to favorites'}).click();await page.reload();await page.getByRole('button',{name:'Remove Ignition from favorites'}).waitFor();await page.getByRole('button',{name:'Preview Ignition'}).click();await page.getByRole('button',{name:'Launch demo preview'}).click();await page.getByText('You’re in preview mode.').waitFor();await page.keyboard.press('Escape');
await page.getByRole('button',{name:'Open demo account',exact:true}).click();await page.getByRole('button',{name:'Reset demo account'}).click();assert.ok((await page.locator('.crypto-wallet').textContent()).includes('$1,000.00'));await page.getByRole('button',{name:'Log out',exact:true}).click();await page.getByRole('button',{name:'Log in',exact:true}).waitFor();
assert.deepEqual(errors,[]);console.log('PASS: new routes at 4 widths, collapse persistence, login/logout, deposit validation and persistence, promotions filtering/details, crash search/favorites/preview, reset, no browser errors.');
}finally{await browser.close();}
