import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:1080});await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${width}`);
  assert.equal(await page.locator('.home-promo').count(),2);
  assert.equal(await page.locator('.home-collection .game-card:visible').count(),width<=700||width===1440?12:16);
  if(width===390)await page.screenshot({path:'test-results/polish-mobile.png',fullPage:true});
  if(width===1440){await page.screenshot({path:'public/desktop-review/expanded.png'});await page.screenshot({path:'test-results/polish-desktop-full.png',fullPage:true});
   await page.getByRole('button',{name:'Collapse sidebar',exact:true}).click();const sports=page.locator('#uno-sidebar').getByRole('link',{name:'Sports',exact:true});await sports.focus();await page.getByText('Sports',{exact:true}).filter({visible:true}).first().waitFor();assert.equal(await page.locator('.sidebar-tooltip').textContent(),'Sports');await page.keyboard.press('Escape');assert.equal(await page.locator('.sidebar-tooltip').getAttribute('data-visible'),'false');
   await page.locator('.uno-eyebrow').first().click();await page.mouse.move(900,50);await page.screenshot({path:'public/desktop-review/collapsed.png'});await page.getByRole('button',{name:'Expand sidebar',exact:true}).click();
   await page.locator('#uno-sidebar').getByRole('link',{name:'Live casino',exact:true}).click();await page.waitForURL('**/casino?category=Live%20casino');await page.locator('#uno-sidebar a[aria-current=page][aria-label="Live casino"]').waitFor();assert.equal(await page.locator('#uno-sidebar a[aria-current=page]').count(),1);assert.equal(await page.locator('#uno-sidebar a[aria-current=page]').getAttribute('aria-label'),'Live casino');
  }
 }
 await page.goto('http://127.0.0.1:5173/');await page.locator('.home-promo').first().click();await page.waitForURL('**/promotions?category=Casino&offer=welcome');await page.locator('.promotion-terms').waitFor();assert.equal(await page.locator('.promotion-card').count(),2);
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:5173/');await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.screenshot({path:'test-results/polish-mobile-menu.png'});await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Open menu',exact:true}).getAttribute('aria-expanded'),'false');
 assert.deepEqual(errors,[]);console.log('PASS: compact home at four widths, curated game counts, sidebar keyboard tooltips and Escape, route selection, targeted promotions and mobile drawer.');
}finally{await browser.close();}


