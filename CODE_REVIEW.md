**TASK 1: Code Review**
1. Not all the Reading list actions have respective reducers.
2. Failure scenario for 'failedAddToReadingList' & 'failedRemoveFromReadingList' are expected to capture error, but 'item' is being passed. And their respective reducers are missing in reading-list.reducer.ts
3. As searchTerm is available in State, value can be pulled from State (EntityState<Book>) and be accessed through a selector rather than fetching it from form.


**Improvements**: There's a space to add better styles for mobile layouts.
Why? Mobile presentation of *okreads* is a little messed up and not user friendly. 



**Accessibility Manual Check issues:**
1. Added "alt" text for images.
2. Updated page title to display on hovering on the tab.
3. Heading checking - increased font-weight for book title's.
