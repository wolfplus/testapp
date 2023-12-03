import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ClubPhoto } from '../../models/club-photo';
import { getCurrentClubPhotos } from '../../store';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-club-photo',
  templateUrl: './club-photo.component.html',
  styleUrls: ['./club-photo.component.scss']
})
export class ClubPhotoComponent implements OnInit {
  clubPhotos$: Observable<ClubPhoto[]>;
  baseUrl = "https://api.doinsport.dv:8443";

  constructor(private store: Store<ClubState>){}

  ngOnInit() {
    // TODO: implement redux - retrieve photos from the store

    /* this.clubPhotos$ = of(
      [
        {
          contentUrl: 'https://media.dayoutwiththekids.co.uk/media/13628/32795-portsmouth-indoor-tennis-centre-portsmouth-01.jpg
          ?anchor=center&mode=crop&quality=75&width=800&height=450'
        }
      ]
    ); */
    this.clubPhotos$ = this.store.pipe(
      select(getCurrentClubPhotos),
      filter(Boolean),
      map((clubPhotos: ClubPhoto[]) => clubPhotos)
    );
  }

}
