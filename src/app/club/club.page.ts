import { Component, Input, OnInit } from '@angular/core';
import { trigger, style, animate, transition, keyframes } from '@angular/animations';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getActiveSection, getNavFromDirection, getNavToDirection } from 'src/app/club/store';
import { ClubState } from './store/club.reducers';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-club',
  templateUrl: './club.page.html',
  styleUrls: ['./club.page.scss'],
  animations: [
    trigger('enterFromLeft', [
      transition(
        ':enter',
        animate('.8s ease', keyframes([
          style({transform: 'translateX(100%)', offset: 0}),
          style({transform: 'translateX(0%)', offset: 1.0})
        ]))
      ),
      transition(
        ':leave', [],
      )
    ]),
    trigger('enterFromRight', [
      transition(
        ':enter',
        animate('.8s ease', keyframes([
          style({transform: 'translateX(-100%)', offset: 0}),
          style({transform: 'translateX(0%)', offset: 1.0})
        ]))
      ),
      transition(
        ':leave', [],
      )
    ]),
    trigger('leaveToLeft', [
      transition(
        ':enter', [],
      ),
      transition(
        ':leave',
        animate('2s ease', keyframes([
          style({transform: 'translateX(0%)', offset: 0}),
          style({transform: 'translateX(-100%)', offset: 1.0}),
        ]))
      )
    ]),
    trigger('leaveToRight', [
      transition(
        ':enter', [],
      ),
      transition(
        ':leave',
        animate('2s ease', keyframes([
          style({transform: 'translateX(0%)', offset: 0}),
          style({transform: 'translateX(100%)', offset: 1.0})
        ]))
      )
    ])
  ]
})

export class ClubPage implements OnInit {
  club$: Observable<any>;
  clubId: string;
  activeSection$: Observable<{name: string, index: number}>;
  activeSection: {name: string, index: number};

  navigationAnimationBehaviour: string;
  navFromDirection$: Observable<any>; // { navFrom: string, navTo: string}
  navToDirection$: Observable<any>;

  @Input() id: string;
  constructor(private clubStore: Store<ClubState>) {}

  ngOnInit() {
    this.activeSection$ = this.clubStore.pipe(
      select(getActiveSection),
    );

    this.navToDirection$ = this.clubStore.pipe(
      select(getNavToDirection),
      map(directions => directions)
    );

    this.navFromDirection$ = this.clubStore.pipe(
      select(getNavFromDirection),
      map(direction => direction)
    );

  }
}
