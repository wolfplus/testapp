import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {getCurrentClub, getCurrentClubLoadedState} from '../../store';
import {ClubState} from '../../store/club.reducers';
import { Club } from 'src/app/shared/models/club';

@Component({
  selector: 'app-club-map',
  templateUrl: './club-map.component.html',
  styleUrls: ['./club-map.component.scss']
})
export class ClubMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('imgMap') imgMap: ElementRef;

  clubSubscription$: Subscription;
  clubObserver$: Observable<any>;
  clubName: string;
  clubLocation: { lat: number; lng: number; };
  clubIsLoaded$: Observable<boolean>;

  API_KEY: string;

  constructor(private store: Store<ClubState>) {}

  ngOnInit() {
    this.API_KEY = 'AIzaSyCMab6pjh9wu3jfu_GeHd3VXZbhafvvX7M';
    // "AIzaSyCMab6pjh9wu3jfu_GeHd3VXZbhafvvX7M"; "AIzaSyAQEdYQc4_BGPTtNPTKf1PNGALykQ7ztdA"

    this.clubObserver$ = this.store.pipe(select(getCurrentClub));
    this.clubIsLoaded$ = this.store.pipe(select(getCurrentClubLoadedState));
  }

  ngOnDestroy() {
    this.clubSubscription$.unsubscribe();
  }
  /* TODO: add  this.clubIsLoaded$ in the pipe */
  ngAfterViewInit() {
    this.clubSubscription$ = this.clubObserver$
      .pipe(
        filter(Boolean),
        map( (club: Club) => {
          return {
            name: club.name,
            location: {lat: club.latitude, lng: club.longitude}
          };
        })
      )
      .subscribe( result => {
        this.clubLocation = result.location;
        this.clubName = result.name;
        if (this.clubLocation.lat !== null && this.clubLocation.lng !== null && this.clubName !== null) {
          setTimeout( _ =>  this.loadMap(), 500);
        }
      });
  }

  loadMap(){
    let staticMapUrl = 'https://maps.googleapis.com/maps/api/staticmap';
    const mapOptions = {
      center: this.clubLocation,
      zoom: 15,
      mapType: 'roadmap'
    };
    const marker = {
      title: '',
      lat: null,
      lng: null,
    };
    let markerIcon: string;
    marker.title = this.clubName;
    marker.lat = this.clubLocation.lat;
    marker.lng = this.clubLocation.lng;
    markerIcon = 'https://api.doinsport.club/assets/v2/img/pin_doin.png';
    staticMapUrl += '?center=' + mapOptions.center.lat + ',' + mapOptions.center.lng;
    staticMapUrl += '&size=800x800';
    staticMapUrl += '&zoom=' + mapOptions.zoom;
    staticMapUrl += '&maptype=' + mapOptions.mapType;
    staticMapUrl += '&markers=icon:' + markerIcon + '|' + marker.lat + ',' + marker.lng;
    staticMapUrl += '&key=' + this.API_KEY;
    this.imgMap.nativeElement.src = staticMapUrl;
    this.imgMap.nativeElement.style.display = 'block';
  }
}
