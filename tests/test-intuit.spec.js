// @ts-check
import { test, expect } from '@playwright/test';
import secrets from '../secrets.json';

test('test intuit', async ({ page, context }) => {
  await page.goto('https://app.qbo.intuit.com/app/invoices');

  await page.getByTestId('IdentifierFirstInternationalUserIdInput').fill(secrets.email);
  await page.getByTestId('IdentifierFirstSubmitButton').click();
  await page.getByTestId('currentPasswordInput').fill(secrets.pass);
  await page.getByTestId('passwordVerificationContinueButton').click();
  await page.waitForURL('https://app.qbo.intuit.com/app/invoices?locale=en-us');

  const page2 = await context.newPage();
  await page2.goto('https://tsheets.intuit.com/');

  await page2.waitForURL('https://tsheets.intuit.com/');
  await page2.getByRole('link', { name: 'Time Entries' }).click();

  //sort by client
  await expect(page2.getByRole('button', { name: 'Client' })).toBeVisible();
  await page2.getByRole('button', { name: 'Client' }).click();

  //iterate over entries
  let rows = await page2.locator('tbody[class*="day-item"]').locator('tr').all();
  let timeEntries = [];
  await Promise.all(rows.map(async (row) => {
    timeEntries.push({
      name: await row.locator('td').nth(2).textContent(),
      time: await row.locator('td').nth(3).textContent(),
      duration: await row.locator('td').nth(4).textContent(),
      client: await row.locator('td').nth(5).textContent(),
      notes: await row.locator('td').nth(8).textContent()
    });
  }));
  console.log(timeEntries);

  // //

  // await page.getByLabel('Main', { exact: true }).getByRole('link', { name: 'Invoices' }).click();
  // await page.getByRole('link', { name: 'Clients', exact: true }).click();

  // await page.getByPlaceholder('Search').fill(timeEntries[0].client);
  // await page.locator('button[name*="CUSTOMER |"]').first().click();
  // await page.getByRole('main').locator('i').click();

});