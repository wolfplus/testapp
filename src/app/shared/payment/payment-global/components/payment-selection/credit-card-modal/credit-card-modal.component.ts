import {Component, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {IonRadioGroup, ModalController} from "@ionic/angular";
import {switchMap, takeUntil, tap} from "rxjs/operators";
import {StripeService} from "../../../../../services/payment/stripe.service";
import { from, iif, Subject } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-credit-card-modal',
  templateUrl: './credit-card-modal.component.html',
  styleUrls: ['./credit-card-modal.component.scss']
})
export class CreditCardModalComponent implements OnInit, OnDestroy {

  @ViewChild('radioGroup') radioGroup: IonRadioGroup;
  @Input() client: any;
  @Input() user: any;
  @Input() selectedCard;
  @Input() club;

  @Output() evtCardSelected;

  savedCards: Array<any> = [];

  loader = true;

  openAddCard = false;

  validCardAdded = false;

  cardName: string;

  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
              private modalController: ModalController,
              private stripeService: StripeService,
              private loaderService: LoaderService,
              ) { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
      this.reloadCards();
  }

  closeModal() {
      if (this.openAddCard) {
          this.openAddCard = false;
      } else {
          this.modalController.dismiss(this.selectedCard);
      }
  }

  validateCard() {
      let selectedCard = this.savedCards.find(el => el.id === this.radioGroup.value);
      this.modalController.dismiss(selectedCard);
  }

  openAddCardModal() {
    this.openAddCard = true;
  }

  validateAddCard() {
    if (!this.loader) {
      // if (this.savedCards.length === 0) {
      //   this.closeModal();
      // } else if (this.savedCards.length > 0)
      {
        this.loaderService.presentLoading();

        from(Promise.resolve(this.stripeService.addPaymentSourceToStripe(this.stripeService.getCard(),
          this.cardName)))
        .pipe(
          takeUntil(this.ngUnsubscribe),
          switchMap((respSource) => iif(
            () => respSource.source.id,
            this.stripeService.addPaymentSource(this.user["@id"], this.club["@id"], respSource.source.id)
                .pipe(
                    tap(() => {
                      this.openAddCard = false;
                      this.reloadCards();
                    })
                ),
          ))
        ).subscribe(() => {
          this.loaderService.dismiss();
        });

        // this.stripeService.addPaymentSourceToStripe(this.stripeService.getCard(),
        //     this.meParticipant.user["@id"],
        //     this.club["@id"],
        //     this.cardName)
        //     .then(respSource => {
        //       this.loader = false;
        //       if(respSource.source.id) {
        //       this.stripeService.addPaymentSource(this.meParticipant.user["@id"], this.club["@id"], respSource.source.id)
        //         .pipe(
        //             tap(resp => {
        //               this.reloadCards();
        //             })
        //         )
        //         .subscribe();
        //   }
        // });
      }
    }
  }

  backPayment(event) {
    if (event.valid) {
      this.validCardAdded = true;
    } else {
      this.validCardAdded = false;
    }
  }

  cardNamePayment(event) {
    console.log(event);
    this.cardName = event;
  }

  deleteCard(cb) {
    this.loaderService.presentLoading();

      this.stripeService.deleteCardFromUser(cb.id, this.club.id, this.user.id)
          .pipe(
              takeUntil(this.ngUnsubscribe),
              tap(() => {
                  this.reloadCards();
              })
          )
          .subscribe(() => this.loaderService.dismiss())
  }

  reloadCards() {
      this.loader = true;
      this.loaderService.dismiss();
      this.stripeService.getPaymentSource(this.client.id, this.club.id)
          .pipe(
              takeUntil(this.ngUnsubscribe),
              tap(respPSS => {
                  const card = respPSS.sources.card;
                  if (card) {
                    this.savedCards = card;
                  } else {
                    this.savedCards = [];
                  }
                  this.loader = false;
              })
          )
          .subscribe(() => this.loader = false);
  }
}
