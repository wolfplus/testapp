import { ElementRef, Injectable } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  LatLng
} from '@ionic-native/google-maps';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  userPosition: LatLng;
  map: GoogleMap;

  mapOptions: GoogleMapOptions =  {
    mapType: "MAP_TYPE_ROADMAP",
    zoom: 17,
    center: null,
    disableDefaultUI: true,
    fullscreenControl: true,
    styles : [
      {
        featureType: 'all',
        elementType: 'all'
      },
      {
        featureType: 'water',
        elementType: 'all'
      }
    ]
  };

  constructor() {}

  initMap(location: {lat: number, lng: number}, clubName: string, element: ElementRef["nativeElement"]) {
    const position = new LatLng(location.lat, location.lng);
    if (sessionStorage.getItem('latitude') != null && sessionStorage.getItem('latitude') !== undefined) {

      // TODO: get user location from storage once it's implemented
      const latitude = 43.3005918;
      const longitude = 5.3680826;
      this.userPosition = new LatLng(+latitude, +longitude);
    }
    this.mapOptions.center = position;
    this.map = GoogleMaps.create(element, this.mapOptions);

    this.map.on(GoogleMapsEvent.MAP_READY)
      .subscribe(() => {
        const options: CameraPosition<any> = {
          target: location,
          zoom: 17
        };
        this.map.moveCamera(options);
    });

    this.addClubMarkerToMap(position, clubName);
    if (this.userPosition !== undefined ) {
      this.addUserMarkerToMap(this.userPosition);
    }
  }

  addClubMarkerToMap(location: LatLng, clubName: string) {

    const image = {
      url: 'assets/imgs/icons/map-pin.png',
      size: {
        width: 24,
        height: 33
      }
    };

    const markerOptions: MarkerOptions = {
      position: location,
      title: clubName,
      animation: 'DROP',
      icon: image
    };

    this.map.addMarker(markerOptions);

  }

  addUserMarkerToMap(position: LatLng) {
    const image = {
      url: 'assets/imgs/icons/user-pin.png',
      size: {
        width: 24,
        height: 24
      }
    };

    const markerOptions: MarkerOptions = {
      position,
      title: "my_position", // TODO: add translation
      animation: 'DROP',
      icon: image
    };

    this.map.addMarker(markerOptions);
  }

}
