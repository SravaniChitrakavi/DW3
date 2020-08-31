import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    xit('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('failedAddToReadingList should undo book addition to the state', () => {
      const action = ReadingListActions.failedAddToReadingList({
        error: 'failed to add book to reading list'
      });
      const failedAddToReadingListstate = {
        ids: null,
        entities: null,
        loaded: false,
        error: 'true'
      };
      const expected = {
        ids: null,
        entities: null,
        loaded: false,
        error: 'failed to add book to reading list'
      };

      const result = reducer(failedAddToReadingListstate, action);

      expect(result).toEqual(expected);
    });

    it('failedRemoveFromReadingList should undo book removal from the state', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        error: 'failed to remove book to the reading list'
      });

      const failedRemoveFromReadingListState = {
        ids: null,
        entities: null,
        loaded: false,
        error: 'true'
      };
      const expectedState = {
        ids: null,
        entities: null,
        loaded: false,
        error: 'failed to remove book to the reading list'
      };

      const result: State = reducer(failedRemoveFromReadingListState, action);

      expect(result).toEqual(expectedState);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
