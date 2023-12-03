import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { getClubSummary } from '../../store';
import { ClubState } from '../../store/club.reducers';

export interface ClubSummary {
  name: string;
  city: string;
  zipCode: string;
}

@Component({
  selector: 'app-club-summary',
  templateUrl: './club-summary.component.html',
  styleUrls: ['./club-summary.component.scss']
})
export class ClubSummaryComponent implements OnInit {
  clubSummary$: Observable<any>;

  constructor(private store: Store<ClubState>) {}

  ngOnInit() {
    // TODO fix it find out why selector return null properties
    this.clubSummary$ = this.store.select(getClubSummary)
      .pipe(
        filter(Boolean),
        map((clubSummary: ClubSummary) => {
          return {
            name: clubSummary.name,
            city: clubSummary.city,
            zipCode: this.formatZipCodeToDistrict(clubSummary.city, clubSummary.zipCode)
          };
        })
      );
  }

  formatZipCodeToDistrict(city: string, zipCode): string{
    let newZip;
    if (city !== undefined && zipCode !== undefined) {
      if (
        city.toLowerCase() === "lyon" ||
        city.toLowerCase() === "marseille" ||
        city.toLowerCase() === "paris"
      ) {
        newZip = (zipCode.toString().slice(zipCode.toString().length - 2));
      }
    }
    return newZip;
  }

}
