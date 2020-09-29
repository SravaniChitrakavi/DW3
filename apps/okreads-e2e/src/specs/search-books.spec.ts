import { $, $$, browser, ExpectedConditions } from 'protractor';

describe('When: Use the search feature', () => {
  it('Then: I should be able to search books by title', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const items = await $$('[data-testing="book-item"]');
    expect(items.length).toBeGreaterThan(1);
  });

  it('Then: I should see search results as I am typing', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    // get input/search field
    const input = await $('input[type="search"]');
    // enter keyword in order to search
    await input.sendKeys('angular');
    // get the list of all books from book-grid
    const bookItems = await $$('[data-testing="book-item"]');
    // Assume at least 1 book to get displayed
    expect(bookItems.length).toBeGreaterThan(1, 'Instant search is not displaying books');
  });
});
