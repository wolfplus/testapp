import {Component, Input, OnInit} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { GoogleMapsComponent } from 'src/app/components/google-maps/google-maps.component';
import { ModalService } from 'src/app/shared/services/modal.service';
import { getClubAddress, getCurrentClubLoadedState, getCurrentClubLoadingState } from '../../store';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-club-location',
  templateUrl: './club-location.component.html',
  styleUrls: ['./club-location.component.scss']
})
export class ClubLocationComponent implements OnInit {
  // TODO: [TRANSLATION] add translation and dynamic data
  // TODO: make component more agnostic: e.g: pass parameters as input, shouldn't be club specific
  // to reuse. like: instead of clubIsLoading$: Observable<boolean> => @Input("contentIsLoading$")
  // same for the address
  title$ = this.translator.get('location');
  address$: Observable<any>;
  clubIsLoading$: Observable<boolean>;
  clubIsLoaded$: Observable<boolean>;

  @Input() address: string;
  constructor(
    private store: Store<ClubState>,
    private translator: TranslateService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.clubIsLoading$ = this.store.pipe(select(getCurrentClubLoadingState));
    this.clubIsLoaded$ = this.store.pipe(select(getCurrentClubLoadedState));
    this.address$ = this.store.pipe(select(getClubAddress));
  }

  openMap() {
    // TODO: have to pass parameters like lng lat
    this.modalService.presentGGMapsModal(GoogleMapsComponent);
  }

}
