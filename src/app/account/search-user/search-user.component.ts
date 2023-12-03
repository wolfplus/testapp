import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, IonInfiniteScroll, ViewWillEnter} from '@ionic/angular';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { FriendService } from '../../shared/services/friend/friend.service';
import { Friend } from '../../shared/models/friend';
import { fromEvent, Subscription } from 'rxjs';

import { PlayerComponent } from 'src/app/player/player.component';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ColorStyle, FontSize } from 'src/app/shared/models/style';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent implements OnInit, AfterViewInit, OnDestroy, ViewWillEnter {
  @ViewChild('inputSearchFriend', { read: ElementRef }) inputSearchFriend: ElementRef;
  @ViewChild('autofocus', { static: true }) autofocus;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @Input() userId: string;
  @Input() myFriends: Array<any>;
  @Input() pendingFriends: Array<any>;

  env;
  searchText = null;
  friends: Array<Friend>;
  pathUrl: string;

  allSubscriptions$ = new Subscription();
  search: string;
  searchedUser: any;
  foundUsers: Array<any> = [];
  showSearchSpinner = false;
  searchComplete: boolean;
  displaySearchErrorMessage: boolean;
  displaySkeleton = false;
  whiteLabelId: string;
  hasNextPage = false;
  nextPage: any;
  ColorStyle = ColorStyle;
  FontSize = FontSize;

  constructor(
    private friendService: FriendService,
    private modalCtrl: ModalController,
    private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
    this.pathUrl = this.environmentService.getEnvFile().pathFiles;
    this.whiteLabelId = this.env.marqueBlanche.whiteLabelId;
  }

  ngOnInit(): void {

  }

  ionViewWillEnter() {
    setTimeout(() => this.autofocus.setFocus(), 300);
  }

  ngAfterViewInit() {
    this.allSubscriptions$.add(fromEvent(this.inputSearchFriend.nativeElement, 'keyup')
      .pipe(
        map( () => {
          return this.inputSearchFriend.nativeElement.value;
        }),
        tap( (event: string) => {
          this.displaySkeleton = true;
          this.showSearchSpinner = false;
          this.searchComplete = false;
          this.displaySearchErrorMessage = false;
          if (event.length < 3 && (event === "" || event === " ")) {
            this.foundUsers = [];
            this.showSearchSpinner = false;
            this.displaySkeleton = false;
            // this.searchComplete = false;
          }
        }),
        filter(Boolean),
        filter((event: string) => event.length >= 2 && (event !== "")),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap( searchString => {
          this.showSearchSpinner = true;
          this.searchComplete = false;
          this.displaySearchErrorMessage = false;
          return this.friendService.findUser(searchString, this.whiteLabelId);
        }),
        tap( response => {
          // this.foundUsers.unshift(response);
          if (response !== undefined) {
            this.displaySkeleton = false;
            this.displaySearchErrorMessage = false;
            this.foundUsers = response['hydra:member'];
            this.foundUsers = this.foundUsers.filter( user => user.id !== this.userId);
            this.foundUsers.forEach(user => {
              user = this.addUserStatus(user);
            });
            if (response['hydra:view'] && response['hydra:next']){
              this.hasNextPage = true;
              this.nextPage = response['hydra:view']['hydra:next'];
              if (this.infiniteScroll) {
                this.infiniteScroll.complete();
                this.infiniteScroll.disabled = false;
              }
            } else {
              this.hasNextPage = false;
              if (this.infiniteScroll) {
                this.infiniteScroll.complete();
                this.infiniteScroll.disabled = true;
              }
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

  addUserStatus(user) {
    if (this.myFriends.find(friend => friend.id === user.id) !== undefined) {
      user.isFriend = true;
    } else {
      user.isFriend = false;
    }

    if (this.pendingFriends.find(friend => friend.id === user.id) !== undefined) {
      user.isPendingFriend = true;
    } else {
      user.isPendingFriend = false;
    }
    return user;
  }

  loadMoreUsers() {
    this.friendService.loadMoreUsers(this.nextPage)
      .pipe(
        tap( response => {
          if (response !== undefined) {
            this.foundUsers = [...this.foundUsers, ...response['hydra:member']];
            if (response['hydra:view'] && response['hydra:next']){
              this.hasNextPage = true;
              this.nextPage = response['hydra:view']['hydra:next'];
              if (this.infiniteScroll) {
                this.infiniteScroll.complete();
                this.infiniteScroll.disabled = false;
              }
            }
          } else {
            this.hasNextPage = false;
            if (this.infiniteScroll) {
              this.infiniteScroll.complete();
              this.infiniteScroll.disabled = true;
            }
          }
        })
      )
      .subscribe();
  }

  // removeFriend(friend) {
  //   // TODO: ask Bruno
  // }

  presentPlayerModal(userId) {
    return this.modalCtrl.create({
      component: PlayerComponent,
      cssClass: 'player-class',
      componentProps: {id: userId}
    })
    .then(modal => {
      modal.present().then();
      modal.onDidDismiss();
    });
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    this.allSubscriptions$.unsubscribe();
  }
}
