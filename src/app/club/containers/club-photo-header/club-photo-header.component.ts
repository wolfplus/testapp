import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getCurrentClubLoadedState } from '../../store';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-club-photo-header',
  templateUrl: './club-photo-header.component.html',
  styleUrls: ['./club-photo-header.component.scss']
})
export class ClubPhotoHeaderComponent implements OnInit {
  contentIsLoaded$: Observable<boolean>;

  constructor(private clubStore: Store<ClubState>) { }

  ngOnInit() {
    // TODO: implement redux - retrieve photos from the store
    this.contentIsLoaded$ = this.clubStore.select(getCurrentClubLoadedState);
  }

  like() {
  }

}
