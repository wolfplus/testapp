import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';


import { SearchType } from '../enums/search-type';
import { BehaviorSubject } from 'rxjs';
import { ModalComponent } from '../models/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modalClients: HTMLIonModalElement;
  modalSearchClubResult: HTMLIonModalElement;
  modalFilterClub: HTMLIonModalElement;
  modalCourseParticipant: HTMLIonModalElement;
  modalCoursePaiement: HTMLIonModalElement;
  modalDetailClub: HTMLIonModalElement;
  modalBookingSport: HTMLIonModalElement;
  modalAuthSign: HTMLIonModalElement;
  modalAuthSignIn: HTMLIonModalElement;
  modalAuthSignUp: HTMLIonModalElement;
  modalClubDetail: HTMLIonModalElement;
  modalBookingSearch: HTMLIonModalElement;
  modalChoiceActivity: HTMLIonModalElement;
  modalDetailBooking: HTMLIonModalElement;
  matchDetailsModal: HTMLIonModalElement;

  refreshViewSub$ = new BehaviorSubject(false);
  refreshView$ = this.refreshViewSub$.asObservable();

  constructor(
    private modalController: ModalController,
    private router: Router
  ) { }

  // async presentLoginModal() {
  //   const modal = await this.modalController.create({
  //     component: HomePage,
  //     cssClass: 'my-custom-class'
  //   });
  //   return await modal.present();
  // }

  async presentGGMapsModal(component: ModalComponent) {
    const modal = await this.modalController.create({
      component: component,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async presentClubEventsModal(component: ModalComponent, events$) {
    const modal = await this.modalController.create({
      component: component,
      cssClass: 'my-custom-class',
      componentProps: {
        events$,
        foo: 'zarma'
      }
    });
    return await modal.present();
  }

  async presentClubEventDetailModal(component: ModalComponent, eventId) {
    const modal = await this.modalController.create({
      component: component,
      cssClass: 'my-custom-class',
      componentProps: {
        eventId,
      }
    });
    return await modal.present();
  }

  playerModal(component: ModalComponent, id) {
    this.modalController.create({
      component: component,
      cssClass: 'player-class',
      componentProps: { id }
    }).then(modal => {
      modal.present().then();
    });
  }

  // async presentClubSearchModal() {
  //   await this.modalController.create({
  //     component: SearchClubPage
  //   })
  //     .then(mod => {
  //       mod.present();
  //     });
  // }

  // searchType is the app section where to redirect to when search results are clicked
  async searchClubResultModal(component: ModalComponent, onShowClubComponent: ModalComponent, searchType?) {
    await this.modalController.create({
      component: component,
      componentProps: { searchType }/* ,
      cssClass: 'search-result-class-' + position, */
    }).then(mod => {
      mod.onDidDismiss()
        .then(ret => {
          if (ret.data !== undefined) {
            if (ret.data.clubId) {
              this.showClub(onShowClubComponent, ret.data.clubId, ret.data.selectedView)
            } else if (ret.data.searchType === SearchType.CLUB) {
              this.router.navigate(['/search-club']);
              // this.presentClubSearchModal();
            }
          }
        });
      mod.present().then();
    });
  }

  async filterSearchModal(component: ModalComponent, clubId?) {
    this.modalFilterClub = await this.modalController.create({
      component: component,
      cssClass: 'filter-search-class',
      componentProps: {
        clubId
      }
    });

    await this.modalFilterClub.present();
    return this.modalFilterClub;
  }

  async filterCourseSearchModal(component: ModalComponent, clubId?, activities?, filter?) {
    this.modalFilterClub = await this.modalController.create({
      component: component,
      cssClass: 'filter-search-class',
      componentProps: {
        clubId,
        activities,
        filter
      }
    });

    await this.modalFilterClub.present();
    return this.modalFilterClub;
  }

  async courseDetailsModal(component: ModalComponent, booking, user?, participated?) {
    this.modalFilterClub = await this.modalController.create({
      component: component,
      componentProps: {
        booking,
        user,
        participated
      }
    });

    await this.modalFilterClub.present();
    return this.modalFilterClub;
  }

  async courseCurseBookingModal(component: ModalComponent, booking?, user?, participated?, description?, cssClass?: string) {
    this.modalCourseParticipant = await this.modalController.create({
      component: component,
      backdropDismiss: true,
      cssClass: cssClass ?? 'course-details-class',
      componentProps: {
        booking,
        user,
        participated,
        description
      }
    });

    await this.modalCourseParticipant.present();
    return this.modalCourseParticipant;
  }

  async coursePaiementBookingModal(component: ModalComponent, booking?, user?, participated?, cart?, attenders?, participant?) {
    this.modalCoursePaiement = await this.modalController.create({
      component: component,
      cssClass: 'course-paiement-class',
      componentProps: {
        booking,
        user,
        participated,
        cart,
        attenders,
        participant
      }
    });

    await this.modalCoursePaiement.present();
    return this.modalCoursePaiement;
  }

  async closeFilterClubModal() {
    this.modalFilterClub.dismiss();
    this.modalFilterClub = undefined;
  }

  async showClub(component: ModalComponent, id, selectedView = 'informations') {
    this.modalController.create({
      // component: ClubPage,
      component: component,
      cssClass: 'club-details-class',
      componentProps: {
        id,
        selectedView
      },
      swipeToClose: true
    }).then(mod => {
      mod.present();
    });
  }

  async closeClubModal() {
    this.modalClubDetail.dismiss();
    this.modalClubDetail = undefined;
  }

  // async closeBookingSearchModal() {
  //   this.modalBookingSearch.dismiss();
  //   this.modalBookingSearch = undefined;
  // }

  bookingSportModal(component: ModalComponent, slotData, playground, duration, activity, blockPrice)  {
    return this.modalController.create({
      component: component,
      cssClass: 'booking-sport-class',
      componentProps: {
        slotData,
        playground,
        duration,
        activity,
        timeTableBlockPricesId: blockPrice['id']
      }
    });
  }

  // async closeBookingSportModal() {
  //   this.modalBookingSport.dismiss();
  //   this.modalBookingSport = undefined;
  // }

  // async presentMatchDetails(matchId: string, matchActivityId: string) {
  //   return await this.modalController
  //     .create({
  //       component: MatchDetailComponent,
  //       cssClass: 'match-details-class',
  //       componentProps: {
  //         matchId,
  //         matchActivityId
  //       },
  //       animated: true
  //     });
  //   // return await this.matchDetailsModal.present();
  //   /* .then(modal => {
  //     modal.onDidDismiss().then( data => {
  //       return data;

  //     });
  //     modal.present();
  //   }); */
  // }

  async presentMatchComments(component: ModalComponent, matchId: string, matchName: string, userId: string, clubName: string, clubLogoUrl: string) {
    const matchCommentsModal = await this.modalController
      .create({
        component: component,
        cssClass: 'match-comments-css',
        componentProps: {
          matchId,
          matchName,
          userId,
          clubName,
          clubLogoUrl
        },
        animated: true
      });
    return await matchCommentsModal.present();
  }

  async presentCourseComments(component: ModalComponent, courseId: string, courseName: string, userId: string, club: any, clubLogoUrl: string) {
    const courseCommentsModal = await this.modalController
        .create({
          component: component,
          cssClass: 'match-comments-css',
          componentProps: {
            courseId,
            courseName,
            userId,
            club,
            clubLogoUrl
          },
          animated: true
        });
    return await courseCommentsModal.present();
  }

  async presentNewsDetails(component: ModalComponent, newsIri: string) {
    const matchCommentsModal = await this.modalController
      .create({
        component: component,
        cssClass: 'news-class',
        componentProps: {
          newsIri
        },
        animated: true
      });
    return await matchCommentsModal.present();
  }

  async signModal(component: ModalComponent) {
    this.modalController.create({
      component: component,
      cssClass: 'sign-class',
      swipeToClose: true,
      backdropDismiss: true,
      mode: 'ios'
    }).then(modal => {
      modal.dismiss();
      modal.present();
    });
  }

  // async closeSignModal() {
  //   this.modalAuthSign.dismiss();
  //   this.modalAuthSign = undefined;
  // }

  // async signInModal() {
  //   this.modalAuthSignIn = await this.modalController.create({
  //     component: SignInComponent,
  //     cssClass: 'sign-class',
  //     swipeToClose: true,
  //     backdropDismiss: true,
  //     mode: 'ios'
  //   });
  //   return await this.modalAuthSignIn.present().then(() => true);
  // }

  // async closeSignInModal() {
  //   this.modalAuthSignIn.dismiss();
  //   this.modalAuthSignIn = undefined;
  // }

  // async signUpModal() {
  //   this.modalAuthSignUp = await this.modalController.create({
  //     component: SignUpComponent,
  //     cssClass: 'sign-class',
  //     swipeToClose: true,
  //     backdropDismiss: true,
  //     mode: 'ios'
  //   });
  //   return await this.modalAuthSignUp.present();
  // }

  // async closeSignUpModal() {
  //   this.modalAuthSignUp.dismiss();
  //   this.modalAuthSignUp = undefined;
  // }

  async choiceActivityModal(component: ModalComponent) {
    this.modalChoiceActivity = await this.modalController.create({
      component: component
    });
    return await this.modalChoiceActivity.present();
  }

  async presentBookingDetailmodal(component: ModalComponent, bookingIri) {
    this.modalFilterClub = await this.modalController.create({
      component: component,
      cssClass: 'reservation-class',
      componentProps: {
        bookingIri
      }
    });

    await this.modalFilterClub.present();
    return this.modalFilterClub;
  }

  // presentFriend() {
  //   this.userTokenService.getToken().then((token: any) => {
  //     if (token) {
  //       return this.modalController.create({
  //         component: MyFriendsComponent,
  //         cssClass: 'my-component-open-class',
  //         componentProps: {
  //           userId: null
  //         }
  //       }).then(modal => {
  //         modal.present().then();
  //         modal.onDidDismiss().then(data => {
  //         });
  //       }).catch(e => {
  //         console.log('err : ', e);
  //       });
  //     } else {
  //       this.signModal().then();
  //     }
  //   }).catch(e => {
  //     this.signModal().then();
  //   });

  // }

  // presentModal(component: any, props: any = {}, cssClass: string = 'my-custom-class') {
  //   return this.modalController.create({
  //     component: component,
  //     componentProps: props,
  //     cssClass: cssClass,
  //     swipeToClose: true,
  //     backdropDismiss: true,
  //     mode: 'ios'
  //   });
  // }

  // dismissModal(data?: any, role?: string, id?: string) {
  //   return this.modalController.dismiss();
  // }
}
