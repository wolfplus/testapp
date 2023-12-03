import { Injectable } from '@angular/core';
import {HttpService} from '../http.service';
import { Observable, of} from 'rxjs';
import {UserService} from '../storage/user.service';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { EnvironmentService } from '../environment/environment.service';
import {select, Store} from "@ngrx/store";
import {ClubState} from "../../../club/store/club.reducers";
import {getCurrentClubId} from "../../../club/store";

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  currentClubId$: any;
  currentClub = '';

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private environmentService: EnvironmentService,
    private clubStore: Store<ClubState>
  ) {
    this.currentClubId$ = this.clubStore.pipe(
        select(getCurrentClubId)
    );
  }

  async get() {
    return this.getFriends();
  }

  sendInvit(data) {
    if (this.environmentService.getEnvFile().useMb && this.environmentService.getEnvFile().marqueBlanche.whiteLabelId) {
      data.clubWhiteLabel = '/clubs/white-labels/' +  this.environmentService.getEnvFile().marqueBlanche.whiteLabelId;
    } else {
      // TODO get club id
    }
    return this.httpService.baseHttp('post', '/user-clients/friend-requests', data, true);
  }

  getFriendRequest(id) {
    return this.httpService.baseHttp('get', '/user-clients/friend-requests/' + id, [], true);
  }

  getFriendRequests() {
    return this.httpService.baseHttp('get', '/user-clients/friend-requests', {}, true);
  }

  acceptInvit(iri: string) {
    const data = {
      acceptedDate: moment().format('YYYY-MM-DD HH:mm'),
    };
    return this.httpService.baseHttp('put', iri, data, true);
  }

  cancelInvit(iri: string) {
    return this.httpService.baseHttp('delete', iri, [], true);
  }

  removeFriendShip(userClientFriendId) {
    return this.httpService.baseHttp('delete', `/user-clients/friendships/${userClientFriendId}`, [], true);
  }

  getFriends(activityId?, searchString?): Observable<Array<any>> {
    let params = "";
    if (activityId) {
      params += `?showActivityLevelOn=${activityId}`;
      if (searchString) {
        params += `&search=${searchString}`;
      }
    } else if (searchString) {
      params += `?search=${searchString}`;
    }

    return this.httpService.baseHttp<any>('get', '/user-clients/friends' + params, [], true)
        .pipe(map(friends => {
          if (friends !== undefined) {
            if (friends['hydra:member']) {
              return friends['hydra:member'];
            } else {
              return [];
            }
          }
        }));
  }
  getCustomerBySearch(clubId, searchText) {
    return this.httpService.baseHttp<any>('get', `/clubs/clients?club.id=${clubId}&search=${searchText}`).pipe(map(users => {
      if (users !== undefined) {
        if (users['hydra:member']) {
          return users['hydra:member'];
        } else {
          return [];
        }
      }
    }));
  }

  getFriendsTest() {
    let xx = of([]);

    this.userService.get().subscribe(user => {
      xx = this.httpService.baseHttp<any>('get', '/user-clients/' + user.id + '/friends', [], true);
    });
    return xx;
  }

  findUser(name: string, clubWhiteLabelId: string) {
    let params;
    if (clubWhiteLabelId) {
      params = `search=${name}&clubWhiteLabel.id=${clubWhiteLabelId}`;
    } else {
      this.currentClubId$.subscribe(clubId => {
        params = `search=${name}&club.id[]=${clubId}`;
      });
    }
    return this.httpService.baseHttp<Array<any>>('get', `/user-clients?${params}`, {}, true);
      /* .pipe(
        map(users => {
        if (users !== undefined) {
          if (users['hydra:member']) {
            return users['hydra:member'];
          } else {
            return [];
          }
        }
      })); */
  }

  loadMoreUsers(nextPage: string) {
    return this.httpService.baseHttp<Array<any>>('get', nextPage, {}, true);
      /* .pipe(
        map(users => {
        if (users !== undefined) {
          if (users['hydra:member']) {
            return users['hydra:member'];
          } else {
            return [];
          }
        }
        })
      ); */
  }
}
