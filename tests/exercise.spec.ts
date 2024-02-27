import { test, expect, Page } from '@playwright/test';
import { login } from './profileLogin';


test.beforeEach(async ({ page }) => {
    // Login vor jedem Test
    await login(page);
    await page.goto("localhost:8050/exercises");
});

test('change Squat Exercise value', async ({ page }) => {

    const newExerciseValue = "Lowbar - Squat Test";

    await page.locator('input[name="\\31 _0_exercise"]').click();
    await page.locator('input[name="\\31 _0_exercise"]').fill(newExerciseValue);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Erfolgreich aktualisiert ×')).toBeVisible();

    await page.reload();

    const savedValue = await page.locator('input[name="\\31 _0_exercise"]').inputValue();
    expect(savedValue).toBe(newExerciseValue);
});

test("add new squat exercise", async ({ page }) => {

    const newExerciseValue = "New squat exercise";

    await page.locator('input[name="\\31 _7_exercise"]').click();
    await page.locator('input[name="\\31 _7_exercise"]').fill(newExerciseValue);
    await page.getByRole('button', { name: 'Submit' }).click();

    await page.reload();

    const savedValue = await page.locator('input[name="\\31 _7_exercise"]').inputValue();
    expect(savedValue).toBe(newExerciseValue);

})

test("change default exercise category meta data (pauseTime, sets, reps, targetRPE)", async ({ page }) => {

    const newPauseTime = "90";
    const newSets = "2";
    const newReps = "10";
    const newTargetRPE = "7";

    await page.locator('select[name="\\31 _categoryPauseTimeSelect"]').selectOption(newPauseTime);
    await page.locator('select[name="\\31 _categoryDefaultSetSelect"]').selectOption(newSets);
    await page.locator('select[name="\\31 _categoryDefaultRepSelect"]').selectOption(newReps);
    await page.locator('select[name="\\31 _categoryDefaultRPESelect"]').selectOption(newTargetRPE);
    await page.getByRole('button', { name: 'Submit' }).click();

    await page.reload();

    const savedPauseTime = await page.locator('select[name="\\31 _categoryPauseTimeSelect"]').inputValue();
    const savedSets = await page.locator('select[name="\\31 _categoryDefaultSetSelect"]').inputValue();
    const savedReps = await page.locator('select[name="\\31 _categoryDefaultRepSelect"]').inputValue();
    const savedTargetRPE = await page.locator('select[name="\\31 _categoryDefaultRPESelect"]').inputValue();


    expect(savedPauseTime).toBe(newPauseTime);
    expect(savedSets).toBe(newSets);
    expect(savedReps).toBe(newReps);
    expect(savedTargetRPE).toBe(newTargetRPE);
})

test("reset exercises", async ({ page }) => {
    await page.locator('tr:nth-child(8) > td').first().click();

    await page.locator('input[name="\\31 _7_exercise"]').fill('Neuer Squat');
    await page.locator('input[name="\\31 _0_exercise"]').click();
    await page.locator('input[name="\\31 _0_exercise"]').fill('Lowbar - Squat 2');
    await page.getByRole('button', { name: 'Submit' }).click();

    await page.goto('http://localhost:8050/exercises');
    await page.getByRole('button', { name: 'Reset' }).click();

    await expect(page.locator('input[name="\\31 _0_exercise"]')).toHaveValue('Lowbar - Squat');
    await expect(page.locator('input[name="\\31 _7_exercise"]')).toHaveValue("");
})

// TODO pause time for leg and biceps may be wrong test this. if pause time in legs are changed it is applied in biceps legs are not saved @all

test("change values for leg exercises (edge case index = 10)", async ({ page }) => {
    await page.locator('input[name="\\31 0_7_exercise"]').click();
    await page.locator('input[name="\\31 0_7_exercise"]').fill('Nordic Hamstring Curls');
    await page.locator('select[name="\\31 0_categoryPauseTimeSelect"]').selectOption('180');
    await page.locator('select[name="\\31 0_categoryDefaultRepSelect"]').selectOption('8');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Erfolgreich aktualisiert ×')).toBeVisible();

    await page.reload();

    await expect(page.locator('input[name="\\31 0_7_exercise"]')).toHaveValue('Nordic Hamstring Curls');
    await expect(page.locator('select[name="\\31 0_categoryPauseTimeSelect"]')).toHaveValue('180');
    await expect(page.locator('select[name="\\31 0_categoryDefaultRepSelect"]')).toHaveValue('8');
})

test("delete a bench exercise", async({ page }) => {
    await page.locator('input[name="\\32 _7_exercise"]').click();
    await page.locator('input[name="\\32 _7_exercise"]').fill('');
    await page.locator('input[name="\\32 _7_exercise"]').press('Enter');

    await expect(page.getByText('Erfolgreich aktualisiert ×')).toBeVisible();
    await page.reload();
    await expect(page.locator('input[name="\\32 _7_exercise"]')).toBeEmpty();
})

// Stelle die ursprünglichen Daten wieder her
test.afterAll(async ({ page }) => {
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.reload();
})





