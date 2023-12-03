import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {ModalService} from '../../../../shared/services/modal.service';
import {Router} from '@angular/router';

import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import {ModalController, NavController} from '@ionic/angular';
import { ChoiceClubComponent } from 'src/app/modal/choice-club/choice-club.component';
import { ClubService } from 'src/app/shared/services/club/club.service';
import {select, Store} from "@ngrx/store";
import {ClubState} from "../../../../club/store/club.reducers";
import {getCurrentClub} from "../../../../club/store";
import {tap} from "rxjs/operators";
import { ClubDetailComponent } from 'src/app/club-detail/club-detail.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  env;
  baseUrl;
  userMe: any;
  clubId: any;
  urlPath;

  infoSvg = '<svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
      '\t viewBox="0 0 400 400" style="enable-background:new 0 0 400 400;" xml:space="preserve">\n' +
      '<style type="text/css">\n' +
      '\t.st0{}\n' +
      '</style>\n' +
      '<path class="st0" d="M200.23,1.35C90.452,1.35,1.459,90.342,1.459,200.12s88.992,198.77,198.77,198.77S399,309.898,399,200.12\n' +
      '\tC398.979,90.351,309.999,1.371,200.23,1.35z M166.557,123.177c0-18.597,15.076-33.672,33.672-33.672v0.019\n' +
      '\tc18.597,0,33.672,15.076,33.672,33.672c0,18.597-15.076,33.672-33.672,33.672c-18.597,0-33.672-15.076-33.672-33.672\n' +
      '\tC166.557,123.19,166.557,123.183,166.557,123.177z M235.515,302.692h-70.551c-5.301,0-9.599-4.298-9.599-9.599v-19.197\n' +
      '\tc0-5.301,4.297-9.599,9.599-9.599h9.599v-51.353h-9.599c-5.301,0-9.599-4.297-9.599-9.599v-19.197c0-5.301,4.297-9.599,9.599-9.599\n' +
      '\th51.296c5.301,0,9.599,4.297,9.599,9.599v80.149h9.599c5.301,0,9.599,4.297,9.599,9.599l0.058,19.197\n' +
      '\tC245.113,298.395,240.816,302.692,235.515,302.692z"/>\n' +
      '</svg>';

  hasLoaded: boolean;

  itemsCategories: Array<any>;

  @Input() userId = null;
  @Input() clubSelected: any;
  @Input() clubs: any;
  @Output() refreshClubs = new EventEmitter<any>(false);

  constructor(
    private modalService: ModalService,
    private clubStore: Store<ClubState>,
    private router: Router,
    public environmentService: EnvironmentService,
    private navCtr: NavController,
    private modalCtrl: ModalController,
    private clubService: ClubService  ) {
    this.env = this.environmentService.getEnvFile();
    this.baseUrl = this.env.domainAPI;
    this.urlPath = this.environmentService.getEnvFile().pathFiles;
  }

  ngOnInit() {
    if (!this.clubSelected.id) {
      this.clubStore.pipe(select(getCurrentClub),tap(club => {
        if (club) {
          if (club.id) {
            this.clubSelected = club;
          }
        }
        this.loadCategories();
      })).subscribe();
    } else {
      this.loadCategories();
    }
  }

  showClubsModal() {
    if (this.env.marqueBlanche.countclub > 1) {
      this.choiceClubModal(this.clubs).then();
    }
  }

  choiceClubModal(clubs) {
    return this.modalCtrl.create({
      component: ChoiceClubComponent,
      cssClass: 'modal-choice',
      componentProps: {
        clubs
      }
    }).then(modal => {
      modal.present().then();
      modal.onDidDismiss().then(data => {
        if (data.data.club) {
          this.clubSelected = data.data.club;
          this.loadCategories();
          this.refreshClubs.emit({reload: true, clubSelected: this.clubSelected});
        }
      });
    });
  }

  showClub() {
    this.modalService.showClub(ClubDetailComponent, this.clubId).then();
  }

  bookIn(category = null) {
    switch (category.activityType) {
      case 'formula':
        this.router.navigate(['choices-activities'],
            {queryParams:
                  {
                    categoryBookId: category.id,
                    clubId: this.clubSelected['id'],
                    from: category.activityType
                  }
            }
        ).then();
        break;
      case 'lesson':
        this.router.navigate(['select-booking'],
            {queryParams:
                  {
                    name: this.environmentService.getEnvFile().marqueBlanche.nameMb,
                    from: 'cat-courses',
                    categoryId: category.id,
                    guid: this.clubSelected['id']
                  }
            }
        ).then();
        break;
        case 'event':
            this.router.navigate(['select-booking'],
                {queryParams:
                        {
                            name: this.environmentService.getEnvFile().marqueBlanche.nameMb,
                            from: 'cat-events',
                            categoryId: category.id,
                            guid: this.clubSelected['id']
                        }
                }
            ).then();
            break;
      case 'leisure':
          this.router.navigate(['choices-activities'],
              {queryParams:
                    {
                      categoryBookId: category.id,
                      clubId: this.clubSelected['id'],
                      from: category.activityType
                    }
              }
          ).then();
          break;
      case 'sport':
        this.router.navigate(['choices-activities'],
            {queryParams:
                  {
                    categoryBookId: category.id,
                    clubId: this.clubSelected['id'],
                    from: category.activityType
                  }
            }
        ).then();
        break;
      default:
        this.router.navigate(['select-booking'],
            {queryParams:
                  {
                    name: this.environmentService.getEnvFile().marqueBlanche.nameMb,
                    categoryId: category.id,
                    guid: this.clubSelected['id'],
                    from: 'sport'
                  }
            }
        ).then();
        break;

    }
  }

  selectClubToBook() {
    this.router.navigate(['search-club'])
      .then();
  }

  showClubs() {
    this.router.navigate(['/search-club']).then();
  }

  showMatchs() {
    this.router.navigate(['/matches']).then();
  }

  showAccount() {
    this.router.navigate(['/account/me']).then();
  }

  goToShop() {
      this.navCtr.navigateRoot('/shop').then();
  }

  loadCategories() {
    this.hasLoaded = false;
    this.clubService.getClubCategories(this.clubSelected.id).pipe(tap(categories=>  {
      this.itemsCategories = categories;
      this.hasLoaded = true;
    })).subscribe();
  }

  showFriends() {
    this.navCtr.navigateRoot('/account/my-friends');
    /*this.modalCtrl.create({
      component: MyFriendsComponent,
      cssClass: 'my-component-open-class',
      componentProps: {
        userId: this.userId
      }
    })
    .then(modal => {
      modal.present().then();
      modal.onDidDismiss().then( data => {
      });
    });*/
  }
}
