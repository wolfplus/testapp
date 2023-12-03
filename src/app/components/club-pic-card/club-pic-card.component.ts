import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Club } from 'src/app/shared/models/club';
import { Geolocation } from 'src/app/shared/models/geolocation';
import { ModalService } from 'src/app/shared/services/modal.service';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ClubDetailComponent } from 'src/app/club-detail/club-detail.component';


@Component({
  selector: 'app-club-pic-card',
  templateUrl: './club-pic-card.component.html',
  styleUrls: ['./club-pic-card.component.scss']
})
export class ClubPicCardComponent implements OnInit, AfterViewInit {
  @Input() club: Club;
  @Input() userLocation$: Observable<Geolocation>;

  clubLocationSub$ = new BehaviorSubject<any>({ latitude: null, longitude: null });
  clubLocation$ = this.clubLocationSub$.asObservable();

  filesPath = this.environmentService.getEnvFile().pathFiles;
  distance: string;
  zipCode: string;
  activities$: Observable<any[]>;
  activities: {}[];

  constructor(
    private modalService: ModalService,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.club.latitude !== null && this.club.longitude !== null) {
      this.clubLocationSub$.next({ latitude: this.club.latitude, longitude: this.club.longitude});
    }
    if (this.club !== undefined && this.club.zipCode !== null) {
      this.zipCode = this.shortZipCode(this.club.zipCode);

      /* TODO: replace with club activities */
      this.activities = [
        {
          '@id': "/activities/e744a550-7c4e-4275-aef1-f09ff9455bd2",
          '@type': "Activity",
          colors: ["#009DC5", "#21E590"],
          icon: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 24.2.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"    viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"> <style type="text/css">   .st0{fill:#053279;stroke:#053279;stroke-width:0.15;stroke-miterlimit:10;} </style> <path class="st0" d="M85,49.3c-0.2-0.9-1.1-1.8-2-1.9l-10.9-1.3l3.5-19c0.1-0.7-0.1-1.5-0.7-2.1c-0.6-0.6-1.3-0.8-2.1-0.7l-19,3.5   L52.4,17c-0.1-0.9-0.8-1.8-1.9-2c-0.9-0.2-2,0.2-2.5,1.1L23.1,58.7C23,58.8,23,58.9,23,59l-4.7,4.7c-4.9,4.9-4.9,13,0,18 c2.3,2.3,5.6,3.8,9,3.8c3.4,0,6.6-1.3,9-3.8l4.7-4.7l0,0c0,0,0,0,0.1,0c0.1,0,0.1-0.1,0.2-0.1l42.4-25C84.7,51.3,85.1,50.3,85,49.3z   M33,78.4c-1.5,1.5-3.5,2.3-5.6,2.3s-4.1-0.8-5.6-2.3c-3.2-3.2-3.2-8.2,0-11.4l3.8-3.8l11.4,11.4L33,78.4z M40.5,71.8L28.2,59.5 l20.6-35l0.8,6.5c0.1,0.6,0.5,1.2,0.9,1.6c0.5,0.4,1.2,0.6,1.8,0.4l18.1-3.4l-3.4,18.1c-0.1,0.6,0,1.3,0.4,1.8 c0.4,0.5,0.9,0.8,1.6,0.9l6.5,0.8L40.5,71.8z"/></svg>',
          name: "Football"
        },
        {
          '@id': "/activities/e744a550-7c4e-4275-aef1-f09ff9455bd2",
          '@type': "Activity",
          colors: ["#009DC5", "#21E590"],
          icon: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 24.2.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"    viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"> <style type="text/css">   .st0{fill:#053279;stroke:#053279;stroke-width:0.15;stroke-miterlimit:10;} </style> <path class="st0" d="M85,49.3c-0.2-0.9-1.1-1.8-2-1.9l-10.9-1.3l3.5-19c0.1-0.7-0.1-1.5-0.7-2.1c-0.6-0.6-1.3-0.8-2.1-0.7l-19,3.5   L52.4,17c-0.1-0.9-0.8-1.8-1.9-2c-0.9-0.2-2,0.2-2.5,1.1L23.1,58.7C23,58.8,23,58.9,23,59l-4.7,4.7c-4.9,4.9-4.9,13,0,18 c2.3,2.3,5.6,3.8,9,3.8c3.4,0,6.6-1.3,9-3.8l4.7-4.7l0,0c0,0,0,0,0.1,0c0.1,0,0.1-0.1,0.2-0.1l42.4-25C84.7,51.3,85.1,50.3,85,49.3z   M33,78.4c-1.5,1.5-3.5,2.3-5.6,2.3s-4.1-0.8-5.6-2.3c-3.2-3.2-3.2-8.2,0-11.4l3.8-3.8l11.4,11.4L33,78.4z M40.5,71.8L28.2,59.5 l20.6-35l0.8,6.5c0.1,0.6,0.5,1.2,0.9,1.6c0.5,0.4,1.2,0.6,1.8,0.4l18.1-3.4l-3.4,18.1c-0.1,0.6,0,1.3,0.4,1.8 c0.4,0.5,0.9,0.8,1.6,0.9l6.5,0.8L40.5,71.8z"/></svg>',
          name: "Football"
        },
        {
          '@id': "/activities/e744a550-7c4e-4275-aef1-f09ff9455bd2",
          '@type': "Activity",
          colors: ["#009DC5", "#21E590"],
          icon: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 24.2.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"    viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"> <style type="text/css">   .st0{fill:#053279;stroke:#053279;stroke-width:0.15;stroke-miterlimit:10;} </style> <path class="st0" d="M85,49.3c-0.2-0.9-1.1-1.8-2-1.9l-10.9-1.3l3.5-19c0.1-0.7-0.1-1.5-0.7-2.1c-0.6-0.6-1.3-0.8-2.1-0.7l-19,3.5   L52.4,17c-0.1-0.9-0.8-1.8-1.9-2c-0.9-0.2-2,0.2-2.5,1.1L23.1,58.7C23,58.8,23,58.9,23,59l-4.7,4.7c-4.9,4.9-4.9,13,0,18 c2.3,2.3,5.6,3.8,9,3.8c3.4,0,6.6-1.3,9-3.8l4.7-4.7l0,0c0,0,0,0,0.1,0c0.1,0,0.1-0.1,0.2-0.1l42.4-25C84.7,51.3,85.1,50.3,85,49.3z   M33,78.4c-1.5,1.5-3.5,2.3-5.6,2.3s-4.1-0.8-5.6-2.3c-3.2-3.2-3.2-8.2,0-11.4l3.8-3.8l11.4,11.4L33,78.4z M40.5,71.8L28.2,59.5 l20.6-35l0.8,6.5c0.1,0.6,0.5,1.2,0.9,1.6c0.5,0.4,1.2,0.6,1.8,0.4l18.1-3.4l-3.4,18.1c-0.1,0.6,0,1.3,0.4,1.8 c0.4,0.5,0.9,0.8,1.6,0.9l6.5,0.8L40.5,71.8z"/></svg>',
          name: "Football"
        },
        {
          '@id': "/activities/e744a550-7c4e-4275-aef1-f09ff9455bd2",
          '@type': "Activity",
          colors: ["#009DC5", "#21E590"],
          icon: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 24.2.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"    viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"> <style type="text/css">   .st0{fill:#053279;stroke:#053279;stroke-width:0.15;stroke-miterlimit:10;} </style> <path class="st0" d="M85,49.3c-0.2-0.9-1.1-1.8-2-1.9l-10.9-1.3l3.5-19c0.1-0.7-0.1-1.5-0.7-2.1c-0.6-0.6-1.3-0.8-2.1-0.7l-19,3.5   L52.4,17c-0.1-0.9-0.8-1.8-1.9-2c-0.9-0.2-2,0.2-2.5,1.1L23.1,58.7C23,58.8,23,58.9,23,59l-4.7,4.7c-4.9,4.9-4.9,13,0,18 c2.3,2.3,5.6,3.8,9,3.8c3.4,0,6.6-1.3,9-3.8l4.7-4.7l0,0c0,0,0,0,0.1,0c0.1,0,0.1-0.1,0.2-0.1l42.4-25C84.7,51.3,85.1,50.3,85,49.3z   M33,78.4c-1.5,1.5-3.5,2.3-5.6,2.3s-4.1-0.8-5.6-2.3c-3.2-3.2-3.2-8.2,0-11.4l3.8-3.8l11.4,11.4L33,78.4z M40.5,71.8L28.2,59.5 l20.6-35l0.8,6.5c0.1,0.6,0.5,1.2,0.9,1.6c0.5,0.4,1.2,0.6,1.8,0.4l18.1-3.4l-3.4,18.1c-0.1,0.6,0,1.3,0.4,1.8 c0.4,0.5,0.9,0.8,1.6,0.9l6.5,0.8L40.5,71.8z"/></svg>',
          name: "Football"
        }
      ];
    }
  }

  showClub() {
    this.modalService.showClub(ClubDetailComponent, this.club.id).then();
  }

  shortZipCode(zipCode: string) {
    return zipCode.substring(0, 2);
  }

}
