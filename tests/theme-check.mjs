import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const geometry=()=>Array.from(document.querySelectorAll('main *, .topbar *, #uno-sidebar *, .mobile-nav *')).filter(e=>e.getClientRects().length&&!e.closest(".theme-toggle svg")).map(e=>{const r=e.getBoundingClientRect();return [e.tagName,e.className,r.x,r.y,r.width,r.height]});
for(const width of [360,390,768,1440]){
 await page.setViewportSize({width,height:1000});
 for(const path of ['/','/casino','/sports','/promotions','/crash','/bets']){
 await page.goto('http://127.0.0.1:5173'+path);await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>{document.documentElement.dataset.theme='dark';localStorage.setItem('uno-theme','dark')});await page.reload();await page.evaluate(()=>document.fonts.ready);
 const before=await page.evaluate(geometry);
 await page.getByRole('button',{name:'Light mode',exact:true}).click();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 const after=await page.evaluate(geometry);assert.deepEqual(after,before,`Geometry changed ${width} ${path}`);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${width} ${path}`);
 if(path==='/'&&(width===390||width===1440))await page.screenshot({path:`test-results/theme-light-${width}.png`,fullPage:true});
 }
 console.log('PASS',width,'six routes, identical theme geometry, no overflow');
}
await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
await page.getByRole('button',{name:'Light mode',exact:true}).click();await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
assert.deepEqual(errors,[]);await browser.close();console.log('PASS theme persistence and no browser errors');
