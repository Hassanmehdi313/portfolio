const { test, expect } = require('@playwright/test');

// List of pages to test general navigation
const pages = [
  '/',
  '/index.html',
  '/contact-page.html',
  '/projects-page.html',
  '/resume.html',
  '/skills-page.html',
  '/social-media.html',
];

test.describe('Portfolio site thorough UI testing', () => {

  pages.forEach((page) => {
    test(`Navigate to ${page} and check for main content visibility`, async ({ page: browserPage }) => {
      await browserPage.goto(`http://localhost:5500${page}`);
      await expect(browserPage.locator('body')).toBeVisible();
      // Additional checks per page can be added here
    });
  });

  test('Verify contact form on index.html', async ({ page: browserPage }) => {
    await browserPage.goto('http://localhost:5500/index.html#contact');

    const nameInput = browserPage.locator('#contact input[name="name"]');
    const emailInput = browserPage.locator('#contact input[name="email"]');
    const messageTextarea = browserPage.locator('#contact textarea[name="message"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageTextarea).toBeVisible();

    // Check background color style is transparent for message box
    const bgColor = await messageTextarea.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(bgColor).toBe('rgba(0, 0, 0, 0)');

    // Fill and submit form (mock submission)
    await nameInput.fill('Test User');
    await emailInput.fill('test@example.com');
    await messageTextarea.fill('This is a test message.');

    // Intercept fetch for form submission and simulate success response
    await browserPage.route('https://formspree.io/f/YOUR_FORM_ID', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    );

    await browserPage.locator('#contact form').evaluate((form) => form.submit());

    // Expect form to be cleared after submission - can add additional check for alert or text feedback
  });

  test('Verify contact form on contact-page.html', async ({ page: browserPage }) => {
    await browserPage.goto('http://localhost:5500/contact-page.html');

    const textarea = browserPage.locator('textarea[name="message"]');
    await expect(textarea).toBeVisible();

    const bgColor = await textarea.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(bgColor).toBe('rgba(0, 0, 0, 0)');
  });

});
