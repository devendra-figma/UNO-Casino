import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'msedge',headless:true});const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
async function samples(selector,property,ms=750){return p.locator(selector).first().evaluate((el,{property,ms})=>new Promise(resolve=>{const values=[];const start=performance.now();function read(){const s=getComputedStyle(el);values.push(property==='opacity'?Number(s.opacity):(s.transform==='none'?0:new DOMMatrix(s.transform).m42));if(performance.now()-start<ms)requestAnimationFrame(read);else resolve(values);}requestAnimationFrame(read);}),{property,ms});}
try{
 await p.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
 await p.locator('.category-tile').first().scrollIntoViewIfNeeded();await p.waitForTimeout(900);
 await p.locator('.category-tile').first().hover();let v=await samples('.category-tile','transform');assert.ok(v.some(x=>x<-.1&&x>-2.95),'lift interpolates');assert.ok(Math.abs(v.at(-1)+3)<.01,'lift settles at 3px');assert.ok(v.every(x=>x>=-3.05),'no bounce overshoot');
 await p.mouse.move(1200,100);v=await samples('.category-tile','transform');assert.ok(v.some(x=>x<-.01&&x>-2.99),'return interpolates');assert.ok(Math.abs(v.at(-1))<.01);
 const game=p.locator('.game-art').first();await game.hover();v=await samples('.play-overlay','opacity',500);assert.ok(v.some(x=>x>0&&x<1),'game overlay fades in');assert.equal(v.at(-1),1);
 await p.mouse.move(1200,100);v=await samples('.play-overlay','opacity',500);assert.ok(v.some(x=>x>0&&x<1),'game overlay fades out');assert.equal(v.at(-1),0);
 await game.focus();await p.keyboard.press('Enter');await p.getByRole('dialog').waitFor();await p.keyboard.press('Escape');
 await p.evaluate(()=>window.scrollTo(0,0));await p.getByRole('button',{name:'Collapse sidebar',exact:true}).click();await p.locator('#uno-sidebar').getByRole('link',{name:'Sports',exact:true}).focus();await p.locator('.sidebar-tooltip[data-visible=true]').waitFor();await p.keyboard.press('Escape');await p.locator('.sidebar-tooltip').waitFor({state:'hidden'});
 await p.emulateMedia({reducedMotion:'reduce'});await p.locator('.category-tile').first().hover();assert.equal(await p.locator('.category-tile').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0s');assert.equal(await p.locator('.category-tile').first().evaluate(e=>getComputedStyle(e).transform),'none');
 const mobile=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await mobile.goto('http://127.0.0.1:5173/');await mobile.locator('.game-art').first().tap();await mobile.getByRole('dialog').waitFor();await mobile.close();
 assert.deepEqual(errors,[]);console.log('PASS: hover enters and reverses smoothly without overshoot, overlay fades both ways, keyboard previews and tooltip dismissal, reduced-motion suppression and touch preview.');
}finally{await b.close();}
