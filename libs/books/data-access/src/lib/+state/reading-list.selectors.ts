import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BooksPartialState } from './books.reducer';
import { getBooks } from './books.selectors';
import {
  READING_LIST_FEATURE_KEY,
  readingListAdapter,
  ReadingListPartialState,
  State
} from './reading-list.reducer';
import { Book, ReadingListItem } from '@tmo/shared/models';

export const getReadingListState = createFeatureSelector<
  ReadingListPartialState,
  State
>(READING_LIST_FEATURE_KEY);

const {
  selectEntities,
  selectAll,
  selectTotal
} = readingListAdapter.getSelectors();

export const getReadingListEntities = createSelector(
  getReadingListState,
  selectEntities
);

export interface ReadingListBook extends Book, Omit<ReadingListItem, 'bookId'> {
  isAdded: boolean;
}

export const getAllBooks = createSelector<
  BooksPartialState & ReadingListPartialState,
  Book[],
  Record<string, ReadingListItem>,
  ReadingListBook[]
>(getBooks, getReadingListEntities, (books, entities) => {
  // update book details if it's marked as finished in Reading List
  return books.map(book => {
    const readingListBook = entities[book.id];
    const isAdded: boolean = Boolean(readingListBook);
    const isFinished = readingListBook && readingListBook.finished;
    return { ...book, isAdded: isAdded, finished: isFinished};
  });
});

export const getReadingList = createSelector(getReadingListState, selectAll);

export const getTotalUnread = createSelector(getReadingListState, selectTotal);
