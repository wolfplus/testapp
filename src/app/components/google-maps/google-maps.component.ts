import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GoogleMapsService } from 'src/app/shared/services/google-maps.service';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css'],
  providers: [ GoogleMapsService ]
})
export class GoogleMapsComponent implements OnInit {
  @ViewChild('map') map: ElementRef;
  clubLocation: {lat: number, lng: number};
  clubName: any;
  opacity: 0;
  constructor(
    private platform: Platform,
    private ggMapsService: GoogleMapsService
  ) {
      this.platform.backButton.pipe() ;
  }

  ngOnInit() {
      // TODO: update name and location from the store
      this.clubName = 'YOOOO';
      this.clubLocation = {lat: 43.3005918, lng: 5.3680826};

      this.platform.ready().then( () => {
          this.ggMapsService.initMap(this.clubLocation, this.clubName, this.map.nativeElement);
      });
  }

}
