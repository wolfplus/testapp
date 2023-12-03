import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreditClient} from '../../../shared/models/credit-client';
import {User} from '../../../shared/models/user';
import {Club} from '../../../shared/models/club';
import {ClientClub} from '../../../shared/models/client-club';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss']
})
export class CreditComponent implements OnInit {
  @Input() club: Club;
  @Input() paymentTokensOpen: Array<any> = [];
  @Input() client: ClientClub;
  @Input() credits: Array<CreditClient>;
  @Output() validUse = new EventEmitter();

  userClient: User;
  cannotUseAnyCredit = false;

  constructor(
    private modalCtr: ModalController
  ) {
    this.credits = [];
  }

  ngOnInit(): void {
    this.checkCredits();
  }

  checkCredits() {
    this.credits = this.credits
      .filter(credit => {
        return credit.balance > 0;
      });

    this.credits.forEach( credit => {
      if (this.isUsable(credit)) {
        credit.isUsable = true;
      } else {
        credit.isUsable = false;
      }
      if (this.isExpired(credit, this.club.timezone)) {
        credit.isExpired = true;
      } else {
        credit.isExpired = false;
      }
      if (this.isInsufficient(credit)) {
        credit.isInsufficient = true;
      } else {
        credit.isInsufficient = false;
      }
    });
    if (this.credits.find(credit => credit.isUsable) === undefined) {
      this.cannotUseAnyCredit = true;
    }
  }

  consumeCredit(credit) {
    const paymentTokenPrice = this.getPaymentTokenPrice(credit);
    this.modalCtr.dismiss({
      clientPaymentToken: credit,
      paymentTokenPrice
    }, null, 'modal-consume-credit').then(() => {});
  }

  isExpired(creditClient: CreditClient, clubTimezone): boolean {
    const today = moment().tz(this.club.timezone, true);
    const expiryDate = moment.utc(creditClient.expiresAt).tz(clubTimezone);
    if (today.isAfter(expiryDate)) {
      return true;
    } else {
      return false;
    }
  }

  isUsable(creditClient: CreditClient): boolean {
    if (this.paymentTokensOpen) {
      const matchingCredit = this.paymentTokensOpen.find( paymentTokenOpen => {
        if (paymentTokenOpen.paymentToken !== undefined) {
          return paymentTokenOpen.paymentToken['@id'] === creditClient.paymentToken['@id'];
        } else {
          const paymentTokenOpenAsArray = paymentTokenOpen.split("/");
          const paymentTokenOpenId = paymentTokenOpenAsArray[paymentTokenOpenAsArray.length - 1];
          return paymentTokenOpenId === creditClient.paymentToken.id;
        }
      });
      if (matchingCredit) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isInsufficient(credit): boolean {
    const tokenPrice = this.getPaymentTokenPrice(credit);
    if (tokenPrice !== undefined) {
      const price = tokenPrice.pricePerParticipant;
      if (price > credit.balance) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getValue(creditClient: CreditClient) {
    let result = null;
    this.paymentTokensOpen.forEach(item => {
      if (creditClient.paymentToken.id === item.paymentToken.id) {
        result = item.pricePerParticipant;
      }
    });
    return result;
  }

  getPaymentTokenPrice(creditClient: CreditClient) {
    return this.paymentTokensOpen.find(pto => {
      if (pto.paymentToken !== undefined) {
        return pto.paymentToken['@id'] === creditClient.paymentToken['@id'];
      } else {
        const paymentTokenAsArray = pto.split("/");
        const paymentTokenId = paymentTokenAsArray[paymentTokenAsArray.length - 1];
        return paymentTokenId === creditClient.paymentToken.id;
      }
    });
  }

  back() {
    this.modalCtr.dismiss({}, null, 'modal-consume-credit').then(() => {});
  }
}
