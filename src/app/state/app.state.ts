import { Filter } from '../shared/models/filter';
import {Geolocation} from '../shared/models/geolocation';
import {User} from '../shared/models/user';
import { ClubNewsState } from './reducers/clubNews.reducer';
import { MyMatchesState } from './reducers/myMatches.reducer';

export interface AppState {
  filter: Filter[];
  search: string;
  validatedSearch: string;
  geolocation: Geolocation;
  selectedDate: string;
  user: User;
  shop: Array<any>;
  clubNews: ClubNewsState;
  myMatches: MyMatchesState;
  accountState: any
}

export interface State {
  appState: AppState;
}

export type QueryStatus = '' | 'pending' | 'success' | 'failure';
