import { createAction, props } from '@ngrx/store';
import { IClubNewsList } from 'src/app/shared/models/club-news';

export const getClubNewsList = createAction('[CLUB_NEWS] Get list',
  props<{
    payload: string;
  }>());

export const getClubNewsListSuccess = createAction(
  '[CLUB_NEWS] Get list sucess',
  props<{
    payload: IClubNewsList;
  }>(),
);
