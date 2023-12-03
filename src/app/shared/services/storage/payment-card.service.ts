import { Injectable } from '@angular/core';
import {GetResult, Preferences} from '@capacitor/preferences';
import { PaymentCard } from '../../models/payment-card';

@Injectable({
  providedIn: 'root'
})
export class PaymentCardService {
  key = 'PAYMENT_CARD';

  constructor() { }

  addPaymentCard(data: PaymentCard) {
    return this.updateAllUndefault().then(() => {
      return Preferences.get({key: this.key}).then(dataString => {
        let arrayData: Array<PaymentCard> = JSON.parse(dataString.value);
        if (arrayData === undefined || arrayData === null) {
          arrayData = [];
        }
        arrayData.push(data);
        Preferences.set({key: this.key, value: JSON.stringify(arrayData)}).then(() => {});
        return arrayData;
      });
    });
  }

  getAllPaymentCards() {
    return Preferences.get({key: this.key}).then(dataString => {
      const arrayData = JSON.parse(dataString.value);
      return arrayData;
    });
  }

  getDefaultPaymentCard(): Promise<GetResult> {
    return Preferences.get({key: this.key});
  }

  async updateAllUndefault() {
    let arrayData: Array<PaymentCard> = [];
    return await Preferences.get({key: this.key}).then(dataString => {
      if (dataString.value) {
        arrayData = JSON.parse(dataString.value);
        arrayData.forEach((item) => {
          item.default = false;
        });
        Preferences.set({key: this.key, value: JSON.stringify(arrayData)}).then(() => {});
      }
      return arrayData;
    });
  }

  updateDefined(index) {
    return Preferences.get({key: this.key}).then(dataString => {
      const arrayData: Array<PaymentCard> = JSON.parse(dataString.value);
      arrayData.forEach((item, i) => {
        if (i === index) {
          item.default = true;
        } else {
          item.default = false;
        }
      });
      Preferences.set({key: this.key, value: JSON.stringify(arrayData)}).then(() => {});
      return arrayData;
    });
  }

  deletePaymentCard(index) {
    return Preferences.get({key: this.key}).then(dataString => {
      const arrayData: Array<PaymentCard> = JSON.parse(dataString.value);
      const newArray = [];
      arrayData.forEach((item, i) => {
        if (index !== i) {
          newArray.push(item);
        }
      });
      Preferences.set({key: this.key, value: JSON.stringify(newArray)}).then(() => {});
      return newArray;
    });
  }

  deletePaymentCardAll() {
    Preferences.remove({key: this.key});
  }

  validatorCard(name: string, _numberCard: string, _month: string, _year: string, _cvc: string) {
    if (name === undefined || name === null || name === '') {
      return {error: true, message: 'name_undefined'};
    }
    return {error: false, message: ''};

  }

  checkType(numCard): string {
    const regexVisa = '^4[0-9]{6,}$';
    // const regexMastercard = '^5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,}$';
    const regexAmerican = '^3[47][0-9]{5,}$';
    if (numCard.match(regexVisa)) {
      return 'visa';
    }
    if (numCard.match(regexAmerican)) {
      return 'american';
    }
    return 'mastercard';
  }
}
