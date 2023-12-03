import * as moment from 'moment';

export function getDurationInMinutes(startDate, endDate): number {
  let duration;
  const start = moment(startDate);
  const end = moment(endDate);
  duration = end.diff(start, 'minutes');
  return duration;
}
