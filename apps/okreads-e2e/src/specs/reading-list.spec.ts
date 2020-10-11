import { $, $$, browser, ExpectedConditions } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });
  it('Should mark book as finished', async () => {
    await browser.get('/');
    await browser.wait(
        ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const form = await $('form');
    // search for i/p field
    const input = await $('input[type="search"]');
    // search Redux books
    await input.sendKeys('React Native');
    // submit search
    await form.submit();
    // click Want to Read button
    const addBooksToListButton = await $$('[data-add-book="add-book-to-reading-list"] [ng-reflect-disabled="false"]');
    // click want to read
    addBooksToListButton[0].click();
    // check for reading list toggle
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    // click reading list toggle button
    await readingListToggle.click();
    // wait for My Reading List ele toggle
    await browser.wait(
        ExpectedConditions.textToBePresentInElement(
            $('[data-testing="reading-list-container"]'),
            'My Reading List'
        )
    );
    // check finish button
    const readingListFinishButton = await $$('[data-finish-button="reading-list-finish-button"]');
    // click on remove button
    readingListFinishButton[0].click();

    // check if reading book finished details are displayed
    const readingListAfterFinish = await $$('[data-finished-reading-book-testing="finished-book-reading-details"]');
    expect(readingListAfterFinish.length).toBeGreaterThan(1);

    // check for mat-icon
    const readingListFinishedButton = await $$('[data-finished-button="reading-list-finished-button"]');
    expect(readingListFinishedButton.length).toBeGreaterThan(1);
  });
});
