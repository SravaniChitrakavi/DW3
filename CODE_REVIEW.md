**TASK 1: Code Review**
* Not all the Reading list actions have respective reducers.
* Failure scenario for 'failedAddToReadingList' & 'failedRemoveFromReadingList' are expected to capture error, but 'item' is being passed. And their respective reducers are missing in reading-list.reducer.ts
* As searchTerm is available in State, value can be pulled from State (EntityState<Book>) and be accessed through a selector rather than fetching it from form.


**Improvements**: 
* There's a space to add better styles for mobile layouts.
* **Why?** Mobile presentation of *okreads* is a little messed up, is not readable. 




**Accessibility Manual Check issues:**
* Added "alt" text for images.
* Updated page title to display on hovering on the tab.
* Heading checking - increased font-weight for book title's.
