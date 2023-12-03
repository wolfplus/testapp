import {Component, Input, EventEmitter, Output, OnInit} from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';


import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';
import * as ClubNewsActions from 'src/app/state/actions/clubNews.actions';
import { concatMap, filter, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ClubService } from 'src/app/club/club.service';
import { ClubActions } from 'src/app/club/store/actions';
import {select, Store} from '@ngrx/store';
import { ClubState } from 'src/app/club/store/club.reducers';
import { AppState } from 'src/app/state/app.state';
import {getCurrentClub} from "../../club/store";
import { CartState } from '../../shop/state/cart.state';

@Component({
  selector: 'app-choice-club',
  templateUrl: './choice-club.component.html',
  styleUrls: ['./choice-club.component.scss']
})
export class ChoiceClubComponent implements OnInit{

  @Input() clubs: any = [];
  @Output() refreshClubs = new EventEmitter<any>(false);

  env;
  baseUrl;
  filePath;
  term: string;
  clubIdSelected: string;
  closed = true;
  isLoaded = false;
  club: any = null;

  constructor(
    private modalCtr: ModalController,
    public translate: TranslateService,
    private store: Store<AppState>,
    private clubService: ClubService,
    private clubStore: Store<ClubState>,
    private cartState: CartState,
    private environmentService: EnvironmentService,
    public toastController: ToastController
  ) {
    this.env = this.environmentService.getEnvFile();
    this.baseUrl = this.env.pathFiles;

    this.clubStore.pipe(
        select(getCurrentClub),
        tap(club => {
          if (club) {
            this.clubIdSelected = club.id;
            this.club = club;
          }
        })
    ).subscribe();
  }

  ngOnInit() {
    this.clubs = [];
    from(this.environmentService.getEnvFile().marqueBlanche.clubIds)
        .pipe(
            concatMap( (id: string) => {
              return this.clubService.getClub(id)
                  .pipe(
                      filter( club => club !== undefined),
                      tap(
                          {
                            next: val => {
                              this.clubs.push(val);
                            },
                            error: error => {
                              console.log('on error', error.message);
                            },
                            complete: () => {
                              if (this.env.marqueBlanche.countclub === this.clubs.length) {
                                this.isLoaded = true;
                              }
                            }
                          }),
                  );
            })
        )
        .subscribe();
  }

  async changeClub(club) {
    this.closed = true;
    const id = club['@id'].replace('/clubs/', '');
    this.clubIdSelected = id;
    this.toastController.create({
      color: 'success',
      message: this.translate.instant('change_club') + ' ' + club.name,
      duration: 3000,
      position: 'bottom'
    }).then(toast => {
      toast.present();
    });
    Preferences.remove({key: 'clubId'}).then(() =>  true);
    Preferences.set({key: 'clubId', value: id}).then(() =>  true);
    this.club = club;
    this.clubStore.dispatch(ClubActions.loadClub({clubId: id}));
    this.clubStore.dispatch(ClubActions.loadClub({clubId: id}));
    this.store.dispatch(ClubNewsActions.getClubNewsList({ payload: id}));
    this.store.dispatch(ClubActions.loadClubServices({clubId: id}));
    this.store.dispatch(ClubActions.loadClubActivityCategories({clubId: id}));
    this.modalCtr.dismiss({reload: true, club: this.club}).then();
    this.cartState.resetCart();
  }

  close() {
    this.modalCtr.dismiss({reload: true, club: this.club}).then();
  }

}
