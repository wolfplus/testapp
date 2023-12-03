import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../state/app.state";
import {ClubService} from "../../shared/services/club/club.service";
import {getCurrentClubId} from "../../club/store";
import {switchMap, tap} from "rxjs/operators";
import {ModalController} from "@ionic/angular";
import {ProcessCartPaymentComponent} from "../process-cart-payment/process-cart-payment.component";

@Component({
  selector: 'app-list-subscriptions-club',
  templateUrl: './list-subscriptions-club.component.html',
  styleUrls: ['./list-subscriptions-club.component.scss']
})
export class ListSubscriptionsClubComponent implements OnInit {

  selectedSubscription = null;
  subscriptions: Array<any> = [];
  club: any;
  constructor(
      private store: Store<AppState>,
      private modalCtrl: ModalController,
      private clubService: ClubService
  ) {

    this.subscriptions = [
      {id: '1', name: 'Abonnement mensuel Bloc HC', amount: 5900, period: 'mois', description: 'Profitez de nos installations pendant les heures creuses.'},
      {id: '2', name: 'Abonnement mensuel Bloc', amount: 7900, period: 'mois', description: 'Profitez de nos installations à toutes heures.'},
    ];
  }

  ngOnInit(): void {
    this.store.select(getCurrentClubId).pipe(switchMap(id => this.clubService.getClub(id)), tap(club => {
      this.club = club;
    })).subscribe()
  }
  selectSubs(sub) {
    this.selectedSubscription = sub;
  }
  confirmChoice() {
    this.modalCtrl.create({
      component: ProcessCartPaymentComponent,
      id: 'modal-process-payment',
      componentProps: {
        club: this.club,
        subscription: this.selectedSubscription
      },
      swipeToClose: true,
      backdropDismiss: true,
      mode: 'ios'
    })
    .then(modal => {
      modal.present().then();
      modal.onDidDismiss().then( data => {
        if (data.data) {

        }
      });
    });
  }

  close() {
    this.modalCtrl.dismiss().then();
  }
}
