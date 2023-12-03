import { Component, OnInit } from '@angular/core';
import {ClubService} from '../../../shared/services/club/club.service';
import {switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {UserService} from '../../../shared/services/storage/user.service';
import {Club} from '../../../shared/models/club';
import { User } from 'src/app/shared/models/user';

@Component({
    selector: 'app-my-clubs',
    templateUrl: './my-clubs.component.html',
    styleUrls: ['./my-clubs.component.scss'],
})
export class MyClubsComponent implements OnInit {

    myClubs: Club[];
    skeletonShow: boolean;
    user: User;
    clubsAreAroundMe: boolean;
    clubsAreMyFavorite: boolean;
    onlyOneDisplayed: boolean;
    // subscriptionUser$
    constructor(
        private clubService: ClubService,
        private userService: UserService
    ) {
        this.skeletonShow = true;
        this.myClubs = [];
    }

    ngOnInit() {
        this.userService.get()
            .pipe(
                switchMap(user => {
                    if (user) {
                        this.user = user;
                        return this.clubService.getMyClubs(user.id);
                    } else {
                        return of(null);
                    }
                }),
                switchMap(data => {
                    if (data !== null && data['hydra:member'].length) {
                        this.myClubs = data['hydra:member'];
                        this.myClubs = this.myClubs.map( club => {
                            if (this.user !== undefined) {
                                club.isPreferred = this.clubIsPreferred(this.user, club['@id']);
                            }
                            return club;
                        });
                        this.clubsAreMyFavorite = true;
                        this.clubsAreAroundMe = false;
                        if (this.myClubs.length === 1) {
                            this.onlyOneDisplayed = true;
                        } else {
                            this.onlyOneDisplayed = false;
                        }
                        this.skeletonShow = false;
                        return of(true);
                    }
                    return of(false);
                }),
                switchMap(bool => {
                    if (bool === false) {
                        return this.clubService.searchClub(5, true);
                    } else {
                        return of(null);
                    }
                }),
                tap(clubs => {
                    if (clubs !== null)  {
                        this.clubsAreMyFavorite = false;
                        this.clubsAreAroundMe = true;
                        this.myClubs = [...clubs['hydra:member']];
                        this.myClubs = this.myClubs.map( club => {
                            if (this.user !== undefined) {
                                club.isPreferred = this.clubIsPreferred(this.user, club['@id']);
                            }
                            return club;
                        });
                    }
                    this.skeletonShow = false;
                }),
                tap( () => {
                    this.skeletonShow = false;
                })
            )
            .subscribe();

    }

    clubIsPreferred(user, clubIRI) {
        let isPreferred = false;
        if (user && user.preferredClubs.length > 0 && user.preferredClubs.includes(clubIRI)) {
          isPreferred = true;
        }
        return isPreferred;
    }
}
