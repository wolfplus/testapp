import {Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Wallet } from '../../../shared/models/wallet';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  @Input() wallet: Wallet;
  @Input() currency: string;
  // @Output() payWallet = new EventEmitter();

  constructor(
    private modalCtlr: ModalController
  ) {}

  ngOnInit(): void {
  }

  consumeWallet(wallet) {
    this.modalCtlr.dismiss({wallet}).then(() => {});
  }

  back() {
    this.modalCtlr.dismiss({}).then(() => {});
  }
}
