import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {take, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../state/app.state';
import * as SearchActions from '../../state/actions/search.actions';
import { Subscription } from 'rxjs';
import * as ValidatedSearchActions from 'src/app/state/actions/validated-search.actions';
import { AROUND_ME } from 'src/app/shared/models/geolocation';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() heightHeader: number;
  @ViewChild('inputSearchClub', { read: ElementRef }) inputSearchClub: ElementRef;

  searchSubscription$: Subscription;
  searchTermSubscription$: Subscription;

  constructor(
      private store: Store<AppState>,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout( () => {
      this.inputSearchClub.nativeElement.setFocus();
    }, 500);

    this.searchTermSubscription$ = this.store.pipe(
      select('validatedSearch'),
      take(1),
      tap( searchTerm => {
        if (searchTerm !== AROUND_ME ) {
          this.inputSearchClub.nativeElement.value = searchTerm;
        }
      })
    )
    .subscribe();
  }

  ngOnDestroy() {
    if (this.searchTermSubscription$ !== undefined) {
      this.searchTermSubscription$.unsubscribe();
    }
    if (this.searchSubscription$ !== undefined) {
      this.searchSubscription$.unsubscribe();
    }
  }

  updateSearch(event) {
    this.store.dispatch(new SearchActions.AddSearch(event.detail.value));
    if (event.detail.value === "") {
      this.store.dispatch(new ValidatedSearchActions.AddValidatedSearch(event.detail.value));
    }
  }
}
