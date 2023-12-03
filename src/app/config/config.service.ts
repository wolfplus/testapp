import { Injectable } from '@angular/core';
import { EnvironmentService } from '../shared/services/environment/environment.service';
import {getClubLogo} from "../club/store";
import {tap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {ClubState} from "../club/store/club.reducers";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  logoImage;
  baseUrl;

  constructor(
    private environmentService: EnvironmentService, private storeClub: Store<ClubState> ) {
    this.baseUrl = this.environmentService.getEnvFile().pathFiles;
    this.storeClub.select(getClubLogo).pipe(
        tap( clubLogo => {
          if (clubLogo) {
            this.logoImage = this.baseUrl + clubLogo.contentUrl;
          }
        }),
    ).subscribe();
  }

  getLogoUrl() {
    return this.logoImage;
  }
}
