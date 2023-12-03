import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClubService } from '../../../shared/services/club/club.service';
import { filter, map, tap } from 'rxjs/operators';
import { Club } from '../../../shared/models/club';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { Geolocation } from 'src/app/shared/models/geolocation';

@Component({
  selector: 'app-discovers',
  templateUrl: './discovers.component.html',
  styleUrls: ['./discovers.component.scss'],
})
export class DiscoversComponent implements OnInit {
  // @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  @ViewChild("slide", {static: false}) slide: ElementRef;

  sliderOne = {
    isBeginningSlide: true,
    isEndSlide: false,
    slidesItems: null
  };
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 3,
    autoplay: true
  };

  discovers: Club[];
  skeletonShow: boolean;

  userLocation$: Observable<Geolocation> = of({ latitude: null, longitude: null});

  constructor(
    private clubService: ClubService,
    private store: Store<AppState>
  ) {
    this.skeletonShow = false;
    this.discovers = [];
  }

  ngOnInit() {
    this.clubService.getDiscoveries()
      .pipe(
        tap( () => this.skeletonShow = false),
        filter( discoveries => discoveries !== undefined && discoveries['hydra:member'] !== undefined),
        map( discoveries => discoveries['hydra:member']),
      )
      .subscribe();

    this.userLocation$ = this.store.pipe(
      select('geolocation'),
      map( geoloc => geoloc)
    );
  }

  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }
}
