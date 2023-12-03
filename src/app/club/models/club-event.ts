// TODO: update model

import { Club } from "src/app/shared/models/club";

export interface ClubEvent {
  id: string;
  clubId?: string;
  club?: Club;
  pricePerParticipant?: number;
  currency?: string;
  photo?: string;
  type?: string;
  name?: string;
  category?: string;
  levels?: Array<any>;
  max_attenders?: number;
  attenders?: Array<any>; /* TODO: add a type for player or event attender */
  gender?: number;
  startAt?: Date;
  endAt?: Date;
  limitRegistrationDate?: Date;
  cancellationConditions?: {type: string, condition: string};
  description?: string;
  address?: { street: string, zipCode: string, city: string};
}
