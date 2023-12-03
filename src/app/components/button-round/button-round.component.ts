import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';

import { rubberButton } from '../../animations';

@Component({
  selector: 'app-button-round',
  templateUrl: './button-round.component.html',
  styleUrls: ['./button-round.component.scss'],
  animations: [ // For example
    rubberButton
  ]
})
export class ButtonRoundComponent {
  @Input() textKey: string;
  @Input() backgroundTextColorClass = 'background-text-color-secondary';
  @Input() uppercase = true;
  @Input() color?: string;
  @Input() isSubmitBtn = false;
  @Input() loaderIsActive$: Observable<boolean> = of(false);
  buttonClicked = false;
  constructor() {}

  onButtonClicked() {
    this.buttonClicked = true;
    setTimeout( () => this.buttonClicked = false, 1000);
  }

}
