import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-my-operations',
  templateUrl: './my-operations.component.html',
  styleUrls: ['./my-operations.component.css']
})
export class MyOperationsComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }

}
