import {Component, Input, OnInit} from '@angular/core';
import {Club, Service} from '../../../shared/models/club';

import {ClubService} from '../../../shared/services/club/club.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Platform } from '@ionic/angular';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import {InAppBrowserOptions} from "@ionic-native/in-app-browser";

@Component({
  selector: 'app-information-club',
  templateUrl: './information-club.component.html',
  styleUrls: ['./information-club.component.scss']
})
export class InformationClubComponent implements OnInit {
  @Input() club: Club;

  path = this.environmentService.getEnvFile().pathFiles;
  services: Array<Service>;
  links: Array<any> = [];

  constructor(
    private clubService: ClubService,
    private iab: InAppBrowser,
    private viewer: PhotoViewer,
    private platform: Platform,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit(): void {

    if (this.club) {
      this.clubService.getServicesClub(this.club.id).subscribe(data => {
        this.services = data['hydra:member'];
      });

      if (this.club.socialNetworks !== undefined && this.club.socialNetworks !== null) {
        this.links = Object.keys(this.club.socialNetworks).map((key) => {
          return {name: key, url: this.club.socialNetworks[key]};
        });
        this.links = this.links.filter( link => link.url !== "");
      }
    }
  }

  viewPic(picUrl) {
    this.platform.ready().then( () => {
      this.viewer.show(picUrl);
    });
  }

  openLink(link) {
    const options: InAppBrowserOptions = {
      location: "no"
    };
    return this.iab.create(link, "_blank", options);
  }
}
