import { Component } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-cgu',
  templateUrl: './cgu.component.html',
  styleUrls: ['./cgu.component.scss']
})
export class CguComponent {

  constructor(
      private modalCtrl: ModalController
  ) { }

  close() {
    this.modalCtrl.dismiss({refresh: true}).then();
  }
}
