import { test, expect, Page } from '@playwright/test';
import { login } from './profileLogin';

const originalUserName = "y";
const originalEmail = "y@y";
const originalUserDescription = "Ich bin nur ein Test user";


test.beforeEach(async ({ page }) => {
  // Login vor jedem Test
  await login(page);
});

test('test modal appearance', async ({ page }) => {
  await page.getByRole('link', { name: 'Profile' }).click();
  await page.getByPlaceholder('Schreib etwas über dich').click();
  await page.getByPlaceholder('Schreib etwas über dich').fill('Test');
  await page.getByRole('button', { name: 'Edit profile' }).click();

  await expect(page.getByText('Erfolgreich aktualisiert ×')).toBeVisible(); // Modal appears and indicates proper saving
});

test("test actualized values for username email and description", async ({ page }) => {

  const newUsername = "yy";
  const newEmail = "yy@yy";
  const newDescription = "Description Test";

  await page.getByRole('link', { name: 'Profile' }).click();


  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill(newUsername);

  await page.locator('input[name="email"]').click();
  await page.locator('input[name="email"]').fill(newEmail);

  await page.getByPlaceholder('Schreib etwas über dich').click();
  await page.getByPlaceholder('Schreib etwas über dich').fill(newDescription);


  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.reload();
  await page.waitForLoadState('domcontentloaded');

  // Klicke erneut auf das Input-Feld nach der Neuverladung
  const name = await await page.locator('input[name="name"]').inputValue();
  const email = await page.locator('input[name="email"]').inputValue();
  const description = await page.getByPlaceholder('Schreib etwas über dich').inputValue();

  expect(name).toBe(newUsername);
  expect(email).toBe(newEmail);
  expect(description).toBe(newDescription);
})

/* test("navigate to exercise Page", async ({ page }) => {

})

test("navigate to volume page", async({ page }) => {

}) */

test.afterEach(async ({ page }) => {
    // Stelle die ursprünglichen Daten wieder her
    await page.getByRole('link', { name: 'Profile' }).click();
    await page.getByPlaceholder('Schreib etwas über dich').click();

    await page.locator('input[name="name"]').fill(originalUserName);
    await page.locator('input[name="email"]').fill(originalEmail);
    await page.getByPlaceholder('Schreib etwas über dich').fill(originalUserDescription);
    await page.getByRole('button', { name: 'Edit profile' }).click();

    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // assertions
    const name = await await page.locator('input[name="name"]').inputValue();
    const email = await page.locator('input[name="email"]').inputValue();
    const description = await page.getByPlaceholder('Schreib etwas über dich').inputValue();

    expect(name).toBe(originalUserName);
    expect(email).toBe(originalEmail);
    expect(description).toBe(originalUserDescription);
})





