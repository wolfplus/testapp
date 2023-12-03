import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-step-indicators',
  templateUrl: './step-indicators.component.html',
  styleUrls: ['./step-indicators.component.scss']
})
export class StepIndicatorsComponent implements OnInit {
  @Input() steps: number;
  @Input() modalIndexNumber: number;
  constructor() { }

  ngOnInit() {
  }

}
