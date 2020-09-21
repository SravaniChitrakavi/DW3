**TASK 1: Code Review and Improvements**
* Not all the Reading list actions have respective reducers.
* Failure scenario for 'failedAddToReadingList' & 'failedRemoveFromReadingList' are expected to capture error, but 'item' is being passed.
    And their respective reducers are missing in reading-list.reducer.ts
* As searchTerm is available in State, value can be pulled from State (EntityState<Book>)
    and be accessed through a selector rather than fetching it from form.
* Variables naming convention (both in HTML and TS) should be readable as per the scope of code
    to make it readable and makes it easy to understand what the variable holds.
    Modified variable names in book-search.component.html & reading-list.component.html
* Made "**actions$**" and **http** properties readonly (makes it immutable to avoid mutation) in reading-list-effects.ts as they remain unmodified.
* Added a new observable (books$) to hold the list of all books from Store. Used 'async' pipe (subscribing to the books$ observable) in the markup in-order to fetch latest emitted value. 
    This also helps in auto unsubscribing observer.
* There's space to add better styles for mobile layouts as it's not responsive.
    **Why?** Mobile presentation of *okreads* is a little messed up, is not responsive and readable.



**Lighthouse - Accessibility issues:**
* Buttons don't have accessible name 
    - Added aria-label to 'Search' to make it accessible for all the users.
* Contrast - Background and foreground don't have sufficient contrast ration 
    - It's hard to read without proper contrast, Updated background color of 'Reading List' button to make it more readable.


**Accessibility Manual Check issues:**
* Added "alt" text for images - If user can't see the book image or the image is not getting displayed in case of n/w issues.
* Updated page title to display on hovering on the tab.
* Heading checking - increased font-weight for book title's.
* Added aria-label for all the input fields to provide an accessible name in case there is no visible label due to design approach.
* Fixed 'Reading List' contrast as per the accessibility rules.
