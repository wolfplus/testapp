import { Activity } from '../../club/models/activity';
import {Price} from './price';

export interface Playground {
  '@id': string;
  id: string;
  prices?: Array<Price>;
  type: string;
  name: string;
  activities: Activity[];
  participantCounts: Array<number>;
  club: string;
  bookingValidationNeeded: boolean;
  createdAt: string;
  defaultParticipantCount: number;
  description: string;
  indoor: boolean;
  options: Array<any>;
  rules: Array<any>;
  surface: any;
  updatedAt: string;
  photos?: Array<any>;
  mainPhoto?: any;
  bookingCancellationConditionType: string;
  bookingCancellationConditionCustomHours: number;
  timetables: Timetables;
}

export interface Timetables {
  endAt: string;
  startAt: string;
}
