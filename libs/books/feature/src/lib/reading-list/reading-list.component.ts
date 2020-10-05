import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { addToReadingList, getReadingList, removeFromReadingList} from '@tmo/books/data-access';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Book, ReadingListItem } from "@tmo/shared/models";
import { Subscription } from "rxjs";

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnDestroy{
  readingList$ = this.store.select(getReadingList);
  private snackBarAction$: Subscription;

  constructor(
      private readonly store: Store,
      private readonly snackBar: MatSnackBar
  ) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    this.displaySnackBar(item);
  }

  private displaySnackBar(item: ReadingListItem) {
    const snackBar = this.snackBar.open("Removed" + ' ' + item.title + ' ' + ' from Reading list!', 'Undo', {
      duration: 1000
    });
    this.snackBarAction$ = snackBar.onAction().subscribe(undo => {
      const book: Book = {
        ...item,
        id: item.bookId
      };
      this.store.dispatch(addToReadingList({ book }));
    });
  }

  ngOnDestroy(): void {
    this.snackBarAction$.unsubscribe();
  }
}
