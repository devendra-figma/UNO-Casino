import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
await mkdir('test-results/profile', {recursive:true});
try {
 for (const theme of ['dark','light','vibrant']) {
  const page = await browser.newPage({viewport:{width:390,height:900},reducedMotion:'reduce'});
  await page.addInitScript(theme=>{localStorage.setItem('uno-theme',theme);if(!sessionStorage.getItem('profile-test')){localStorage.setItem('uno-demo-login','true');localStorage.removeItem('uno-profile-details');localStorage.removeItem('uno-profile-preferences');sessionStorage.setItem('profile-test','true');}},theme);
  await page.goto('http://127.0.0.1:5174/',{waitUntil:'domcontentloaded'});
  for(const width of [360,390,701,720,768,980,1024,1251,1440]) {
   await page.setViewportSize({width,height:900});
   const bell=page.getByRole('button',{name:'Open notifications',exact:true});
   await expect(bell).toBeVisible(); await bell.click();
   await expect(page.getByRole('dialog',{name:'Notifications',exact:true})).toBeVisible();
   await page.keyboard.press('Escape');await expect(bell).toBeFocused();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.getByRole('button',{name:'Open account menu',exact:true}).click();
  await page.getByRole('menuitem',{name:'View profile',exact:true}).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByLabel('Username',{exact:true})).toHaveAttribute('readonly','');
  await page.getByLabel('Full name',{exact:true}).fill('   ');
  await page.getByRole('button',{name:'Save changes'}).click();
  await expect(page.getByRole('alert')).toHaveText('Enter your name.');
  await page.getByLabel('Full name',{exact:true}).fill('Alex Morgan');
  await page.getByLabel('Email address',{exact:true}).fill('not-an-email');
  await page.getByRole('button',{name:'Save changes'}).click();
  expect(await page.getByLabel('Email address',{exact:true}).evaluate(e=>e.validity.valid)).toBe(false);
  await page.getByLabel('Email address',{exact:true}).fill('alex@example.com');
  await page.getByLabel('Phone number',{exact:true}).fill('+1 202 555 0100');
  await page.getByLabel('Country / region',{exact:true}).fill('United States');
  await page.getByRole('button',{name:'Save changes'}).click();
  await expect(page.getByText('Profile saved.',{exact:true})).toBeVisible();
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.getByLabel('Full name',{exact:true})).toHaveValue('Alex Morgan');
  await expect(page.getByLabel('Email address',{exact:true})).toHaveValue('alex@example.com');
  await expect(page.getByLabel('Phone number',{exact:true})).toHaveValue('+1 202 555 0100');
  await expect(page.getByLabel('Country / region',{exact:true})).toHaveValue('United States');
  await page.getByLabel('Full name',{exact:true}).fill('Unsaved');
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await expect(page.getByLabel('Full name',{exact:true})).toHaveValue('Alex Morgan');
  await page.getByRole('button',{name:'Open account menu',exact:true}).click();
  await expect(page.getByRole('menu').getByText('Alex Morgan',{exact:true})).toBeVisible();
  await page.getByRole('menuitem',{name:'Settings',exact:true}).click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('checkbox',{name:'Demo notifications'}).uncheck();
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.getByRole('checkbox',{name:'Demo notifications'})).not.toBeChecked();
  await page.getByRole('button',{name:'Open notifications',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Demo notifications are off'})).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('checkbox',{name:'Demo notifications'}).check();
  await page.getByRole('button',{name:'Open notifications',exact:true}).click();
  await page.getByRole('button',{name:'Mark all as read'}).click();
  await expect(page.getByText('0 unread',{exact:true})).toBeVisible();
  await page.keyboard.press('Escape');
  for(const width of [360,390,768,1440]){
   await page.setViewportSize({width,height:900});
   for(const path of ['/profile','/settings']){
    await page.goto('http://127.0.0.1:5174'+path,{waitUntil:'domcontentloaded'});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(theme==='vibrant'&&(width===390||width===1440)) await page.screenshot({path:`test-results/profile/${path.slice(1)}-${width}.png`});
   }
  }
  await page.getByRole('button',{name:'Open account menu',exact:true}).click();
  await page.getByRole('menuitem',{name:'Log out',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Sign in to your demo account'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Open notifications',exact:true})).toHaveCount(0);
  console.log(`PASS ${theme}: responsive bell, profile/settings routes, validation, save/cancel, persistence, readonly username, logout`);
  await page.close();
 }
} finally { await browser.close(); }
