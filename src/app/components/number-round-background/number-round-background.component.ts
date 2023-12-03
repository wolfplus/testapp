import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-number-round-background',
  templateUrl: './number-round-background.component.html',
  styleUrls: ['./number-round-background.component.scss'],
})
export class NumberRoundBackgroundComponent {
  @Input() num: number | undefined = undefined;
  @Input() selected = false;
  constructor() { }
}
