import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Club} from '../../../shared/models/club';
// import * as L from 'leaflet';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',  
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() public club!: Club;
  public url?: SafeResourceUrl = undefined;
  // @ViewChild('map') el: ElementRef;
  // private map?: L.Map;
  
  constructor(
    private sanitizer: DomSanitizer,
    private platform: Platform
  ) {}

  ngOnInit(): void {
    //const bbox = this.boundaryBox(this.club.latitude, this.club.longitude, 1000, 400, 16);
    const bbox = this.boundaryBox(this.club.latitude, this.club.longitude);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.openstreetmap.org/export/embed.html` +
      `?bbox=${bbox.join(',')}` +
      `&layer=mapnik` +
      `&marker=${this.club.latitude},${this.club.longitude}`
    );
    // this.extMapSrc = this.sanitizer.bypassSecurityTrustUrl(
    //   `https://www.openstreetmap.org/` +
    //   `?mlat=${this.latitude}&mlon=${this.longitude}` +
    //   `#map=17/${this.latitude}/${this.longitude}`
    // );
  }

  lonToTile(lon: number, zoom: number): number {
    return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
  }

  latToTile(lat: number, zoom: number): number {
    return Math.floor(
      (1 - Math.log(
        Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)
      ) / Math.PI) / 2 * Math.pow(2, zoom)
    );
  }

  tileToLon(x: number, zoom: number): number {
    return (x / Math.pow(2, zoom) * 360 - 180);
  }

  tileToLat(y: number, zoom: number): number {
    const n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom);
    return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
  }

  public boundaryBox2(
    lat: number,
    lon: number,
    width: number = 1110,
    height: number = 400,
    zoom: number = 17,
  ): Array<number> {
    const tileSize = 256;

    const lonTile = this.lonToTile(lon, zoom);
    const latTile = this.latToTile(lat, zoom);

    const minLonTile = (lonTile * tileSize - width / 2) / tileSize;
    const minLatTile = (latTile * tileSize - height / 2) / tileSize;
    const maxLonTile = (lonTile * tileSize + width / 2) / tileSize;
    const maxLatTile = (latTile * tileSize + height / 2) / tileSize;

    const minLon = this.tileToLon(minLonTile, zoom);
    const minLat = this.tileToLat(minLatTile, zoom);
    const maxLon = this.tileToLon(maxLonTile, zoom);
    const maxLat = this.tileToLat(maxLatTile, zoom);

    return [minLon, minLat, maxLon, maxLat];
  }

  private boundaryBox(
    lat: number,
    lon: number
  ): Array<number> {

    const minLon = lon - 0.009;
    const minLat = lat - 0.0052;
    const maxLon = lon + 0.009;
    const maxLat = lat + 0.0052;

    return [minLon, minLat, maxLon, maxLat];
  }

  ngAfterViewInit() {

    // if (!this.el || !this.el.nativeElement) {
    //   console.log("no elemment")
    //   return;
    // }

    // this.map = L.map(this.el.nativeElement).setView([this.club.latitude, this.club.longitude], 7);

    // if (!this.map) {
    //   console.log("faild to initialize map");
    // }

    // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //   attribution:
    //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(this.map);

    // const marker = L.marker([this.club.latitude, this.club.longitude]);

    // marker.addTo(this.map);
  }
  
  private getOS(): string {
    let userAgent = window.navigator.userAgent.toLowerCase(),
      macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i,
      windowsPlatforms = /(win32|win64|windows|wince)/i,
      iosPlatforms = /(iphone|ipad|ipod)/i,
      os = null;
  
    if (macosPlatforms.test(userAgent)) {
      os = "macos";
    } else if (iosPlatforms.test(userAgent)) {
      os = "ios";
    } else if (windowsPlatforms.test(userAgent)) {
      os = "windows";
    } else if (/android/.test(userAgent)) {
      os = "android";
    } else if (!os && /linux/.test(userAgent)) {
      os = "linux";
    }
  
    return os;
  }

  public openClubMap(): void {

    const isMac = this.getOS() === "macos";
    const destination = this.club.latitude + ',' + this.club.longitude;

    if(this.platform.is('ios') || isMac){
      window.open('maps://?q=' + destination, '_system');
    } else {
      let label = encodeURI('My Label');
      window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
    }
  }

}
