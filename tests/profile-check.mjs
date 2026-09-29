import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
await mkdir('test-results/profile', { recursive: true });
try {
  for (const theme of ['dark', 'light', 'vibrant']) {
    for (const width of [360, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await page.addInitScript(theme => {
        localStorage.setItem('uno-theme', theme);
        if (!sessionStorage.getItem('profile-test-initialized')) {
          localStorage.setItem('uno-demo-login', 'true');
          localStorage.removeItem('uno-profile-preferences');
          sessionStorage.setItem('profile-test-initialized', 'true');
        }
      }, theme);
      await page.goto('http://127.0.0.1:5174/', {waitUntil:'domcontentloaded'});
      const tablet = width > 700 && width <= 1250;
      if (tablet) {
        await page.getByRole('button', { name: /Open demo wallet, balance/ }).click();
      }
      const trigger = tablet ? page.getByRole('button', { name: 'Open account menu', exact: true }) : width >= 1440 ? page.getByRole('button', { name: 'Open account menu', exact: true }) : page.getByRole('navigation', { name: 'Mobile', exact: true }).getByRole('button', { name: 'Account', exact: true });
      if (tablet) {
        await trigger.click();
        await expect(page.getByRole('menu', { name: 'Account options' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'View profile' }).click();
        await expect(page.getByRole('dialog', { name: 'Your profile', exact: true })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        console.log(`PASS ${theme} ${width}: tablet wallet avatar opens profile menu`);
        await page.close();
        continue;
      }
      const headerBefore = await page.locator('.topbar').boundingBox();
      const triggerBefore = await trigger.boundingBox();
      await trigger.click();
      const menu = page.getByRole('menu', { name: 'Account options' });
      await expect(menu).toBeVisible();
      await expect(page.getByRole('menuitem', { name: 'View profile' })).toBeFocused();
      const box = await menu.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y + box.height).toBeLessThanOrEqual(900);
      expect(await page.locator('.topbar').boundingBox()).toEqual(headerBefore);
      expect(await trigger.boundingBox()).toEqual(triggerBefore);
      await page.keyboard.press('ArrowDown');
      await expect(page.getByRole('menuitem', { name: 'Notifications' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(menu).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await trigger.click();
      if ((width === 390 || width === 1440) && theme === 'vibrant') await page.screenshot({ path: `test-results/profile/menu-${width}.png` });
      await page.getByRole('menuitem', { name: 'View profile' }).click();
      const profile = page.getByRole('dialog', { name: 'Your profile', exact: true });
      await expect(profile).toBeVisible();
      await expect(profile.getByText('UNO Player')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      await trigger.click();
      await page.getByRole('menuitem', { name: 'Notifications' }).click();
      await expect(page.getByText('1 unread', { exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Mark all as read' }).click();
      await expect(page.getByText('0 unread', { exact: true })).toBeVisible();
      await page.keyboard.press('Escape');
      await trigger.click();
      await page.getByRole('menuitem', { name: 'Settings' }).click();
      await page.getByRole('checkbox', { name: 'Demo notifications' }).uncheck();
      await page.reload();
      await trigger.click();
      await page.getByRole('menuitem', { name: 'Notifications' }).click();
      await expect(page.getByRole('heading', { name: 'Demo notifications are off' })).toBeVisible();
      await page.keyboard.press('Escape');
      await trigger.click();
      await page.getByRole('menuitem', { name: 'Settings' }).click();
      await page.getByRole('checkbox', { name: 'Demo notifications' }).check();
      await page.keyboard.press('Escape');
      await trigger.click();
      await page.getByRole('menuitem', { name: 'Notifications' }).click();
      await expect(page.getByText('0 unread', { exact: true })).toBeVisible();
      await page.keyboard.press('Escape');
      await trigger.click();
      await page.mouse.click(5, 400);
      await expect(menu).toHaveCount(0);
      const stateBefore = await page.evaluate(() => localStorage.getItem('uno-demo-v1'));
      await trigger.click();
      await page.getByRole('menuitem', { name: 'Log out' }).click();
      await expect(page.getByRole('button', { name: 'Log in', exact: true })).toBeVisible();
      await page.reload();
      await expect(page.getByRole('button', { name: 'Log in', exact: true })).toBeVisible();
      expect(await page.evaluate(() => localStorage.getItem('uno-demo-v1'))).toEqual(stateBefore);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.getByRole('button', { name: 'Log in', exact: true }).click();
      await page.getByRole('button', { name: 'Enter demo account' }).click();
      await page.getByRole('button', { name: /Open demo wallet, balance/ }).click();
      await expect(page.getByRole('dialog', { name: 'Your demo wallet' })).toBeVisible();
      console.log(`PASS ${theme} ${width}: menu, keyboard, dialogs, persistence, logout, wallet, geometry`);
      await page.close();
    }
  }
} finally { await browser.close(); }
