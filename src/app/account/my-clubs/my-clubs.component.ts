import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Club} from '../../shared/models/club';
import {ClubService} from '../../shared/services/club/club.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../state/app.state';
import { map, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-my-clubs',
  templateUrl: './my-clubs.component.html',
  styleUrls: ['./my-clubs.component.scss']
})
export class MyClubsComponent implements OnInit, AfterViewInit {
  // Input() user: User;
  clubs: Array<Club>;
  user: User;
  showSkeleton = true;

  constructor(
    private modalCtrl: ModalController,
    private clubService: ClubService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.store.select('user').pipe(
      tap(user => {
        if (user !== undefined) {
          this.user = user;
        }
      }),
      switchMap( user => this.clubService.getMyClubs(user.id)),
      map( data => data['hydra:member']),
      tap( clubs => {
        this.showSkeleton = false;
        this.clubs = clubs.map( club => {
          if (this.user !== undefined) {
              club.isPreferred = this.clubIsPreferred(this.user, club['@id']);
          }
          return club;
        });
      })
    ).subscribe();
  }

  clubIsPreferred(user, clubIRI) {
    let isPreferred = false;
    if (user && user.preferredClubs.length > 0 && user.preferredClubs.includes(clubIRI)) {
      isPreferred = true;
    }
    return isPreferred;
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }
}
