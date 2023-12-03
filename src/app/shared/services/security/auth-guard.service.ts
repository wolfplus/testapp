import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ModalService } from '../modal.service';
import { AuthService } from '../user/auth.service';
import { NavController } from '@ionic/angular';
import { UserTokenService } from '../storage/user-token.service';
import {LoaderService} from "../loader/loader.service";
import { SignComponent } from 'src/app/modal/auth/sign/sign.component';
import * as AccountActions from "../../../account/store/account.actions";
import {Store} from "@ngrx/store";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private nav: NavController,
    private modalService: ModalService,
    private userToken: UserTokenService,
    private accountStore: Store<any>,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {}

  async canActivate(route?: ActivatedRouteSnapshot, redirect?: boolean): Promise<boolean> {
    // this.userToken.delete();
    // TODO : Add there pathName of view to stay active on not logged to sign Modal
    const fixedPage = [
        'booking-group-selection'
    ];
    if (fixedPage.includes(route.routeConfig.path)) {
      redirect = false;
    }
    return await this.userToken.getToken()
      .then(token => {
        if (token) {
          // return true;
          // let rest = false;

          return new Promise<boolean>((resolve, reject) => {
            this.authService.getConnectedUser()
              .subscribe(async data => {
                await this.accountStore.dispatch(AccountActions.setMe({ data }));
                if (data === undefined) {
                  return reject(false);
                }
                return resolve(true);
              });
          });
          // return rest;

        } else {
          if (redirect === false) {
            this.loaderService.dismiss().then()
            this.modalService.signModal(SignComponent).then();
          } else {
            this.nav.navigateRoot('/home').then(() => {
              this.loaderService.dismiss().then()
              this.modalService.signModal(SignComponent).then();
            });
          }
          return false;
        }
      }).catch(() => {
        // console.error("ERROR: ");
        if (redirect === false) {
          this.modalService.signModal(SignComponent).then();
        } else {
          this.nav.navigateRoot('/home').then(() => {
            this.modalService.signModal(SignComponent).then();
          });
        }
        return false;
      });
  }
}
