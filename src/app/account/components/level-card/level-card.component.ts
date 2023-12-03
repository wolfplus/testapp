import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-level-card',
  templateUrl: './level-card.component.html',
  styleUrls: ['./level-card.component.scss']
})
export class LevelCardComponent implements OnInit {
  @Input() level: any;
  @Input() activity: any;

  slanted = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.5 10.6" height="11" width="36"><path d="m43.1 52.9v0H0l8.1 10.6h9.7v0h9.7l8-10.6z" style="fill:#dbdee5;stroke-width:0.3"/></svg>';

  constructor() { }

  ngOnInit() {
  }

  setGradient(colors) {
    // tslint:disable-next-line: max-line-length
    const computedWidth = ((100 * (this.activity.userCurrentLevelIdentifier - this.activity.lowestLevel)) / (this.activity.highestLevel - this.activity.lowestLevel));
    // const adjustedPathPoint = 100 - (computedWidth - (computedWidth - (computedWidth * (computedWidth / 100))));
    const clipPath = computedWidth === 100 ? 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)' : `polygon(0 0, 100% 0%, 95% 100%, 0 100%)`;
    return {
      'background': `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
      'background-repeat': 'no-repeat',
      'opacity': '.8',
      'width': `${computedWidth}%`,
      'clip-path': clipPath
    };

  }

}
