import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { EnvironmentService } from '../environment/environment.service';
import {map} from "rxjs/operators";
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(
    private httpService: HttpService,
    private environmentService: EnvironmentService
  ) { }

  get(activityUri: string) {
    return this.httpService.baseHttp<Array<any>>(
        'get',
        activityUri,
        [],
        false
    );
  }

  getByClub(clubId: string) {
    return this.httpService.baseHttp<Array<any>>(
        'get',
        '/activities?club.id=' + clubId,
        [],
        false
    );
  }

  getActivitiesHighlighted() {
    return this.httpService.baseHttp<Array<any>>(
        'get',
        '/activities?highlighted=true',
        [],
        false
    );
  }

  getSurfaces(clubId?) {
    if (clubId !== undefined) {
      return this.httpService.baseHttp<Array<any>>(
        'get',
        '/surfaces?club.id=' + clubId,
        [],
        false
    );
    } else {
      return this.httpService.baseHttp<Array<any>>(
          'get',
          '/surfaces',
          [],
          false
      );
    }
  }

  getActivities(clubId?) {
    if (clubId !== undefined) {
      return this.httpService.baseHttp<Array<any>>(
        'get',
        '/activities?type[]=sport&type[]=leisure&club.id=' + clubId,
        [],
        false
    );
    } else {
      let params = '?type[]=sport&type[]=leisure';

      if (this.environmentService.getEnvFile().useMb) {
        this.environmentService.getEnvFile().marqueBlanche.clubIds.forEach(id => {
          params += '&club.id[]=' + id;
        });
      }
      return this.httpService.baseHttp<Array<any>>(
          'get',
          `/activities${params}`,
          [],
          false
      );
    }
  }

  getActivitiesByCategory(categoryId, clubId) {
    if (categoryId && clubId) {
      return this.httpService.baseHttp('get',
          `/activities?club.block.price.category.id=${categoryId}&club.id=${clubId}`, [], false)
          .pipe(
              map( dataMap => dataMap['hydra:member'])
          );
    }
    return of(undefined);
  }

  getPrestations(categoryId, activityId, clubId, activityType = null) {
    if (categoryId && clubId && activityId) {
      let paramsType = '';
      if (activityType) {
        paramsType = `&activityType[]=${activityType}`
      }
      return this.httpService.baseHttp('get',
          `/clubs/playgrounds/timetables/blocks/prices?club.id=${clubId}&category.id=${categoryId}&activity.id=${activityId}${paramsType}`, [], false)
          .pipe(
              map( dataMap => dataMap['hydra:member'])
          );
    }
    return of(undefined);
  }

  getBlockPrice(blockPriceId) {
    if (blockPriceId) {
      return this.httpService.baseHttp('get',
          `/clubs/playgrounds/timetables/blocks/prices/${blockPriceId}`, [], false);
    }
    return of(undefined);
  }

  getSlots(playgroundId, blockPriceId, date) {
    if (playgroundId && blockPriceId && date) {
      return this.httpService.baseHttp(
          'get',
          `/clubs/playgrounds/${playgroundId}/slots?blockPrice.id=${blockPriceId}&date=${date}`,
          [],
          false
      );
    }
    return of(undefined);
  }
}
