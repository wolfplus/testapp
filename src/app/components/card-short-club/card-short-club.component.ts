import { AfterViewInit, Component, Input } from '@angular/core';
import { Club } from '../../shared/models/club';

import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ModalService } from '../../shared/services/modal.service';
import { AppState } from '../../state/app.state';
import * as LocationDistance from '../../shared/Tools/location-distance';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ClubDetailComponent } from 'src/app/club-detail/club-detail.component';

@Component({
  selector: 'app-card-short-club',
  templateUrl: './card-short-club.component.html',
  styleUrls: ['./card-short-club.component.scss'],
})
export class CardShortClubComponent implements AfterViewInit {
  @Input() club: Club;
  @Input() singleDisplay = false;
  pathFiles: string;
  heartIcon = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1850 1850"><g transform="matrix(1,0,0,-1,37.966102,1343.4237)"><path d="m 896,-128 q -26,0 -44,18 L 228,492 q -10,8 -27.5,26 Q 183,536 145,583.5 107,631 77,681 47,731 23.5,802 0,873 0,940 q 0,220 127,344 127,124 351,124 62,0 126.5,-21.5 64.5,-21.5 120,-58 55.5,-36.5 95.5,-68.5 40,-32 76,-68 36,36 76,68 40,32 95.5,68.5 55.5,36.5 120,58 64.5,21.5 126.5,21.5 224,0 351,-124 127,-124 127,-344 0,-221 -229,-450 L 940,-110 q -18,-18 -44,-18"/></g></svg>';
  heartColor = "white";
  zipCode: string;
  distance: string;

  constructor(
    private store: Store<AppState>,
    private modalService: ModalService,
    private environmentService: EnvironmentService
  ) {
    this.pathFiles = this.environmentService.getEnvFile().pathFiles;
  }

  ngAfterViewInit() {
    if (this.club.zipCode) {
      this.zipCode = this.shortZipCode(this.club.zipCode);
    }
    if (this.club.latitude && this.club.longitude) {
      this.store.select('geolocation')
        .pipe(
          tap(data => {
            if (data !== undefined && (data.latitude !== null && data.longitude !== null)) {
              this.distance = parseFloat(
                LocationDistance.calculateDistance(
                  { latitude: this.club.latitude, longitude: this.club.longitude },
                  { longitude: data.longitude, latitude: data.latitude }
                )
              ).toFixed(1);
            }
          })
        ).toPromise();
    }
    /* if (this.club.isPreferred) {
      this.heartColor = 'red';
    } */
  }

  showClub() {
    /* this.clubStore.dispatch(ClubActions.loadClub({clubId: this.club.id}));
    this.clubStore.dispatch(ClubActions.navToClubSection(
        {
          sectionName: 'infos',
          sectionIndex: 0
        })); */
    this.modalService.showClub(ClubDetailComponent, this.club.id);
  }

  shortZipCode(zipCode: string) {
    return zipCode.substring(0, 2);
  }
}
