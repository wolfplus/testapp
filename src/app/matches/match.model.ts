// TODO: update the model
// TODO: set a Playground model
// TODO: set a Preferences model
// TODO: set a Sport model

import { Club } from '../shared/models/club';
import {Playground} from '../shared/models/playground';
import {Activity} from '../shared/models/activity';
import {ClientClub} from '../shared/models/client-club';
import {ActivityLevel} from '../shared/models/activity-level';

export interface ClubMatch {
  '@id': string;
  '@type': string;
  access: string;
  activity: Activity;
  activityLevelRequired: boolean;
  activityLevels: Array<ActivityLevel>;
  booking: string;
  canceled: boolean;
  club: Club;
  createdAt: string;
  creationOrigin: string;
  deepLink: string | null;
  description: string;
  endAt: string;
  genderLimitation: string;
  id: string;
  maxAgeLimitation: number;
  maxParticipantsCountLimit: number;
  minAgeLimitation: number;
  name: string;
  participants: Array<any>;  // Array<AttenderBooking>;
  participantsCount: number;
  playground: Playground;
  pricePerParticipant: number;
  startAt: string;
  updatedAt: string;
  userClient: ClientClub;
  userGuests?: Array<any>;
  duration?: number;
}

/* export interface ClubMatch {
  activityLevelRequired: boolean;
  activity: Activity;
  activityLevels: Array<ActivityLevel>;
  playground: Playground;
  surface: string;
  userClient: ClientClub;
  userGuests: Array<any>;
  participants: Array<any>;
  id: string;
  name: string;
  description: string;
  maxParticipantsCountLimit: number;
  startDate: string;
  endDate: string;
  limitRegistrationDate: string;
  access: string;
  club: Club;
  city: string;
  maxAgeLimitation: number;
  minAgeLimitation: number;
  genderLimitation: string;
  deepLink: string | null;
  createdAt: string;
  updatedAt: string;
  duration?: number;
  startAt: string;
  endAt: string;
} */
