import { $, $$, browser, ExpectedConditions, element, by } from 'protractor';

describe('When: I use the reading list feature', () => {
  let readingListPriorUndo;
  let readingListAfterUndo;
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

  it('Then: Undo action should remove the book Added to the reading list', async () => {
    await browser.get('/');
    await browser.wait(
        ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const form = await $('form');
    // search for i/p field
    const input = await $('input[type="search"]');
    // search Redux books
    await input.sendKeys('Redux');
    // submit search
    await form.submit();
    // check reading list length before adding another book
    readingListPriorUndo = await $$('[data-reading-list-testing="reading-list-item"]');

    // click Want to Read button
    const addBooksToListButton = await $$('[data-add-book="add-book-to-reading-list"] [ng-reflect-disabled="false"]');
    addBooksToListButton[0].click();

    // snackbar ele
    const snackbar =  await $$('snack-bar-container .mat-button');
    console.log('snackbar', snackbar);
    await browser.wait(
        ExpectedConditions.textToBePresentInElement(snackbar[0], 'Undo')
    );
    // click undo
    snackbar[0].click();
    // get reading list items
    readingListAfterUndo = await $$('[data-reading-list-testing="reading-list-item"]');
    // expect reading list state to be updated
    expect(readingListPriorUndo.length).toEqual(readingListAfterUndo.length);
  });

  it('Should add book back to reading list upon clicking UNDO in Snack bar - remove book', async () => {
    await browser.get('/');
    // wait for okreads
    await browser.wait(
        ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    // check reading list
    readingListPriorUndo = await $$('[data-reading-list-testing="reading-list-item"]');
    // get reading list button
    const readingListButton = await $('[data-testing="toggle-reading-list"]');
    // click reading list
    await readingListButton.click();
    // wait for my reading list container
    await browser.wait(
        ExpectedConditions.textToBePresentInElement(
            $('[data-testing="reading-list-container"]'),
            'My Reading List'
        )
    );
    // check remove button
    const removeReadingListButton = await $$('[data-remove-button="reading-list-remove-button"]');
    // click on remove button
    removeReadingListButton[0].click();
    // snackbar ele
    const snackbar =  await $$('snack-bar-container .mat-button');
    await browser.wait(
        ExpectedConditions.textToBePresentInElement(snackbar[0], 'Undo')
    );
    // click on snackbar undo button
    snackbar[0].click();

    // get reading list items
    readingListAfterUndo = await $$('[data-reading-list-testing="reading-list-item"]');
    // expect reading list state to be reverted to the previous state.
    expect(readingListPriorUndo.length).toEqual(readingListAfterUndo.length);

  });
});
