import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

export type Positions = 'top' | 'bottom' | 'middle';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController,
    private translate: TranslateService
  ) { }

  presentSuccess(textKey: string, position: Positions = 'bottom') {
    this.presentToast('success', textKey, position);
  }

  presentError(textKey: string, position: Positions = 'bottom', translate = true, variable = {}) {
    this.presentToast('danger', textKey, position, 3000, translate, variable);
  }

  presentErrorWithName(textKey: string, firstName: string, lastName: string, position: Positions = 'bottom') {
    this.presentToastWithName('danger', textKey, firstName, lastName, position);
  }

  presentInfo(textKey: string, position: Positions = 'bottom') {
    this.presentToast('primary', textKey, position);
  }

  async presentToast(color: string, textKey: string, position: Positions = 'top' , duration: number = 3000, translate = true, variable?) {
    const toast = await this.toastController.create({
      color,
      message: translate ? this.translate.instant(textKey, variable) : textKey,
      duration,
      position
    });
    toast.present();
  }
  async presentToastWithName(color: string, textKey: string,
                             firstName: string, lastName: string, position: Positions = 'top', duration: number = 3000) {
    const toast = await this.toastController.create({
      color,
      message: this.translate.instant(textKey).replace('%firstName%', firstName).replace('%lastName%', lastName),
      duration,
      position
    });
    toast.present();
  }
}
