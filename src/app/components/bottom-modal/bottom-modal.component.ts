import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-bottom-modal',
  templateUrl: './bottom-modal.component.html',
  styleUrls: ['./bottom-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'fadeInFadeOut',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('.5s ease-in',
                    style({ opacity: 0.2 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 0.2}),
            animate('5s ease-out',
                    style({ opacity: 0 }))
          ]
        )
      ]
    ),
    trigger(
      'slideInSlideOut',
      [
        transition(
          ':enter',
          [
            style({ bottom: '-100%' }),
            animate('.5s ease-in',
                    style({ bottom: 0 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ bottom: 0}),
            animate('1s ease-out',
                    style({ bottom: '-100%' }))
          ]
        )
      ]
    )
  ]
})
export class BottomModalComponent implements OnInit {
  title: string;

  constructor() { }

  ngOnInit(): void {
  }

  onBackBtnClicked() {

  }

}
