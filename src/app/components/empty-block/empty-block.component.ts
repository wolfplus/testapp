import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-empty-block',
  templateUrl: './empty-block.component.html',
  styleUrls: ['./empty-block.component.scss'],
})
export class EmptyBlockComponent {
  @Input() message: string;
  constructor() { }
}
