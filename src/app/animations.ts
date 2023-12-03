import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

export let rubberButton = trigger(
  'rubberButton',
  [
    state(
      "clicked",
      style({ transform: "scale3d(1, 1, 1)" })
    ),
    transition("clicked <=> unclicked", animate(.5, keyframes([
      style({ transform: "scale3d(1, 1, 1)"}),
      style({ transform: "scale3d(1.25, 0.75, 1)" }),
      style({ transform: "scale3d(0.75, 1.25, 1)" }),
      style({ transform: "scale3d(1.15, 0.85, 1)" }),
      style({ transform: "scale3d(0.95, 1.05, 1)" }),
      style({ transform: "scale3d(1.05, 0.95, 1)" }),
      style({ transform: "scale3d(1, 1, 1)" }),
    ])))
  ]
);

export let slideInSlideOut = trigger(
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
);

export let fadeInFadeOutAnimation = trigger(
  'fadeInFadeOutAnimation',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('1s ease-out',
                style({ opacity: 1 }))
      ]
    ),
    transition(
      ':leave',
      [
        style({ opacity: 1 }),
        animate('1s ease-in',
                style({ opacity: 0 }))
      ]
    )
  ]
);

export let upAndDownAnimationHigh = trigger(
  'upAndDownAnimationHigh',
  [
    transition(
      'void => *',
      [
        style({ transform: 'translateY(100%)'}),
        animate('.5s ease-out'),
      ]
    ),
    transition(
      '* => void',
      [
        style({transform: 'translateY(-100%)'}),
        animate('.5s ease-in')
      ]
    )
  ]
);

export let inAnimation = trigger(
  'inAnimation',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('0.5s ease-out',
                style({ opacity: 1 }))
      ]
    )
  ]
);

trigger(
  'shrinkAndGrowAnimation',
  [
    transition(
      ':enter',
      [
        style({ height: 0 }),
        animate('10s ease-out',
                style({ height: '100%' }))
      ]
    ),
    transition(
      ':leave',
      [
        style({ height: '100%'}),
        animate('1s ease-in',
                style({ height: 0 }))
      ]
    )
  ]
),
trigger(
  'inOutAnimation',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('1s ease-out',
                style({ opacity: 1 }))
      ]
    ),
    transition(
      ':leave',
      [
        style({ opacity: 1 }),
        animate('1s ease-in',
                style({ opacity: 0 }))
      ]
    )
  ]
),
trigger(
  'upAndDownAnimationLow',
  [
    transition(
      ':enter',
      [
        style({ height: 0}),
        animate('0.3s ease-out',
                style({height: ''}))
      ]
    )
  ]
),
trigger(
  'upAndDownAnimationHigh',
  [
    transition(
      'void => *',
      [
        style({ transform: 'translateY(100%)'}),
        animate('.5s ease-out'),
      ]
    ),
    transition(
      '* => void',
      [
        style({transform: 'translateY(-100%)'}),
        animate('.5s ease-in')
      ]
    )
  ]
);
