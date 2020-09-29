import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Subject, Observable} from "rxjs";
import {debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books$: Observable<ReadingListBook[]>;
  unsubscribe$: Subject<any> = new Subject<any>();

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {
    this.books$ = this.store.select(getAllBooks);
  }

  public ngOnInit(): void {
    // handle instant search
    this.searchBooks();
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
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    // get search value from form
    this.searchForm.valueChanges.pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged()
    ).subscribe(searchValue => {
      return searchValue !== '' ?
          this.store.dispatch(searchBooks({ term: this.searchTerm })) :
          this.store.dispatch(clearSearch())
    });
  }

  public ngOnDestroy() {
    // unsubscribe to avoid data leaks
    this.unsubscribe$.next(null);
    this.unsubscribe$.unsubscribe();
  }
}
