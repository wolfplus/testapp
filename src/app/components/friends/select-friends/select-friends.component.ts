import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {forkJoin, fromEvent, Subscription} from 'rxjs';
import { Friend } from '../../../shared/models/friend';
import { FriendService } from '../../../shared/services/friend/friend.service';
import { debounceTime, distinctUntilChanged, map, switchMap, take, tap } from 'rxjs/operators';
import { ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { MatchService } from 'src/app/matches/match.service';
import { User } from 'src/app/shared/models/user';
import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import { select, Store } from '@ngrx/store';
import { ClubState } from 'src/app/club/store/club.reducers';
import { getCurrentClubId } from 'src/app/club/store';
import { ColorStyle, FontSize } from 'src/app/shared/models/style';

export enum SelectFriendsConfig {
  BOOKING_CREATE = 1,
  MATCH_CREATE,
  MATCH_UPDATE,
}

@Component({
  selector: 'app-select-friends',
  templateUrl: './select-friends.component.html',
  styleUrls: ['./select-friends.component.scss']
})
export class SelectFriendsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('inputSearchFriend', { read: ElementRef }) inputSearchFriend: ElementRef;
  @Input() action = 'add';
  @Input() config = SelectFriendsConfig.BOOKING_CREATE;
  @Input() maxAttenders: number;
  @Input() selectedFriends: Array<any> = []; // Array<Friend|AttenderBooking>
  @Input() isCreationMode = false;

  @Input() matchIRI: string;
  @Input() attenders: Array<any>;
  @Input() activityId: string;
  @Input() activityLevels: Array<any>;
  @Input() matchLevels: Array<any>;
  @Input() levelRequired: boolean;
  @Input() typeOfUser: string;
  @Output() closeList = new EventEmitter();

  env;
  displaySkeleton = false;
  selectedFriendsCopy: Array<any>;
  preSearchUsersToShow: Array<any>;
  searchResults: Array<any>;
  search: string;
  friendsSubscription$: Subscription;
  searchSubscription$: Subscription;
  searchedFriend: User;
  guestList: Array<any>;
  allSubscriptions$ = new Subscription();
  showSearchSpinner: boolean;
  searchComplete: boolean;
  displaySearchErrorMessage: boolean;

  clubIdSub: Subscription;
  clubId: string;

  hasLoaded = false;

  ColorStyle = ColorStyle;
  FontSize = FontSize;

  constructor(
    private friendService: FriendService,
    private modalCtr: ModalController,
    private translate: TranslateService,
    private matchService: MatchService,
    private platform: Platform,
    private environmentService: EnvironmentService,
    private clubStore: Store<ClubState>  ) {
    this.env = this.environmentService.getEnvFile();
    this.searchResults = [];
    this.search = '';
    this.platform.backButton.subscribe(() => {
      this.modalCtr.dismiss(this.selectedFriendsCopy);
    });
  }

  ngOnInit(): void {
    this.clubIdSub = this.clubStore.pipe(
      select(getCurrentClubId),
      tap((id: any) => {
        this.clubId = id;
      })
    ).subscribe();

    this.selectedFriendsCopy = [...this.selectedFriends];

    if (this.config === SelectFriendsConfig.BOOKING_CREATE || this.config === SelectFriendsConfig.MATCH_CREATE) {
      if (!this.typeOfUser || this.typeOfUser === 'friend') {
        if (this.activityId === undefined) {
          this.allSubscriptions$.add(this.friendService.getFriends()
            .pipe(
              tap( friends => {
                this.preSearchUsersToShow = [...friends].map(friend => {
                  friend.hasBeenAdded = this.friendHasBeenAdded(friend);
                  return friend;
                });
              })
            )
            .subscribe(
              () => {
                this.hasLoaded = true;
              }
            )
          );
        } else {
          this.allSubscriptions$.add(this.friendService.getFriends(this.activityId)
            .pipe(
              map( friends => friends.map( friend => {
                if (friend.activityLevel !== undefined && friend.activityLevel !== null) {
                  friend.levelToDisplay = this.composeLevelText(friend.activityLevel.identifier);
                  friend.hasRequiredLevel = this.checkIfFriendHasLevel(friend.activityLevel.identifier);
                } else {
                  friend.levelToDisplay = this.composeLevelText(undefined);
                  friend.hasRequiredLevel = this.checkIfFriendHasLevel(undefined);
                }
                friend.hasBeenAdded = this.checkIfFriendHasBeenAdded(friend.id);
                return friend;
              })),
              tap(friends => {
                this.preSearchUsersToShow = friends;
              })
            )
            .subscribe(
              () => {
                this.hasLoaded = true;
              }
            )
          );
        }
      } else if (this.typeOfUser === 'customer') {
        this.preSearchUsersToShow = [];
      }
    } else if (this.config === SelectFriendsConfig.MATCH_UPDATE) {
      if (!this.typeOfUser || this.typeOfUser === 'friend' ) {
        if (this.activityId === undefined) {

          this.allSubscriptions$.add(
            forkJoin(
              [
                this.friendService.getFriends(),
                this.matchService.getMatchGuests(this.matchIRI)
              ]
            )
            .pipe(
              map( stream => {
                if (this.action === 'add') {
                  return {
                    friends: stream[0],
                    guests: stream[1]['hydra:member']
                  };
                } else {
                  const tmpFriends = this.filterFriendsAlreadyInvited(stream[0], stream[1]['hydra:member']);
                  const tmpFriends1 = this.filterFriendsAlreadyAtttending(tmpFriends, this.attenders);
                  return {
                    friends: tmpFriends1,
                    guests: stream[1]['hydra:member']
                  };
                }
              }),
              tap( stream => {
                this.preSearchUsersToShow = [...stream.friends].map(friend => {
                  friend.hasBeenAdded = this.friendHasBeenAdded(friend);
                  return friend;
                });
                this.guestList = [...stream.guests];
              })
            )
            .subscribe(
              () => {
                this.hasLoaded = true;
              }
            )
          );
        } else {
          this.allSubscriptions$.add(
            forkJoin(
              [
                this.friendService.getFriends(this.activityId),
                this.matchService.getMatchGuests(this.matchIRI)
              ]
            )
            .pipe(
              map( stream => {
                if (this.action === 'add') {
                  return {
                    friends: stream[0],
                    guests: stream[1]['hydra:member']
                  };
                } else {
                  const tmpFriends = this.filterFriendsAlreadyInvited(stream[0], stream[1]['hydra:member']);
                  const tmpFriends1 = this.filterFriendsAlreadyAtttending(tmpFriends, this.attenders);
                  return {
                    friends: tmpFriends1,
                    guests: stream[1]['hydra:member']
                  };
                }
              }),
              tap( stream => {
                this.preSearchUsersToShow = [...stream.friends];
                this.guestList = [...stream.guests];
              }),
              tap( _ => {
                this.preSearchUsersToShow = this.preSearchUsersToShow.map(friend => {
                  friend.hasBeenAdded = this.friendHasBeenAdded(friend);
                  return friend;
                })
                .map( friend => {
                  if (friend.activityLevel !== undefined && friend.activityLevel !== null) {
                    friend.levelToDisplay = this.composeLevelText(friend.activityLevel.identifier);
                    friend.hasRequiredLevel = this.checkIfFriendHasLevel(friend.activityLevel.identifier);
                  } else {
                    friend.levelToDisplay = this.composeLevelText(undefined);
                    friend.hasRequiredLevel = this.checkIfFriendHasLevel(undefined);
                  }
                  return friend;
                });
              })
            )
            .subscribe(
              () => {
                this.hasLoaded = true;
              }
            )
          );
        }
      } else {
        this.preSearchUsersToShow = [];
      }
    }
  }

  ionViewDidEnter() {
    if (this.typeOfUser === 'customer') {
      setTimeout(() => {
        this.inputSearchFriend.nativeElement.setFocus();
      }, 200);
    }
  }

  ngAfterViewInit() {
      this.allSubscriptions$.add(fromEvent(this.inputSearchFriend.nativeElement, 'keyup')
      .pipe(
        map( () => {
          if (this.inputSearchFriend.nativeElement.value.length >= 3) {
            return this.inputSearchFriend.nativeElement.value;
          }
        }),
        tap( () => {
          this.displaySkeleton = true;
          this.showSearchSpinner = false;
          this.searchComplete = false;
          this.displaySearchErrorMessage = false;
        }),
        /* TODO: refactoring in progress / delete  */
        // filter(Boolean),
        // filter((event: string) => event.length > 2),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap( searchString => {
          this.showSearchSpinner = true;
          this.searchComplete = false;
          this.displaySearchErrorMessage = false;
          if (this.typeOfUser === 'friend' || !this.typeOfUser) {
            return this.friendService.getFriends(this.activityId, searchString);
          } else {
            return this.friendService.getCustomerBySearch(this.clubId, searchString);
          }
        }),
        map( users => {
          return users.map( user => {
            if (user.activityLevel !== undefined && user.activityLevel !== null) {
              user.levelToDisplay = this.composeLevelText(user.activityLevel.identifier);
              user.hasRequiredLevel = this.checkIfFriendHasLevel(user.activityLevel.identifier);
            } else {
              user.levelToDisplay = this.composeLevelText(undefined);
              user.hasRequiredLevel = this.checkIfFriendHasLevel(undefined);
            }
            user.hasBeenAdded = this.checkIfFriendHasBeenAdded(user.id);
            return user;
          });
        }),
        tap( response => {
          this.searchResults = response;
          this.hasLoaded = true;
          // this.selectedFriendsCopy.unshift(response);
          if (response !== undefined) {
            this.searchedFriend = response[0];
            if (this.searchedFriend) {
              const indexOfFriendInArray = this.preSearchUsersToShow
                .indexOf(this.preSearchUsersToShow.find( friend => friend.id === this.searchedFriend.id));
              if (indexOfFriendInArray > -1) {
                this.preSearchUsersToShow.splice(indexOfFriendInArray, 1);
                this.preSearchUsersToShow.unshift(this.searchedFriend);
              }
              this.displaySearchErrorMessage = false;
            } else {
              this.displaySearchErrorMessage = true;
            }
            this.showSearchSpinner = true;
            this.searchComplete = true;
            this.displaySkeleton = false;
          } else {
            this.showSearchSpinner = true;
            this.searchComplete = true;
            this.displaySkeleton = false;
            this.displaySearchErrorMessage = true;
          }
        })
      )
      .subscribe()
      );
  }

  ngOnDestroy() {
    this.allSubscriptions$.unsubscribe();
  }

  friendHasBeenAdded(friend): boolean {
    let hasBeenAdded = false;
    switch (this.action) {
      case 'add':
        hasBeenAdded = this.checkIfFriendHasBeenAdded(friend.id);
        break;
      case 'invite':
        hasBeenAdded = this.checkIfFriendHasBeenInvited(friend['@id']);
        break;
      default:
        hasBeenAdded = this.checkIfFriendHasBeenAdded(friend.id);
        break;
    }
    return hasBeenAdded;
  }

  composeLevelText(levelNumber): string {
    if ((this.levelRequired === true && this.checkIfFriendHasLevel(levelNumber) === false)) {
      return this.translate.instant('do_not_have_required_level');
    } else if (levelNumber === undefined) {
      return this.translate.instant('level_not_filled');
    } else {
      const matchingLevel = this.activityLevels.find( level => level.identifier === levelNumber);
      if (matchingLevel) {
        return `${this.translate.instant('level')} ${matchingLevel.identifier}. ${matchingLevel.label}`;
      } else {
        return this.translate.instant('user_do_not_have_match_level');
      }
    }
  }

  checkIfFriendHasLevel(levelNumber): boolean {
    if (levelNumber === undefined) {
      return false;
    }
    return levelNumber >= this.matchLevels[0].identifier && levelNumber <= this.matchLevels[1].identifier;
  }

  checkIfFriendHasBeenAdded(friendId): boolean {
    return this.selectedFriendsCopy.find( attender => attender.user?.id === friendId) !== undefined ? true : false;
  }

  checkIfFriendHasBeenInvited(friendId): boolean {
    if (this.guestList !== undefined) {
      return this.guestList.find( guest => guest.userClient['@id'] === friendId) !== undefined ? true : false;
    } else {
      return false;
    }
  }

  showFriend(friend: Friend): boolean {
    const concat = friend.firstName.toLowerCase() + ' ' + friend.lastName.toLowerCase();
    if (concat.includes(this.search.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  /* : Friend */
  addFriend(user) {
    if(this.noMoreFriend()){
      return;
    }
    this.selectedFriendsCopy.push({user});
    user.hasBeenAdded = true;
    /* this.selectedFriends.push({
      pathAvatar: null,
      restToPay: null,
      id: friend['@id'],
      '@id': friend['@id'],
      userId: friend.id,
      firstName: friend.firstName,
      lastName: friend.lastName,
      avatar: friend.avatar,
      birthDate: friend.birthDate,
      phoneNumber: friend.phoneNumber
    }); */
  }

  removeFriend(friend: Friend) {
    const newSelectedFriends = [];
    this.selectedFriendsCopy.forEach(item => {
      if (item.user.id !== friend.id) {
        newSelectedFriends.push(item);
      }
    });
    this.selectedFriendsCopy = newSelectedFriends;
  }

  closeModal(saveChanges: boolean) {
    // If back button pressed we don't save changes
    // If 'finished' button pressed we save changes
    if (saveChanges) {
      if (!this.isCreationMode && this.action === 'invite') {
        if (this.selectedFriendsCopy.length) {
          this.selectedFriendsCopy.forEach( friend => {
            this.matchService.inviteFriend(this.matchIRI, friend.user['@id'])
              .pipe(
                take(1),
                tap( invited => {
                  if (invited !== undefined) {
                    this.modalCtr.dismiss(this.selectedFriendsCopy);
                  } else {
                    /* TODO: how to deal with errors ? */
                    return;
                  }
                })
              )
              .subscribe();
          });
        }
      } else {
        this.modalCtr.dismiss(this.selectedFriendsCopy);
      }
    } else {
      this.modalCtr.dismiss(this.selectedFriends);
    }
  }

  isSelected(friend: Friend) {
    let result = false;
    this.selectedFriendsCopy.forEach(item => {
      if (item.id === friend.id) {
        result = true;
      }
    });
    return result;
  }

  noMoreFriend() {
    return (this.maxAttenders <= this.selectedFriendsCopy.length - 1);
  }

  filterFriendsAlreadyInvited(friends, guests) {
    const tmpFriends = [...friends];
    guests.forEach(guest => {
      friends.forEach(friend => {
        if (friend['@id'] === guest.userClient['@id']) {
          const index = tmpFriends.findIndex(f => f['@id'] === guest.userClient['@id']);
          if (index !== -1) {
            tmpFriends.splice(index, 1);
          }
        }
      });
    });
    return tmpFriends;
  }

  filterFriendsAlreadyAtttending(friends, attenders) {
    const tmpFriends = [...friends];
    attenders.forEach(att => {
      friends.forEach(friend => {
        if (friend['@id'] === att.user['@id']) {
          const index = tmpFriends.findIndex(f => f['@id'] === att.user['@id']);
          if (index !== -1) {
            tmpFriends.splice(index, 1);
          }
        }
      });
    });
    return tmpFriends;
  }
}
