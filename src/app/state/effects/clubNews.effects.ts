import { IClubNewsList } from 'src/app/shared/models/club-news';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ClubNewsService } from 'src/app/shared/services/news/club-news.service';

import * as ClubNewsActions from 'src/app/state/actions/clubNews.actions';

@Injectable()
export class ClubNewsEffects {

    constructor(
        private actions$: Actions,
        private clubNewsService: ClubNewsService
    ) { }
    
    getClubNewsList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ClubNewsActions.getClubNewsList),
            mergeMap((action) =>
                this.clubNewsService.getClubNewsList(action.payload).pipe(
                    map((result: IClubNewsList) => {
                        return ClubNewsActions.getClubNewsListSuccess({ payload: result })
                    }),
                    catchError((error) => {
                        console.error("[ClubNewsEffects] ERROR : " + error.message)
                        return of(error)
                    })
                )
            )
        )
    );



}
