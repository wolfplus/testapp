import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-steps-number-round',
  templateUrl: './steps-number-round.component.html',
  styleUrls: ['./steps-number-round.component.scss'],
})
export class StepsNumberRoundComponent implements OnInit {
  @Input() stepsQuantity: number;
  @Input() selectedIndex: number;
  constructor() { }

  ngOnInit() {}

}
