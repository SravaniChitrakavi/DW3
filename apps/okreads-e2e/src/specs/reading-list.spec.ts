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
  it('Should remove book from reading list upon clicking UNDO in snack Bar', async () => {
    await browser.get('/');
    await browser.wait(
        ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const form = await $('form');
    const input = $('input[type="search"]');
    await input.sendKeys('redux');
    await form.submit();
    const button = await $$('[data-add-book="add-book-to-reading-list"] [ng-reflect-disabled="false"]');
    button[0].click();
    const snackbarUndoButton =  await $$('snack-bar-container .mat-button');
    await browser.wait(
        ExpectedConditions.textToBePresentInElement(snackbarUndoButton[0], 'Undo')
    );
    snackbarUndoButton[0].click();
  });

  it('Should add book back to reading list upon clicking UNDO in Snack bar', async () => {
    await browser.get('/');
    await browser.wait(
        ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const readingListButton = await $('[data-testing="toggle-reading-list"]');
    await readingListButton.click();
    await browser.wait(
        ExpectedConditions.textToBePresentInElement(
            $('[data-testing="reading-list-container"]'),
            'My Reading List'
        )
    );
    const removeReadingListButton = await $$('[data-remove-button="reading-list-remove-button"]');
    removeReadingListButton[0].click();
    const snackbarUndoButton =  await $$('snack-bar-container .mat-button');
    await browser.wait(
        ExpectedConditions.textToBePresentInElement(snackbarUndoButton[0], 'Undo')
    );
    snackbarUndoButton[0].click();
  });
});
