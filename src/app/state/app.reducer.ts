import { AppState } from './app.state';
import { createReducer } from '@ngrx/store';

const initialState: {} = {};

export const appReducer = createReducer<AppState>(
  initialState as AppState
);
