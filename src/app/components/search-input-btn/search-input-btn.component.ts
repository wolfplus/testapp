import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClubDetailComponent } from 'src/app/club-detail/club-detail.component';
import { PlaceSearchPage } from 'src/app/modal/place-search/place-search.page';
import { SearchType } from 'src/app/shared/enums/search-type';
import { ModalService } from 'src/app/shared/services/modal.service';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-search-input-btn',
  templateUrl: './search-input-btn.component.html',
  styleUrls: ['./search-input-btn.component.scss']
})
export class SearchInputBtnComponent implements OnInit {
  @Input() searchType = SearchType.HOME;
  @Input() position;
  @Output() changeInputSearch = new EventEmitter();
  searchButtonText$: Observable<string>;

  constructor(
    private modalService: ModalService,
    private translate: TranslateService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.searchButtonText$ = this.store
      .pipe(
        select('validatedSearch')
      )
      .pipe(
        map( term => {
          if (this.position === SearchType.HOME) {
            term = this.translate.instant('find_a_club');
          } else if (term === "AROUND_ME") {
            term = this.translate.instant('around_me');
          }
          this.changeInputSearch.emit();
          return term;
        })
      );
  }

  openSearchModal() {
    this.modalService.searchClubResultModal(PlaceSearchPage, ClubDetailComponent,this.searchType);
  }

}
