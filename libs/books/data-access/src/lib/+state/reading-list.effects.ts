import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of, Subscription } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { ReadingListItem, Book } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from "@angular/material/snack-bar";
import {addToReadingList, removeFromReadingList} from "./reading-list.actions";
import { Store } from '@ngrx/store';
import { OnDestroy } from '@angular/core';

@Injectable()
export class ReadingListEffects implements OnInitEffects, OnDestroy {
  private snackBarAction$: Subscription;
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
          map(() => {
              const item: ReadingListItem = {
                  ...book,
                  bookId: book.id
              };
              this.displaySnackBar('addToReadingList', item);
              return ReadingListActions.confirmedAddToReadingList({ book })}),
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
            {
                const book: Book = {
                    ...item,
                    id: item.bookId
                };
                this.displaySnackBar('removeFromReadingList', null, book);
                return ReadingListActions.confirmedRemoveFromReadingList({ item })
            }
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

  /**
   * Method to display SnackBar
   * @param action {string} - to do an optimistic update
   * @param item {ReadingListItem}
   * @param book {Book}
   */
  private displaySnackBar(action: string, item?: ReadingListItem, book?: Book) {
    const snackBar = this.snackBar.open((action === 'removeFromReadingList' ? 'removed book from reading list': 'added book to reading list'), 'Undo', {
        duration: 10000
    });
    this.snackBarAction$ = snackBar.onAction().subscribe(undo => {
        return action === 'removeFromReadingList' ?
            this.store.dispatch(addToReadingList({ book })) :
            this.store.dispatch(removeFromReadingList({ item }));
    });
  }

  ngOnDestroy(): void {
      this.snackBarAction$.unsubscribe();
  }


    constructor(private readonly actions$: Actions, private readonly http: HttpClient, private readonly store: Store, private readonly snackBar: MatSnackBar) {}
}
