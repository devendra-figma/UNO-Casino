import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
await mkdir('test-results/promotions-markets', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:5174/promotions');
  await expect(page.locator('.promotion-card')).toHaveCount(11);
  await page.getByRole('button', { name: 'Casino', exact: true }).click();
  await expect(page.locator('.promotion-card')).toHaveCount(7);
  for (const name of ['welcome', 'cashback', 'spins', 'reload', 'vip', 'referral']) {
    const response = await page.request.get(`http://127.0.0.1:5174/promotions/${name}.webp`);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/webp');
  }
  await page.locator('.promotion-card[href="/promotions/welcome"]').click();
  await expect(page).toHaveURL(/\/promotions\/welcome$/);
  await expect(page.getByText('35× bonus amount · illustrative')).toBeVisible();
  await page.getByRole('button', { name: 'Claim Now' }).click();
  await expect(page.getByRole('status')).toContainText('cannot be claimed');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'The golden welcome' })).toBeVisible();
  await page.goto('http://127.0.0.1:5174/');
  await page.locator('a[href*="offer=welcome"]').click();
  await expect(page).toHaveURL(/\/promotions\/welcome$/);
  await page.goto('http://127.0.0.1:5174/promotions/no-such-offer');
  await expect(page.getByText('Promotion unavailable.')).toBeVisible();

  await page.goto('http://127.0.0.1:5174/sports?tab=Live');
  const link = page.locator('.sports-matches .match-card').first().getByRole('link', { name: /additional markets/ });
  await expect(link).toContainText('+12 markets');
  await link.click();
  await expect(page).toHaveURL(/\/sports\/f1\/markets$/);
  await expect(page.getByText('Northbridge FC', { exact: true }).first()).toBeVisible();
  const groups = page.locator('.market-group');
  await expect(groups).toHaveCount(9);
  const main = page.getByRole('button', { name: 'Match Winner: Northbridge FC at 1.85' });
  await main.click();
  await expect(main).toHaveAttribute('aria-pressed', 'true');
  const doubleChance = page.getByRole('button', { name: 'Double Chance: Northbridge FC or Draw at 1.34' });
  await doubleChance.click();
  await expect(main).toHaveAttribute('aria-pressed', 'false');
  await expect(doubleChance).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.desktop-slip .slip-heading>span')).toHaveText('1');
  await doubleChance.click();
  await expect(page.locator('.desktop-slip .slip-heading>span')).toHaveText('0');
  await doubleChance.click();
  await groups.nth(2).locator('summary').click();
  await expect(groups.nth(2)).toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Total Goals 2.5: Over 2.5 at 1.88' }).click();
  await expect(groups.nth(2)).toHaveAttribute('open', '');
  await expect(page.locator('.desktop-slip .slip-heading>span')).toHaveText('1');
  await doubleChance.click();
  await page.getByRole('link', { name: 'All sports' }).click();
  await page.locator('.sports-matches .match-card').nth(1).getByRole('link', { name: /additional markets/ }).click();
  await page.getByRole('button', { name: 'Match Winner: Real Aurora at 2.15' }).click();
  await expect(page.locator('.desktop-slip .slip-heading>span')).toHaveText('2');
  await page.locator('.desktop-slip').getByRole('button', { name: 'Accumulator' }).click();
  await page.locator('.desktop-slip').getByRole('spinbutton', { name: 'Stake' }).fill('20');
  await expect(page.locator('.desktop-slip .potential')).toContainText('$57.62');
  await page.locator('.desktop-slip').getByRole('button', { name: 'Place demo bet' }).click();
  await expect(page.getByRole('status')).toContainText('Demo bet placed');
  await page.goto('http://127.0.0.1:5174/bets');
  await expect(page.locator('.history-card')).toHaveCount(1);
  await expect(page.locator('.history-card')).toContainText('$57.62');
  await page.goto('http://127.0.0.1:5174/sports/unknown/markets');
  await expect(page.getByText('Event unavailable.')).toBeVisible();
  await page.close();

  for (const theme of ['dark', 'light', 'vibrant']) {
    for (const width of [360, 390, 768, 1440]) {
      const view = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await view.addInitScript(theme => localStorage.setItem('uno-theme', theme), theme);
      for (const route of ['/promotions', '/promotions/welcome', '/sports/f1/markets']) {
        await view.goto(`http://127.0.0.1:5174${route}`, { waitUntil: 'domcontentloaded' });
        expect(await view.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (theme === 'vibrant' && (width === 390 || width === 1440)) await view.screenshot({ path: `test-results/promotions-markets/${route.replaceAll('/', '-')}-${width}.png` });
      }
      await view.getByRole('button', { name: 'Match Winner: Northbridge FC at 1.85' }).click();
      if (width <= 980) {
        await view.getByRole('button', { name: /Bet slip 1/ }).click();
        await expect(view.getByRole('dialog', { name: 'Your bet slip' })).toBeVisible();
      } else await expect(view.locator('.desktop-slip .slip-heading>span')).toHaveText('1');
      console.log(`PASS ${theme} ${width}: direct routes, layouts, odds and bet slip`);
      await view.close();
    }
  }
} finally { await browser.close(); }
