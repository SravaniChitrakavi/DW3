import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { ReadingListItem, Book } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http
          .get<ReadingListItem[]>('/api/reading-list')
          .pipe(
            map(data =>
              ReadingListActions.loadReadingListSuccess({ list: data })
            )
          )
      ),
      catchError(error =>
        of(ReadingListActions.loadReadingListError({ error }))
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
            catchError(() => {
                // optimistic UI update - remove book from reading list in case of API error
                const item: ReadingListItem = {
                    ...book,
                    bookId: book.id
                };
                return of(ReadingListActions.failedAddToReadingList({ item }));
            })
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item })
          ),
          catchError(() => {
              // optimistic UI update - add back book to reading list in case of API error
              const book: Book = {
                ...item,
                id: item.bookId
              };
              return of(ReadingListActions.failedRemoveFromReadingList({ book }));
          })
        )
      )
    ));

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private readonly actions$: Actions, private readonly http: HttpClient) {}
}
