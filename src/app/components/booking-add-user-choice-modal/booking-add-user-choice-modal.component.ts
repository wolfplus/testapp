import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-booking-add-user-choice-modal',
  templateUrl: './booking-add-user-choice-modal.component.html',
  styleUrls: ['./booking-add-user-choice-modal.component.scss'],
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
export class BookingAddUserChoiceModalComponent implements OnInit {

  @Output() closeModal = new EventEmitter();
  @Output() addParticipant = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onBackBtnClicked() {
    this.closeModal.emit("");
  }

  openAddModal(typeOfUser) {
    this.addParticipant.emit(typeOfUser);
  }

}
