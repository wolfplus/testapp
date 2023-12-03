import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import {AccountService} from "../../../shared/services/account/account.service";
import {map, switchMap, takeUntil} from "rxjs/operators";
import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import {Brightness} from "@ionic-native/brightness/ngx";
import {ModalController} from "@ionic/angular";
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-my-qr-code',
  templateUrl: './my-qr-code.component.html',
  styleUrls: ['./my-qr-code.component.scss']
})
export class MyQrCodeComponent implements OnInit, OnDestroy {

  @Input() userMe: any;
  @Input() clubId: any;
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  clientClub: any | undefined;
  env: any;
  currentBrightness: any;
  isLoading: boolean = true;
  private readonly ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private accountService: AccountService,
              private environmentService: EnvironmentService,
              private brightness: Brightness,
              private modalController: ModalController) {
    this.env = this.environmentService.getEnvFile();
  }


  ngOnInit(): void {
    this.brightness.getBrightness().then(brightness => {
      this.currentBrightness = brightness;
      this.brightness.setBrightness(1);
    });
    if (this.userMe && this.clubId) {
      this.getClientClub().pipe(
        takeUntil(this.ngUnsubscribe$),
      ).subscribe((clientClub: any | undefined) => {
        this.clientClub = clientClub;
        this.isLoading = false;
      });
    }
  }

  private getClientClub(): Observable<any> {
    return this.accountService.getClientClub(this.userMe.id, this.clubId).pipe(
      map(((clientClub) => {
        const clients: Array<any> | undefined = clientClub['hydra:member'];
        return clients && clients.length > 0 ? clients[0] : undefined;
      }))
    );
  }

  close() {
    this.modalController.dismiss();
  }

  ngOnDestroy(): void {
    this.brightness.setBrightness(this.currentBrightness);
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  generateQrCode(): void {
    if (this.userMe && this.clubId) {
      this.isLoading = true;
      this.accountService.genarateAccessCode(this.userMe.id, this.clubId).pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap(() => this.getClientClub())
      ).subscribe((clientClub: any | undefined) => {
        this.clientClub = clientClub;
        this.isLoading = false;
      });
    }
  }
}
