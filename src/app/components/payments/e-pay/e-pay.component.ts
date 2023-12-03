import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, NEVER, Observable, Subject } from 'rxjs';
import KRGlue from "@lyracom/embedded-form-glue";
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { catchError, takeUntil } from 'rxjs/operators';
import { ClientClub } from 'src/app/shared/models/client-club';
import { Cart } from 'src/app/shared/models/cart';
import { LocaleService } from 'src/app/shared/services/translate/locale.service';

export interface PaymentIntent {
  formToken: string;
  publicKey: string;
  serverUrl: string;
}

@Component({
  selector: 'app-e-pay',
  templateUrl: './e-pay.component.html',
  styleUrls: ['./e-pay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EPayComponent implements OnInit, OnDestroy, OnChanges {

  @Input() client: ClientClub;
  @Input() cart: Cart;
  @Input() restToPay: number;
  @Output() isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onError: EventEmitter<KRError | void> = new EventEmitter<KRError | void>();
  @Output() onPaid: EventEmitter<KRPaymentResponse> = new EventEmitter<KRPaymentResponse>();

  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();
  private readonly KR$: BehaviorSubject<KR | undefined> = new BehaviorSubject<KR | undefined>(undefined);

  constructor(
    private http: HttpClient, 
    private environmentService: EnvironmentService, 
    private localeService: LocaleService,
    ) { }
  
  
  ngOnChanges(changes: SimpleChanges): void {
    const KR: KR = this.KR$.value;

    if (KR !== undefined) {
      this.createPayment(this.cart['@id'], changes.restToPay.currentValue / 100, this.client['@id'])
      .pipe(
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((paymentIntent: PaymentIntent) => {
        KR.setFormToken(paymentIntent.formToken);
      });
      
    }
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.createPayment(this.cart['@id'], this.restToPay / 100, this.client['@id'])
    .pipe(
      takeUntil(this.ngUnsubscribe),
    )
    .subscribe((paymentIntent: PaymentIntent) => {
      console.log("local",this.localeService.getLocale());
      console.log(paymentIntent);
      KRGlue.loadLibrary(paymentIntent.serverUrl, paymentIntent.publicKey)
      .then(({KR}) => {
        this.KR$.next(KR); 
        return {KR};
      })
      .then(({KR}) => KR.setFormConfig({              
        formToken: paymentIntent.formToken,
        'kr-language': this.localeService.getLocale(),  
        'kr-hide-debug-toolbar': true                    
      }))
      .then(({KR}) => KR.addForm('#myPaymentForm'))  
      .then(({KR, result}) => KR.showForm(result.formId).then(() => KR.setHelpVisibility(result.formId, false)))
      .then(({KR}) => KR.onFormValid(() => this.isFormValid.emit(true)))   
      //.then(({KR}) => KR.onFormInvalid(() => this.isFormValid.emit(false)))     
      .catch((err) => {
        console.log("error", err);
      }); 
      
    });    
  }

  private createPayment(cardIri: string, amount: number, clubClientIri: string): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(`${this.environmentService.getEnvFile().domainAPI}/epaync/payment-intent`, {
      paymentCart: cardIri,
      amount,
      currency: "XPF",
      clubClient: clubClientIri
  }).pipe(
    takeUntil(this.ngUnsubscribe),
    catchError((error: any) => {
      console.log("payment-intent error", error);

      return NEVER;
      ;
    }));
  }

  public submit(onSubmit: (response: KRPaymentResponse) => void, onError?: () => void): void {
    const KR: KR = this.KR$.value;

    if (KR !== undefined) {
      KR.onSubmit((response: KRPaymentResponse) => {
        if (response.clientAnswer.orderStatus === "PAID") {
          console.log("PAID ", response);
          this.onPaid.emit(response);
          onSubmit(response);
        }
        return true;
      })
      .then(({KR}) => KR.onError((error: KRError) => {
        this.onError.emit(error);
        onError();
      }));

      KR.submit();
    }
  }

  // private createPayment2(cardIri: string, amount: number, clubIri: string, userIri: string): Observable<PaymentIntent> {
  //   return this.http.post<PaymentIntent>(`${this.environmentService.getEnvFile().domainAPI}/epaync/payment-intent`, {
  //     paymentCart: cardIri,
  //     amount,
  //     currency: "XPF",
  //     club: clubIri,
  //     user: userIri
  // }).pipe(
  //   takeUntil(this.ngUnsubscribe),
  //   catchError((error: any) => {
  //     console.log("payment-intent error", error);

  //     return NEVER;
  //     ;
  //   }));
  // }

}
