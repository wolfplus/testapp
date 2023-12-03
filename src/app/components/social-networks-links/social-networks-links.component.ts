import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-social-networks-links',
  templateUrl: './social-networks-links.component.html',
  styleUrls: ['./social-networks-links.component.scss']
})
export class SocialNetworksLinksComponent implements OnInit, AfterViewInit {

  @Input() clubWebSiteUrl: string;
  @Input() links: Array<string>;

  socialNetworksLinks: Array<any> = [];

  constructor(
    private iab: InAppBrowser
  ) { }

  ngOnInit() {

    if (this.links !== undefined && this.links !== null) {
      this.socialNetworksLinks = Object.keys(this.links).map((key) => {
        return {name: key, url: this.links[key]};
      });
      this.socialNetworksLinks = this.socialNetworksLinks.filter( link => link.url !== "");
    }
  }

  ngAfterViewInit() {
  }

  openLink(url) {
    return this.iab.create(url, "_blank");
  }
}
