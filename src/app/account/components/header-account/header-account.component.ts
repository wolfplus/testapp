import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { getPrimaryColor } from 'src/utils/get-primary-color';
import { Observable } from 'rxjs';
import {tap, catchError, first} from 'rxjs/operators';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { FriendService } from 'src/app/shared/services/friend/friend.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import {ClubPhoto} from "../../../club/models/club-photo";
import {getClubPhoto} from "../../../club/store";
import {Store} from "@ngrx/store";
import {ClubState} from "../../../club/store/club.reducers";
import { ProfileConfig } from 'src/app/shared/models/user';

@Component({
  selector: 'app-header-account',
  templateUrl: './header-account.component.html',
  styleUrls: ['./header-account.component.scss'],
  providers: []
})
export class HeaderAccountComponent implements OnInit {
  @Input() userData$: Observable<any>;
  @Input() config: ProfileConfig = ProfileConfig.USER;
  @Output() manageFriendship = new EventEmitter<string>();
  @Output() goBack = new EventEmitter<any>();

  clubPhoto: ClubPhoto;



  userData: any;
  ProfileConfig = ProfileConfig;
  title = "my_account";
  urlPath: string;
  env;
  avatarAlternative = '';
  userAvatarPin = '<svg viewBox="0 0 85.4 99.9"><path d="m85.2 37.4c-2.5-21.7-21-37.7-42.4-37.4v0C21.3-0.3 2.8 15.7 0.3 37.4A42.2 42.2 0 0 0 0 42.2 42.1 42.1 0 0 0 15.6 75c6.6 6.4 20.9 19.3 23.8 23a4.8 4.8 0 0 0 3.3 1.9v0c0 0 0 0 0.1 0l0 0v0a4.8 4.8 0 0 0 3.3-1.9c2.9-3.7 17.2-16.6 23.8-23a42.1 42.1 0 0 0 15.6-32.8 42.6 42.6 0 0 0-0.3-4.8z"/></svg>';
  slantedLeft = '<svg xmlns="http://www.w3.org/2000/svg" height="40" width="69" viewBox="0 0 69.4 39.5"><path d="M69.4 0 37.9 39.5H0V0Z"/></svg>';
  slantedRight = '<svg xmlns="http://www.w3.org/2000/svg" height="40" width="69" viewBox="0 0 69.4 39.5"><path d="M69.4 0 37.9 39.5H0V0Z"/></svg>';
  slanted = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.5 10.6" height="11" width="36"><path d="m43.1 52.9v0H0l8.1 10.6h9.7v0h9.7l8-10.6z" style="fill:#dbdee5;stroke-width:0.3"/></svg>';
  bgHeaderImage: string;
  bgHeaderImageMb: string;
  request: any;
  isLoaded = false;

  constructor(
    public alertController: AlertController,
    private environmentService: EnvironmentService,
    private loaderService: LoaderService,
    private friendService: FriendService,
    private toastService: ToastService,
    private storeClub: Store<ClubState>
  ) {
    this.env = this.environmentService.getEnvFile();
    this.urlPath = this.environmentService.getEnvFile().pathFiles;

    this.bgHeaderImage = 'assets/images/banner_default.png';
    this.bgHeaderImageMb = 'assets/images/banner_default.png';
  }

  async ngOnInit() {
    this.storeClub.select(getClubPhoto).pipe(
        first(),
        tap( clubPhoto => {
          this.clubPhoto = clubPhoto;
        }),
    ).subscribe();
    this.avatarAlternative = `https://eu.ui-avatars.com/api/?background=${getPrimaryColor()}&color=fff&name=`;
    this.request = await this.friendService.getFriendRequests().toPromise();

    if (this.config === ProfileConfig.USER) {
      this.title = 'my_account';
    } else {
      this.title = 'player_profile';
    }


    this.userData$.pipe(
      tap( data => {
        this.userData = data;
        this.isLoaded = true;
      }),
    )
    .subscribe();
  }

  accept() {
    this.loaderService.presentLoading();
    this.request['hydra:member'].forEach(element => {
      if (element.requesterUser === '/user-clients/' + this.userData.id) {
      this.friendService.acceptInvit(element['@id']).pipe(
        catchError(err => {
            return err;
        })
      )
      .subscribe(() => {
        this.userData.friendshipStatus = 'friend';
        this.loaderService.dismiss();
        this.toastService.presentSuccess('invitation_sent_by_friend', 'top');
      });
    }});
  }

  refuse() {
    this.loaderService.presentLoading();
    this.request['hydra:member'].forEach(element => {
      if (element.requesterUser === '/user-clients/' + this.userData.id) {
        this.friendService.cancelInvit(element['@id']).pipe(
          catchError(err => {
            return err;
          })
        )
        .subscribe(() => {
          this.userData.friendshipStatus = 'not_friend';
          this.loaderService.dismiss();
          this.toastService.presentInfo('invitation_decline_by_friend', 'top');
        });
      }
    });
  }

  updateUrlBg() {
    this.bgHeaderImage = 'assets/images/banner_default.png';
    // this.bgHeaderImageMb = 'assets/images/banner_default.png';
  }

  updateFriendshipStatus(event) {
    this.manageFriendship.emit(event);
  }

  backAction() {
    this.goBack.emit();
  }

}
