import { test, expect} from '@playwright/test';

test('Should create new equipment with valid data', async ({ page }) => {
  await page.goto('http://localhost:3000/'); // Navigate to the create equipment page

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Management/);

  const equipmentFormButton = page.locator('button:has-text("Equipment Form")');

  // Wait for the button to be visible
  await equipmentFormButton.waitFor({ state: 'visible', timeout: 60000 });

  // Click on the Equipment Form button
  await equipmentFormButton.click();

  // Click on the Equipment Form tab
  await page.click('button:has-text("Equipment Form")');

  // Fill in the form with valid equipment data
  await page.fill('input[name="name"]', 'New Equipment'); // Targeting name input
  await page.fill('input[name="location"]', 'New Location'); // Targeting location input
  await page.selectOption('select[name="department"]', { value: 'Machining' });  // Example using the value 'Machining'
  await page.fill('input[name="model"]', 'New Model'); // Targeting model input
  await page.fill('input[name="serialNumber"]', 'New Serial Number'); // Targeting serial number input
  await page.fill('input[name="installDate"]', '2024-06-15');  // Use the correct date format (YYYY-MM-DD)
  await page.selectOption('select[name="status"]', { value: 'Operational' });  // Example using the value 'Operational'

  // Handle the alert popup
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Equipment created successfully!');
    await dialog.accept(); // Dismiss the alert
  });

  // Submit the form
  await page.click('button[type="submit"]');

  // Ensure we're on the Equipment Table view
  await page.click('button:has-text("Equipment Table")');
});

