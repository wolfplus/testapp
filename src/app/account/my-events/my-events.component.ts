import { Component, OnInit } from '@angular/core';
import {ModalController } from '@ionic/angular';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }
}
