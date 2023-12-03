import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { FriendService } from '../../shared/services/friend/friend.service';
import { Friend } from '../../shared/models/friend';
import { fromEvent, Subscription, BehaviorSubject } from 'rxjs';

import { PlayerComponent } from 'src/app/player/player.component';
import { SearchUserComponent } from '../search-user/search-user.component';
import { PlayerService } from 'src/app/shared/services/player/player.service';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { TranslateService } from '@ngx-translate/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../state/app.state";
import { ColorStyle, FontSize } from 'src/app/shared/models/style';

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.scss']
})
export class MyFriendsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() userId: string;
  @ViewChild('inputSearchFriend', { read: ElementRef }) inputSearchFriend: ElementRef;

  title$ = this.translate.get('my_friends');
  env;
  searchText = null;
  friends: Array<Friend>;
  pathUrl: string;
  pathFile = this.environmentService.getEnvFile().pathFiles;

  refreshViewSub$ = new BehaviorSubject(true);
  refreshView$ = this.refreshViewSub$.asObservable();

  allSubscriptions$ = new Subscription();
  search: string;
  friendsSubscription$: Subscription;
  searchSubscription$: Subscription;
  searchedFriend: Friend;
  showSearchSpinner: boolean;
  searchComplete: boolean;
  displaySearchErrorMessage: boolean;
  whiteLabelId: string;
  pendingFriends: Array<any>;
  pendingFriendsToDisplay: Array<any>;
  isLoaded = false;
  ColorStyle = ColorStyle;
  FontSize = FontSize;

  constructor(
    private friendService: FriendService,
    private modalCtrl: ModalController,
    private playerService: PlayerService,
    private translate: TranslateService,
    private store: Store<AppState>,
    private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
    this.pathUrl = environmentService.getEnvFile().pathFiles;
    if (this.env.useMb) {
      this.whiteLabelId = this.env.marqueBlanche.whiteLabelId;
    }
  }

  ionViewDidEnter() {
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
  ngOnInit(): void {
    // this.load();
    if (!this.userId) {
      this.store.select('user').pipe(tap(user => {
        this.userId = user.id;
      })).subscribe();
    }

    this.allSubscriptions$.add(this.refreshView$
      .pipe(
        switchMap( () => this.friendService.getFriends()),
        tap( friends => {
          if (friends !== undefined) {
            this.friends = [...friends];
          } else {
            this.friends = [];
          }
        }),
        switchMap( () => {
          return this.friendService.getFriendRequests();
        }),
        tap( friendRequestResponse => {
          if (friendRequestResponse !== undefined) {
            if (this.env.useMb) {
              this.getPendingFriendships(friendRequestResponse['hydra:member']);
            }
          }
        })
      )
      .subscribe()
    );
  }

  ngAfterViewInit() {
    this.allSubscriptions$.add(fromEvent(this.inputSearchFriend.nativeElement, 'keyup')
      .pipe(
        map( () => {
          return this.inputSearchFriend.nativeElement.value;
        }),
        tap( () => {
          this.showSearchSpinner = false;
          this.searchComplete = false;
          this.displaySearchErrorMessage = false;
        }),
        /* TODO: refactoring in progress / delete  */
        filter(Boolean),
        filter((event: string) => event.length > 2),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap( searchString => {
          this.showSearchSpinner = true;
          this.searchComplete = false;
          this.displaySearchErrorMessage = false;
          return this.friendService.getFriends(null, searchString);
        }),
        tap( response => {
          // this.selectedFriendsCopy.unshift(response);
          if (response !== undefined) {
            this.searchedFriend = response[0];
            if (this.searchedFriend) {
              const indexOfFriendInArray = this.friends
                .indexOf(this.friends.find( friend => friend.id === this.searchedFriend.id));
              if (indexOfFriendInArray > -1) {
                this.friends.splice(indexOfFriendInArray, 1);
                this.friends.unshift(this.searchedFriend);
              }
              this.displaySearchErrorMessage = false;
            } else {
              this.displaySearchErrorMessage = true;
            }
            this.showSearchSpinner = true;
            this.searchComplete = true;
          } else {
            this.showSearchSpinner = true;
            this.searchComplete = true;
            this.displaySearchErrorMessage = true;
          }
        })
      )
      .subscribe()
    );
  }

  getPendingFriendships(friendRequestList) {
    this.isLoaded = false;
    this.pendingFriendsToDisplay = [];
    const pendingFriends = friendRequestList
      .filter( pendingFriend => {
        return pendingFriend.clubWhiteLabel === '/clubs/white-labels/' + this.whiteLabelId;
      })
      .filter(pendingFriend => {
        return pendingFriend.acceptedDate === null;
      });
    if (pendingFriends.length !== 0) {
        const promiseWait = new Promise<void>((resolve, _reject) => {
          pendingFriends.forEach((element, index, array) => {
            const receiverIriAsArray = element.receiverUser.split('/');
            const receiverId = receiverIriAsArray[receiverIriAsArray.length - 1];
            this.playerService.getPlayer(receiverId)
              .pipe(
                tap( player => {
                  if (player) {
                    this.pendingFriendsToDisplay.push(player);
                  }

                  if (index === array.length - 1) {
                    resolve();
                  }
                })
              )
              .subscribe();
          });
        });
        promiseWait.then(() => {
          this.isLoaded = true;
        });
      } else {
        this.isLoaded = true;
      }
  }

  // removeFriend(friend) {
  //   // TODO: ask Bruno
  // }

  presentPlayerModal(id) {
    return this.modalCtrl.create({
      component: PlayerComponent,
      cssClass: 'player-class',
      componentProps: {id}
    })
    .then(modal => {
      modal.present().then();
      modal.onDidDismiss().then( () => {
        this.refreshViewSub$.next(true);
      });
    });
  }

  presentSearchUserModal() {
    return this.modalCtrl.create({
      component: SearchUserComponent,
      cssClass: 'search-user-class',
      componentProps: {
        userId: this.userId,
        myFriends: this.friends,
        pendingFriends: this.pendingFriends !== undefined ? this.pendingFriends : []
      }
    })
    .then(modal => {
      modal.present().then();
      modal.onDidDismiss().then( () => {
        this.refreshViewSub$.next(true);
      });
    });
  }

  goBack() {
    // this.navCtrl.back();
    this.modalCtrl.dismiss({refresh: true});
  }

  ngOnDestroy() {
    this.allSubscriptions$.unsubscribe();
  }
}
