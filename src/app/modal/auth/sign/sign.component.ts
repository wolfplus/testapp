import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../../config/config.service';
import {ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import { getSecondaryColor } from 'src/utils/getSecondaryColor';
import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss']
})
export class SignComponent implements OnInit {

  logoUrl: string;
  env;
  secondaryColorIsWhite: boolean;
  logoImage = '';
  portal = 'signin';
  setMail = null;

  constructor(
      private config: ConfigService,
      private modalCtr: ModalController,
      private loaderService: LoaderService,
      public translate: TranslateService,
      private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
    this.logoUrl = this.config.getLogoUrl();
    this.logoImage = 'assets/images/illustrations' + (this.env.useMb ? ('_' + this.env.marqueBlanche.pathName) : '')  + '/login-bg-app.png';
  }

  ngOnInit(): void {
    this.loaderService.dismiss();
    const secondaryColor = getSecondaryColor();
    if (secondaryColor && (secondaryColor === 'ffffff' || secondaryColor === 'FFFFFF' || secondaryColor === 'white')) {
      this.secondaryColorIsWhite = true;
    } else {
      this.secondaryColorIsWhite = false;
    }
  }

  updateUrlLogo(_error) {
    this.logoUrl = 'assets/images/logos/icon_doin.png';
    this.logoImage = 'assets/images/logos/icon_doin.png';
  }


  goToSignIn() {
  this.portal = 'signin';

  }

  goToSignUp() {
    this.portal = 'signup';
  }

  close() {
    this.modalCtr.dismiss().then(() => {});
  }
}
