import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { getClubDescription, getCurrentClubLoadedState, getCurrentClubLoadingState } from '../../store';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-about-club',
  templateUrl: './about-club.component.html',
  styleUrls: ['./about-club.component.scss']
})
export class AboutClubComponent implements OnInit {
  // TODO: replace with content from store
  // TODO: [TRANSLATION] add translation
  title$ = this.translator.get('about');
  seeMore = false;
  clubDescription$: Observable<string>;
  clubIsLoading$: Observable<boolean>;
  clubIsLoaded$: Observable<boolean>;

  constructor(
    private store: Store<ClubState>,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.clubDescription$ = this.store.pipe(
      select(getClubDescription)
    );

    this.clubIsLoading$ = this.store.pipe(select(getCurrentClubLoadingState));
    this.clubIsLoaded$ = this.store.pipe(select(getCurrentClubLoadedState));
  }

}
