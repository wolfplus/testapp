import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AccountService} from "../../../../../services/account/account.service";
import {first, tap} from "rxjs/operators";
import {IonRadioGroup, ModalController} from "@ionic/angular";

@Component({
    selector: 'app-credit-modal',
    templateUrl: './credit-modal.component.html',
    styleUrls: ['./credit-modal.component.scss']
})
export class CreditModalComponent implements OnInit {
    @ViewChild('radioGroup') radioGroup: IonRadioGroup;

    @Input() cart: any;
    @Input() client: any;
    @Input() selectedCredit;

    @Output() evtCredSelected;

    loader = true;

    creditsBalance: Array<any> = [];
    constructor(private accountService: AccountService,
                private modalController: ModalController) { }

    ngOnInit(): void {
        this.getCreditBalance();
    }

    getCreditBalance() {
        let cartId = this.cart["@id"].split('/')[3];
        this.accountService.getCreditPriceInfo(cartId, this.client.id)
            .pipe(
                first(),
                tap(tokens => {
                    this.creditsBalance = tokens.paymentTokenAmounts;
                    this.loader = false;
                })
            ).subscribe();
    }

    closeModal() {
        this.modalController.dismiss(this.selectedCredit);
    }

    validateCredit() {
        if (!this.loader) {
            if (this.creditsBalance.length === 0) {
                this.closeModal();
            } else if (this.creditsBalance.length > 0) {
                const selectedCredit = this.creditsBalance.find(el => el.paymentToken.id === this.radioGroup.value);
                this.modalController.dismiss(selectedCredit);
            }
        }
    }
}
