import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClubNewsList, IClubNewsList } from '../../models/club-news';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class ClubNewsService {
  clubNewsSubject$ = new BehaviorSubject<any>([]);
  clubNews$ = this.clubNewsSubject$.asObservable();

  constructor(
    private httpService: HttpService
  ) { }

  getClubNewsList(clubId: string, limit = 5): Observable<IClubNewsList> {
    return this.httpService.baseHttp('get', `/clubs/news?club.id=${clubId}&itemsPerPage=${limit}`, {}, false)
      .pipe(
        map(result => {
          if (result !== undefined && result['hydra:member']) {
            const clubNewsList: IClubNewsList = new ClubNewsList(result['hydra:member'], result['hydra:totalItems']);
            return clubNewsList;
          } else {
            const clubNewsList: IClubNewsList = new ClubNewsList([], 0);
            return clubNewsList;
          }
        })
    );
  }

  /* new.shortContent = new.content.replace(/<[^>]*>?/gm, ''); */

  getAllNewsNextPage() {
  }

  getNewsDetails(newsIri) {
    return this.httpService.baseHttp<any>('get', `${newsIri}`, {}, false);
  }

}
