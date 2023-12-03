import { Period } from "../enums/period";
import * as moment from "moment";

/*@Input() Booking[] | ClubMatch[] */
export function byDate(events, period) {
  let pastEvents = [];
  let pastEventsByDate = [];
  let yesterdayEvents = [];
  let todayEvents = [];
  let tomorrowEvents = [];
  let otherDaysEvents = [];
  let otherDaysEventsByDate = [];

  if (period === Period.CANCELED || period === Period.PAST) {

    pastEvents = events.filter( event => {
      return (moment(event.startAt).unix() < moment().minute(0).hour(0).second(0).millisecond(0).subtract(1, 'days').unix());
    });

    pastEventsByDate = groupByDate(pastEvents);
    yesterdayEvents = events.filter( event => {
      return (moment().minute(0).hour(0).second(0).millisecond(0).subtract(1, 'days').format('LL') === moment(event.startAt).format('LL'));
    });
  }

  if (period !== Period.PAST) {
    todayEvents = events.filter( event => {
      return (moment().minute(0).hour(0).second(0).millisecond(0).format('LL') === moment(event.startAt).format('LL'));
    });

    tomorrowEvents = events.filter( event => {
      return (moment().minute(0).hour(0).second(0).millisecond(0).add(1, 'days').format('LL') === moment(event.startAt).format('LL'));
    });

    otherDaysEvents = events.filter( event => {
      return moment(event.startAt).isAfter((moment().minute(0).hour(0).second(0).millisecond(0).add(2, 'days')));
    });

    otherDaysEventsByDate = groupByDate(otherDaysEvents);

  }

  return {
    pastEvents,
    pastEventsByDate,
    yesterdayEvents,
    todayEvents,
    tomorrowEvents,
    otherDaysEvents,
    otherDaysEventsByDate
  };

}

export function groupByDate(events: Array<any>) {
  events.forEach(event => {
    event.date = moment(event.startAt).format('LL');
  });

  const eventsGroupedBydate = events.reduce((a, b) => {
    const foundEvent = a.find((event) => event.date === b.date);
    if (foundEvent) {
      foundEvent.events.push(b);
    } else {
      a.push({ date: b.date, events: [b] });
    }
    return a;
  }, []);

  return eventsGroupedBydate;
}
