import {Component, EventEmitter, Input, Output, ViewChild, OnChanges} from '@angular/core';
import { IonRadioGroup } from '@ionic/angular';

@Component({
  selector: 'app-select-count-player',
  templateUrl: './select-count-player.component.html',
  styleUrls: ['./select-count-player.component.scss'],
})
export class SelectCountPlayerComponent implements OnChanges{

  @ViewChild('radioGroup') radioGroup: IonRadioGroup;

  @Input() proposals: Array<any>;
  @Input() selected: number;
  @Input() price: number;
  @Input() currency: string;
  @Output() countChanged = new EventEmitter<void>();

  constructor() { }

  ngOnChanges() {
    this.proposals.sort((x, y) => x.count - y.count);
  }

  onChange(value) {
    this.radioGroup.value = value.toString();
    this.countChanged.emit(value);
  }
}
