import { Injectable } from "@angular/core";
import * as moment from "moment-timezone";

@Injectable({
    providedIn: 'root',
})
export class DateUtil {

    constructor() { }

    getLocaleDateFromUTC(dateUtc: string, timeZone: string, keepLocal = false): moment.Moment {
        return moment.utc(dateUtc).tz(timeZone, keepLocal);
    }

    getLocaleDateFromClubTimeZone(date: string, localeTimeZone: string, clubTimeZone: string): moment.Moment {
        let localeDate: moment.Moment;
        const localeUtcOffset = moment.tz(moment.utc(), localeTimeZone).utcOffset();
        const clubUtcOffset = moment.tz(moment.utc(), clubTimeZone).utcOffset();
        localeDate = moment(date).utc();
        localeDate.add(clubUtcOffset - localeUtcOffset, 'minutes');
        return localeDate;
    }

    initLimitSearch(start: moment.Moment, selectedTime: moment.Moment): moment.Moment{
        const limitSearch = start.clone();
        limitSearch.set({
            hour: selectedTime.get('hour'),
            minute: selectedTime.get('minute'),
            second: 0
        });
        return limitSearch;
    }


}
