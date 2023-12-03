import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { Geolocation } from 'src/app/shared/models/geolocation';

@Component({
  selector: 'app-club-distance',
  templateUrl: './club-distance.component.html',
  styleUrls: ['./club-distance.component.scss']
})
export class ClubDistanceComponent implements AfterViewInit, OnDestroy {
  @Input() clubLocation$: Observable<Geolocation>;
  @Input() userLocation$: Observable<Geolocation>;
  @Input() showIcon = false;

  distance$: Observable<string | undefined>;
  count = 0;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  ngAfterViewInit() {
    this.distance$ = combineLatest([
      this.userLocation$.pipe(
        filter( loc => loc !== undefined),
        filter( loc => loc.latitude !== null && loc.longitude !== null)
      ),
      this.clubLocation$.pipe(
        filter( loc => loc !== undefined),
        filter( loc => loc.latitude !== null && loc.longitude !== null)
      )
    ])
    .pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap( stream => {
        if ( (stream[0].latitude !== null && stream[0].longitude !== null) &&
            (stream[1].latitude !== null && stream[1].longitude !== null) ) {
          return of(this.calculateDistance(stream[0], stream[1]));
        }
        return of(undefined);
      }),
    );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  calculateDistance(userLocation: Geolocation, clubLocation: Geolocation){
    const lat1 = userLocation.latitude;
    const radianLat1 = lat1 * (Math.PI / 180);
    const lng1 = userLocation.longitude;
    const radianLng1 = lng1 * (Math.PI / 180);
    const lat2 = clubLocation.latitude;
    const radianLat2 = lat2 * (Math.PI / 180);
    const lng2 = clubLocation.longitude;
    const radianLng2 = lng2 * (Math.PI / 180);
    const earthRadius = 6371; // or 3959 for miles
    const diffLat = (radianLat1 - radianLat2);
    const diffLng = (radianLng1 - radianLng2);
    const sinLat = Math.sin(diffLat / 2);
    const sinLng = Math.sin(diffLng / 2);
    const a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);
    const distance = earthRadius * 2 * Math.asin(Math.sqrt(a));

    return distance.toFixed(1);
  }

}
