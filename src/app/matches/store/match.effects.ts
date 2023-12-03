import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { ErrorService } from 'src/app/shared/services/error.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ClubMatch } from '../match.model';
import { MatchService } from '../match.service';
import { MatchActions } from './index';
import { MatchState } from './match.reducer';
import { ClubIdStorageService } from 'src/app/shared/services/clud-id-storage/club-id-storage.service';
import {ClubState} from "../../club/store/club.reducers";
import {getCurrentClub} from "../../club/store";


@Injectable()
export class MatchEffects {

  clubIds;

  constructor(
    private actions$: Actions,
    private matchService: MatchService,
    private errorService: ErrorService,
    private store: Store<MatchState>,
    private toast: ToastService,
    private translateService: TranslateService,
    private loaderService: LoaderService,
    private storeClub: Store<ClubState>,
    private clubIdStorageService: ClubIdStorageService
  ) {
      this.storeClub.select(getCurrentClub).pipe().subscribe();
    this.clubIds = this.clubIdStorageService.getClubIds();
  }

  createMatch$ = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(MatchActions.createMatch),
        withLatestFrom(this.store),
        mergeMap(([action]) => {
          return this.matchService.createMatch(action.matchData)
            .pipe(
              map( response => {
                if (response !== undefined) {
                  return MatchActions.createMatchSuccess({success: true});
                } else {
                  return MatchActions.createMatchFailure({ error: 'match_create_error' });
                }
              })
            );
        }),
        catchError(error => {
          // alert("ERROR: " + error);
          const errMessage = this.errorService.getMessage(error);
          // this.toast.presentError(errMessage);
          return of(MatchActions.createMatchFailure({ error: errMessage }));
        })
      );
  });

  loadMatchs$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(MatchActions.loadMatchs),
        withLatestFrom(this.store),
        mergeMap(([action]) => {
          if (
            action.parameters.clubIds === null &&
            action.parameters.searchTerm === "" &&
            (action.parameters.userPosition.latitude === null ||
              action.parameters.userPosition.longitude === null)
          ) {
            return of(MatchActions.loadMatchsRequestError({error: 'add_search_criterias'}));
          }
          return this.matchService.getMatches(action.parameters, false,null,true)
            .pipe(
              tap( response =>  this.store.dispatch(MatchActions.setHydraView({hydraView: response['hydra:view']}))),
              map( response => MatchActions.setAllMatchs({ matchs: response['hydra:member'] })),
            );
        }),
        catchError(error => {
          const errMessage = this.errorService.getMessage(error);
          this.toast.presentError(errMessage);
          return of(MatchActions.loadMatchsFailure({ error: errMessage }));
        })
      );
  });

  /* loadMatch$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(MatchActions.loadMatch),
        withLatestFrom(this.store),
        mergeMap(([action, store]) => {
          return this.matchService.getMatch(action.matchId)
            .pipe(
              tap( response => ),
              map( response => MatchActions.loadMatchSuccess({ match: response })),
              catchError(error => {
                const errMessage = this.errorService.getMessage(error);
                this.toast.presentError(errMessage);
                return of(MatchActions.loadMatchFailure({ error: errMessage }));
              })
            );
        }),
      );
  }); */

  setMatches$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(MatchActions.setAllMatchs),
        withLatestFrom(this.store),
        map(() => {
          return MatchActions.loadMatchsSuccess();
        })
      );
  });

  removeMatches$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(MatchActions.loadMatchsFailure),
        withLatestFrom(this.store),
        map(() => {
          return MatchActions.removeAllMatchs();
        })
      );
  });

  /* addMatch$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(MatchActions.addMatch),
        withLatestFrom(this.store),
        mergeMap(([action, store]) => {
          return this.matchService.addMatch(action.clubId,action.match)
            .pipe(
              map( (match: Match) => MatchActions.addMatchSuccess({ match })),
            )
        }),
        catchError(error => {
          const errMessage = this.errorService.getMessage(error);
          this.toast.presentError(errMessage)
          return of(MatchActions.addMatchFailure({ error: errMessage }))
        })
      )
  }) */

  updateMatch$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(MatchActions.updateMatch),
        withLatestFrom(this.store),
        mergeMap(([action]) => {
          return this.matchService.updateMatch(action.match)
            .pipe(
              map( (match: Update<ClubMatch>) => MatchActions.updateMatchSuccess({ match })),
            );
        }),
        catchError(error => {
          const errMessage = this.errorService.getMessage(error);
          this.toast.presentError(errMessage);
          return of(MatchActions.updateMatchFailure({ error: errMessage }));
        })
      );
  });

  deleteMatch$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(MatchActions.deleteMatch),
        withLatestFrom(this.store),
        mergeMap(([action]) => {
          return this.matchService.deleteMatch(action.id)
            .pipe(
              map( match => MatchActions.deleteMatchSuccess({ id: match.id })),
              tap( () => this.store.dispatch(MatchActions.matchDeletedSuccess())),
              tap( () => {
                if (this.loaderService.loading !== undefined) {
                  this.loaderService.dismiss();
                }
                const successMessage = this.translateService.instant('match_deletion_success');
                this.toast.presentSuccess(successMessage);
              })
            );
        }),
        catchError(() => {
          // const errMessage = this.errorService.getMessage(error);
          const errMessage = this.translateService.instant('match_deletion_error');
          this.toast.presentError(errMessage);
          return of(MatchActions.deleteMatchFailure({ error: errMessage }));
        })
      );
  });

}
