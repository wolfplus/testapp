import {Component, Input, OnInit} from '@angular/core';
import {ModalController, Platform} from "@ionic/angular";
import {ConfigService} from "../../config/config.service";

@Component({
  selector: 'app-update-app-modal',
  templateUrl: './update-app-modal.component.html',
  styleUrls: ['./update-app-modal.component.scss']
})
export class UpdateAppModalComponent implements OnInit {

  @Input() androidUrl: string;
  @Input() appleUrl: string;

  constructor(public platform: Platform, private modalController: ModalController, private config: ConfigService) { }

  logoUrl: string;

  ngOnInit(): void {
    this.logoUrl = this.config.getLogoUrl();
  }

  updateApp() {
    // TODO : Qu'est ce que c'est ?
    if (this.platform.is('ios')) {
      console.log("url ios", this.appleUrl);
    } else if (this.platform.is('android')){
      console.log("url android", this.androidUrl);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
