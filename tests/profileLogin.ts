import { Page } from '@playwright/test';

export const login = async (page: Page) => {
    // Login vor jedem Test
    await page.goto(`localhost:8050/login`);
    await page.getByPlaceholder('Username or Email').click();
    await page.getByPlaceholder('Username or Email').fill('y');
    await page.getByPlaceholder('***********').click();
    await page.getByPlaceholder('***********').fill('y');
    await page.getByRole('button', { name: 'Login' }).click();

    // Warte auf den Redirect nach dem Login
    await page.waitForURL('http://localhost:8050/');
    // Optional: Überprüfe hier, ob der Login erfolgreich war und ggf. weitere Aktionen ausführen
};