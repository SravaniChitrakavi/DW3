import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook, removeFromReadingList,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import {Book, ReadingListItem} from '@tmo/shared/models';
import {Observable, Subscription} from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnDestroy {
  books$: Observable<ReadingListBook[]>;
  private snackBarAction$: Subscription;

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar
  ) {
    this.books$ = this.store.select(getAllBooks);
  }

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
    this.showSnackBar(book);
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  private showSnackBar(book: Book) {
    const snackBar = this.snackBar.open( "Added" + ' ' + book.title + ' ' + 'to Reading list!', 'Undo', {
      duration: 1000
    });

    this.snackBarAction$ = snackBar.onAction().subscribe(undo => {
      const item: ReadingListItem = {
        ...book,
        bookId: book.id
      };
      this.store.dispatch(removeFromReadingList({ item }));
    });
  }

  ngOnDestroy(): void {
    this.snackBarAction$.unsubscribe();
  }
}
