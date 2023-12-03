import { createAction, props } from '@ngrx/store';
import { Positions } from '../shared/services/toast.service';

export function formatToastPropsAsObject(color: string, textKey: string, position?: Positions, duration?: number) {
  return {color, textKey, position, duration};
}

export const navigateToHomePage = createAction(
  '[Nav Page] navigateToHomePage',
);

export const displayToastMessage = createAction(
  '[App] displayToastMessage',
  props<{color: string, textKey: string, position: Positions, duration: number}>()
);

export const displayToastError = createAction(
  '[App] displayToastError',
  props<{textKey: string}>()
);
