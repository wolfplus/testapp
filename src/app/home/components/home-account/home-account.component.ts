import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MyCreditsComponent } from 'src/app/account/my-credits/my-credits.component';
import { MySubscriptionsComponent } from 'src/app/account/my-subscriptions/my-subscriptions.component';
import { MyWalletsComponent } from 'src/app/account/my-wallets/my-wallets.component';

import {EnvironmentService} from "../../../shared/services/environment/environment.service";

@Component({
  selector: 'app-home-account',
  templateUrl: './home-account.component.html',
  styleUrls: ['./home-account.component.scss']
})
export class HomeAccountComponent implements OnInit {

  env;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
  }

  ngOnInit(): void {
  }

  goTo(component) {
    let componentToOpen;
    switch (component) {

      case "MySubscriptionsComponent":
        componentToOpen = MySubscriptionsComponent;
        break;
      case "MyCreditsComponent":
        componentToOpen = MyCreditsComponent;
        break;
      case "MyWalletsComponent":
        componentToOpen = MyWalletsComponent;
        break;
    }

    this.modalCtrl.create({
      component: componentToOpen
    })
    .then(modal => {
      modal.present().then();
      modal.onDidDismiss();
    });
  }

  open(route: string, params: any = null) {
    this.router.navigate([route], {queryParams: params}).then();
  }
}
