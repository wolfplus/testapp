import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ChoiceClubComponent } from 'src/app/modal/choice-club/choice-club.component';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import {EnvironmentService} from "../environment/environment.service";

@Injectable({
  providedIn: 'root'
})
export class ClubIdStorageService {

  private userDetails: Subject<any> = new Subject<any>();
  public userDetailsObs = this.userDetails.asObservable();

  environnement: any;
  once = 0;

  constructor(
      private environmentService: EnvironmentService,
      private modalController: ModalController
  ) {
    this.environnement = this.environmentService.getEnvFile();
  }

  getClubIds(){
    if (this.environnement.useMb && this.environnement.marqueBlanche.countclub > 1) {
      Preferences.get({key: 'clubId'}).then(value => {
        if (value.value){
          return;
        }
        if (value.value == null && this.once < 1) {
          this.once++;
          Preferences.set({key: 'clubId', value: this.environnement.marqueBlanche.clubIds[0]}).then(() =>  true);
          // this.choiceClubModal();
        }
      });

      return [Preferences.get({key: 'clubId'}).then(data =>  data.value)];
    } else {
      return this.environnement.marqueBlanche.clubIds;
    }
  }

  async getClubId(){
    if (this.environnement.useMb && this.environnement.marqueBlanche.countclub > 1) {
      Preferences.get({key: 'clubId'}).then(value => {
        if (value.value){
          return;
        }
        if (value.value === null && this.once < 1) {
          this.once++;
          Preferences.set({key: 'clubId', value: this.environnement.marqueBlanche.clubIds[0]}).then(() =>  true);
          // this.choiceClubModal();
        }
      });
      return Preferences.get({key: 'clubId'}).then(data =>  data.value);
    } else {
      return this.environnement.marqueBlanche.clubIds[0];
    }
  }

  async choiceClubModal() {
    const clubs = [];
    return this.modalController.create({
      component: ChoiceClubComponent,
      cssClass: 'modal-choice',
      componentProps: {
        clubs
      }
    }).then(modal => {
      modal.present().then();
      modal.onDidDismiss().then(data => {
        this.userDetails.next(data);
      });
    });
  }
}
