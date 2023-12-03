import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { MatchCardConfig } from '../../../shared/enums/match-card-config';
import { Observable, of, Subscription } from 'rxjs';
import { MyMatchesState } from 'src/app/state/reducers/myMatches.reducer';
import { ViewWillEnter } from '@ionic/angular';

export enum AppSection {
  HOME = "home",
  PROFILE = "profile"
}

@Component({
  selector: 'app-matchs',
  templateUrl: './matchs.component.html',
  styleUrls: ['./matchs.component.css']
})
export class MatchsComponent implements OnDestroy, ViewWillEnter {
  @Input() userId: string;
  @Input() noChange: boolean = false;
  @Input() section: string;
  @Input() userMe:any;
  @Output() noMatch = new EventEmitter<boolean>();
  @Input() refreshMatches$: Observable<boolean> = of(false);
  @Input() clubSelected: any;
  @Input() resetFormSubject: Observable<boolean> = undefined;


  @Input() matchs: any;
  @Input() titleMatch: any = '';

  refreshMyMatches$: Observable<MyMatchesState>;
  MatchCardConfig = MatchCardConfig;

  title = "";
  clubTimeZone: string;
  $clubStoreSubcription: Subscription;
  isLoaded = false;

  clubIdSelected: string;
  clubIds: any;

  slideOpt = {
    slidesPerView: 1
  };

  slideOptTablet = {
    slidesPerView: 3
  };

  slideOptAbove = {
    slidesPerView: 2
  };


  constructor() {
    this.matchs = [];
  }

  ionViewWillEnter() {
    this.load();
  }

  async load() {
    this.isLoaded = true;
  }

  ngOnDestroy() {
    if (this.$clubStoreSubcription) {
      this.$clubStoreSubcription.unsubscribe();
    }
  }

}
