import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-my-preferences',
  templateUrl: './my-preferences.component.html',
  styleUrls: ['./my-preferences.component.css']
})
export class MyPreferencesComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }
}
