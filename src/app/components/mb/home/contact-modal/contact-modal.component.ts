import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {LoaderService} from "../../../../shared/services/loader/loader.service";
import {ToastService} from "../../../../shared/services/toast.service";

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {

  disabled = false;
  message: string = '';

  constructor(
      private modalCtrl: ModalController,
      private loader: LoaderService,
      private toast: ToastService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.loader.dismiss();
    this.modalCtrl.dismiss({}, '', 'ContactModalComponent');
  }

  send() {
    if (this.message !== '') {
      this.disabled = true;
      this.loader.presentLoading().then();
      setTimeout(() => {
        this.close();
        this.toast.presentSuccess('Votre message à bien été recu. Nous vous répondrons au plus vite.');
      }, 4000);
    } else {
      this.toast.presentError('Merci de saisir votre message.');
    }
  }
}
