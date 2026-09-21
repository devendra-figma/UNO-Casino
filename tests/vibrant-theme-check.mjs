import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'msedge',headless:true});const p=await b.newPage({reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
const geometry=()=>[...document.querySelectorAll('main *, .topbar *, #uno-sidebar *, .mobile-nav *')].filter(e=>e.getClientRects().length&&!e.closest('.theme-toggle svg')).map(e=>{const r=e.getBoundingClientRect();return [e.tagName,r.x,r.y,r.width,r.height]});
const colors=()=>[...document.querySelectorAll('main *, .topbar *, #uno-sidebar *, .mobile-nav *')].map(e=>{const c=getComputedStyle(e);return [c.color,c.background,c.borderColor,c.boxShadow]});
async function select(name){await p.getByRole('button',{name:'Choose color theme',exact:true}).click();await p.getByRole('button',{name,exact:true}).click();}
try{
for(const width of [360,390,768,1440]){
 await p.setViewportSize({width,height:1000});
 for(const route of ['/','/casino','/sports','/promotions','/crash','/bets']){
  await p.goto('http://127.0.0.1:5173'+route);await p.evaluate(()=>document.fonts.ready);await select('Dark / Gold');const rect=await p.evaluate(geometry);
  for(const name of ['Light','Vibrant Preview','Dark / Gold']){
   await select(name);assert.deepEqual(await p.evaluate(geometry),rect,`${width} ${route} ${name} geometry`);
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(name!=='Vibrant Preview'){
    const before=await p.evaluate(colors);await p.evaluate(()=>{window.previewStyle=[...document.querySelectorAll('style')].find(e=>e.dataset.viteDevId?.endsWith('/src/vibrant-preview.css'));window.previewText=window.previewStyle.textContent;window.previewStyle.textContent='';});assert.deepEqual(await p.evaluate(colors),before);await p.evaluate(()=>window.previewStyle.textContent=window.previewText);
   }
  }
 }
 console.log('PASS',width,'six routes, identical geometry, original themes unchanged');
}
await select('Vibrant Preview');await p.reload();assert.equal(await p.locator('html').getAttribute('data-theme'),'vibrant');
await p.getByRole('button',{name:'Choose color theme'}).click();await p.keyboard.press('Escape');await p.waitForTimeout(50);assert.equal(await p.locator('.theme-toggle').getAttribute('aria-expanded'),'false');
await p.goto('http://127.0.0.1:5173');await p.locator('.odds-row button').first().click();await p.locator('.floating-slip').click();await p.locator('dialog').waitFor();await p.getByRole('button',{name:'Close dialog',exact:true}).click();
for(const width of [390,1440]){await p.setViewportSize({width,height:1000});await p.evaluate(()=>window.scrollTo(0,0));await p.screenshot({path:`test-results/vibrant-${width}.png`,fullPage:true});}
assert.deepEqual(errors,[]);console.log('PASS persistence, Escape, bet-slip interaction and no browser errors');
}finally{await b.close();}
