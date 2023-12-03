import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { MySubscriptionsComponent } from 'src/app/account/my-subscriptions/my-subscriptions.component';
import { MyCreditsComponent } from 'src/app/account/my-credits/my-credits.component';
import { MyWalletsComponent } from 'src/app/account/my-wallets/my-wallets.component';
import { Router } from '@angular/router';
import {EnvironmentService} from "../../../../shared/services/environment/environment.service";
import { ChoiceClubComponent } from 'src/app/modal/choice-club/choice-club.component';
import {ContactModalComponent} from "../contact-modal/contact-modal.component";
import {getClubLogo, getClubPhoto} from "../../../../club/store";
import {tap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {ClubState} from "../../../../club/store/club.reducers";
import {ClubPhoto} from "../../../../club/models/club-photo";

@Component({
  selector: 'app-header-mb',
  templateUrl: './header-mb.component.html',
  styleUrls: ['./header-mb.component.scss']
})
export class HeaderMbComponent implements OnInit {
  @Input() userName: string;
  @Input() userAvatar: any;
  @Input() clubSelected: any;
  @Input() clubs: any;
  @Output() refreshClubs = new EventEmitter<any>(false);

  clubPhoto: ClubPhoto;

  env;
  baseUrl;
  bgHeaderImage = '';
  logoImage = '';
  errorImgBgHeader = '';

  constructor(
    public popoverController: PopoverController,
    private router: Router,
    private modalController: ModalController,
    private environmentService: EnvironmentService,
    private storeClub: Store<ClubState>
  ) {
    this.env = this.environmentService.getEnvFile();
    this.baseUrl = this.env.domainAPI;
  }

  ngOnInit(): void {
    this.baseUrl = this.env.domainAPI;
    this.storeClub.select(getClubPhoto).pipe(
        tap( clubPhoto => {
          this.clubPhoto = clubPhoto;
        }),
    ).subscribe();
    this.storeClub.select(getClubLogo).pipe(
        tap( clubLogo => {
            if (clubLogo) {
              this.logoImage = this.baseUrl + clubLogo.contentUrl;
          }
        }),
    ).subscribe();
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
      case "ContactModalComponent":
        componentToOpen = ContactModalComponent;
        break;
    }

    this.modalController.create({
      component: componentToOpen,
      swipeToClose: true,
      id: component
    })
    .then(modal => {
      modal.present().then();
      modal.onDidDismiss();
    });
  }

  showClub() {
    this.choiceClubModal(this.clubs);
  }

  choiceClubModal(clubs) {
    return this.modalController.create({
      component: ChoiceClubComponent,
      cssClass: 'modal-choice',
      componentProps: {
        clubs
      }
    }).then(modal => {
      modal.present().then();
      modal.onDidDismiss().then(data => {
        clubs.forEach(club => {
          if (club['@id'].replace('/clubs/', '') === data.data['clubId']) {
            this.clubSelected = club;
            this.refreshClubs.emit({reload: true, clubSelected: this.clubSelected});
          }
        });
      });
    });
  }


  open(route: string, params: any = null) {
    this.router.navigate([route], {queryParams: params}).then();
  }

  updateUrlBg() {
    this.bgHeaderImage = 'assets/images/banner_default.png';
  }

  updateUrlLogo() {
    this.logoImage = 'assets/images/logos/icon_doin.png';
  }
}
