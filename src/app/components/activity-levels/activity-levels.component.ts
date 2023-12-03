import { Component, Input, OnInit } from '@angular/core';
import { ElementPosition } from 'src/app/shared/models/style';

@Component({
  selector: 'app-activity-levels',
  templateUrl: './activity-levels.component.html',
  styleUrls: ['./activity-levels.component.scss']
})
export class ActivityLevelsComponent implements OnInit {
  @Input() activityName: string;
  @Input() activityIcon: string;
  @Input() levels?: Array<any> = null;
  @Input() colors: Array<any>;
  @Input() tagWidth = '100%';
  @Input() levelsRequired = false;
  @Input() position: ElementPosition = ElementPosition.SPACE_BETWEEN;
  /* TODO: delete  */
  background: string;
  backgroundRepeat: string;
  opacity: string;
  ElementPosition = ElementPosition;

  constructor() { }

  ngOnInit() {
  }

  setGradient() {
    return {
      background: `linear-gradient(90deg, ${this.colors[0]}, ${this.colors[1]})`,
      'background-repeat': 'no-repeat',
      opacity: '.65',
      width: this.tagWidth,
      height: '100%',
      'border-radius': '11px',
    };
  }

}
