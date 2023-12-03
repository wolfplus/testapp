import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {HttpService} from '../http.service';
import {select, Store} from "@ngrx/store";
import {AppState} from "../../../state/app.state";
import {getCurrentClub} from "../../../club/store";
import {Club} from "../../models/club";

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private currentClub: Club;

  constructor(
      private httpService: HttpService,
      private store: Store<AppState>,
  ) {
    this.store.pipe(select(getCurrentClub)).subscribe(currentClub => {
      this.currentClub = currentClub;
    });
  }

  get() {
    return this.httpService.baseHttp('get', '/user-clients/related-activities');
  }

  addUserLevel(data) {
    return this.httpService.baseHttp('post', '/user-clients/related-activities', data, true);
  }

  updUserLevel(iri, data) {
    return this.httpService.baseHttp('put', iri, data, true);
  }

  getActivityLevels(activityId) {
    return this.httpService.baseHttp('get', `/activities/levels?activity.id=${activityId}&country=${this.currentClub.country}`)
      .pipe(
        map( levels => levels['hydra:member']),
        catchError( error => of(error))
      );
  }
}
