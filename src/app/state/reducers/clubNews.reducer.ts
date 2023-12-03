import { createReducer, on } from '@ngrx/store';
import { ClubNews } from 'src/app/shared/models/club-news';
import * as ClubNewsActions from '../actions/clubNews.actions';

export class ClubNewsState {
    clubNewsList: ClubNews[];
    totalItems: number;
}

const initialState: ClubNewsState = {
    totalItems: 0,
    clubNewsList: []
}

export const clubNewsReducer = createReducer(
    initialState,
    on(ClubNewsActions.getClubNewsList, state => state),
    on(ClubNewsActions.getClubNewsListSuccess, (_state: ClubNewsState, { payload }) => {
        return payload
    })
)

