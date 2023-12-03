import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Club } from 'src/app/shared/models/club';
import { Geolocation } from 'src/app/shared/models/geolocation';
import { ColorStyle, FontSize } from 'src/app/shared/models/style';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-club-card',
  templateUrl: './club-card.component.html',
  styleUrls: ['./club-card.component.scss']
})
export class ClubCardComponent implements OnInit, AfterViewInit {
  @Input() club: Club;
  @Input() userLocation$: Observable<Geolocation>;

  clubLocationSub$ = new BehaviorSubject<Geolocation>({latitude: null, longitude: null});
  clubLocation$: Observable<Geolocation> = this.clubLocationSub$.asObservable();
  baseUrl: string = this.environmentService.getEnvFile().domainAPI;
  ColorStyle = ColorStyle;
  FontSize = FontSize;
  constructor(
    private environmentService: EnvironmentService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.clubLocationSub$.next({latitude: this.club.latitude, longitude: this.club.longitude});
  }

}
