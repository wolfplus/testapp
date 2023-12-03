import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss']
})
export class DefaultHeaderComponent implements OnInit {

  @Input() removeBackArrow: boolean;
  @Input() title: string;
  @Input() isPage = false;
  @Input() isNav = false;
  @Input() backgroundImage: string;
  @Input() showDone = false;
  @Input() subtitle = '';
  @Output() back = new EventEmitter();
  @Output() actionDone = new EventEmitter();
  constructor(
      private navCtrl: NavController
  ) { }

  ngOnInit(): void {
  }
  backAction() {
    try {
      if (this.isNav) {
        this.navCtrl.back();
      } else {
        this.back.emit();
      }
    } catch (e) {
      console.log('error catch : ', e);
      console.log('error catch : ', e.stack);
    }
  }
  closeDone() {
    this.actionDone.emit();
  }
}
