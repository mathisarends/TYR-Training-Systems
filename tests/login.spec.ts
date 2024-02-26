import { test, expect } from '@playwright/test';
import dotenv from "dotenv";
import { login } from './profileLogin';

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

test.beforeEach(async ({ page }) => {
  // Login vor jedem Test
  await login(page);

});

test("check invalid login data", async({ page }) => {
  await page.goto('http://localhost:8050/');
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByPlaceholder('Username or Email').click();
  await page.getByPlaceholder('Username or Email').fill('asd');
  await page.getByPlaceholder('***********').click();
  await page.getByPlaceholder('***********').fill('asd');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('main')).toContainText('Nutzer nicht gefunden');
})

test("login with email", async({ page }) => {
  await page.goto('http://localhost:8050/');
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByPlaceholder('Username or Email').click();
  await page.getByPlaceholder('Username or Email').fill('y@y');
  await page.getByPlaceholder('***********').click();
  await page.getByPlaceholder('***********').fill('y');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL('http://localhost:8050/');
  expect(page.url()).toBe('http://localhost:8050/');

})

test("check url after login", async ({ page }) => {

  let currentUrl = page.url();
  expect(currentUrl).toBe('http://localhost:8050/');
  await page.goto(`localhost:8050/training`);

  currentUrl = page.url();
  expect(currentUrl).toBe('http://localhost:8050/training');

});



