import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Service } from '../../models/service';
import { getCurrentClubServices, getServicesLoadingState } from '../../store';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-club-services',
  templateUrl: './club-services.component.html',
  styleUrls: ['./club-services.component.scss']
})
export class ClubServicesComponent implements OnInit {
  title$ = this.translator.get('services');
  services: Array<Service>;
  services$: Observable<Array<Service>>;
  servicesLoadingStates$: Observable<{
      servicesAreLoading: boolean;
      servicesAreLoaded: boolean;
  }>;

  constructor(
    public sanitizer: DomSanitizer,
    private store: Store<ClubState>,
    private translator: TranslateService
  ) { }

  ngOnInit() {
    this.services$ = this.store.pipe(select(getCurrentClubServices));
    this.servicesLoadingStates$ =
        this.store.select(getServicesLoadingState);
  }

}
