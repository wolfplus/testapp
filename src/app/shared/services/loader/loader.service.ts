import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loading: HTMLIonLoadingElement | undefined;

  constructor(
    public loadingController: LoadingController
  ) { }

  async presentLoading() {
    if (this.loading !== undefined) {
      return Promise.resolve();
    }
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      duration: 15000
    }).then(load => {

      this.loading = load;
      this.loading.present().then();
    });
  }

  async dismiss() {
    if (this.loading !== undefined) {
      return await this.loading.dismiss().then(() => {
        this.loading = undefined;
      });
    }
    return Promise.resolve();
  }

  // async presentLoadingWithOptions() {
  //   const loading = await this.loadingController.create({
  //     spinner: null,
  //     duration: 5000,
  //     message: 'Click the backdrop to dismiss early...',
  //     translucent: true,
  //     cssClass: 'custom-class custom-loading',
  //     backdropDismiss: true
  //   });
  //   await loading.present();

  //   // const { role, data } = 
  //   await loading.onDidDismiss();
  // }
}
