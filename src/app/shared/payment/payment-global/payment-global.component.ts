import {Component, Input, OnInit} from '@angular/core';
import {Wallet} from "../../models/wallet";
import {ClientClub} from "../../models/client-club";
import {Playground} from "../../models/playground";
import {Booking} from "../../models/booking";
import {ModalController} from "@ionic/angular";
import {PlaygroundService} from "../../services/playground/playground.service";
import {ActivityService} from "../../services/activity/activity.service";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payment-global',
  templateUrl: './payment-global.component.html',
  styleUrls: ['./payment-global.component.scss']
})
export class PaymentGlobalComponent implements OnInit {

  @Input() wallet: Wallet;
  @Input() client: ClientClub;
  @Input() duration: any;
  @Input() playground: Playground;
  @Input() activityId: string;
  @Input() booking: Booking;
  @Input() methods: Array<string>;
  @Input() price: any;
  @Input() slot: any;
  @Input() club: any;

  baseUrl;

  playgroundFullData: Playground;
  activity: Observable<any> = undefined;

  constructor(private modalCtr: ModalController,
              private playgroundService: PlaygroundService,
              private activityService: ActivityService) {
  }

  ngOnInit(): void {
    this.playgroundService.getPlayground(this.playground.id).toPromise().then(respPlayground => {
      this.playgroundFullData = respPlayground;
    });
    // if (typeof this.booking.activity == "string") {
    //   this.activityService.get(this.booking.activity).toPromise().then(respAct => {
    //     this.activity = respAct;
    //   })
    // }

    if (typeof this.booking.activity == "string") {
      this.activity = this.activityService.get(String(this.booking.activity));
    }

    // this.activityService.get(String(this.booking.activity)).toPromise().then(respAct => {
    //   this.activity = respAct;
    // })
  }

  closeModal(data) {
    console.log("dattatata ici data", data);
    this.modalCtr.dismiss(data);
  }

}
