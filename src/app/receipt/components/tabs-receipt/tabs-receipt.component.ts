import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-tabs-receipt',
  templateUrl: './tabs-receipt.component.html',
  styleUrls: ['./tabs-receipt.component.scss']
})
export class TabsReceiptComponent implements OnInit {
  NOTIFICATIONS = 'NOTIFICATIONS';
  INVITS = 'INVITS';
  @Output() changeView = new EventEmitter();
  selectedView: string;
  constructor() {
    this.selectedView = this.NOTIFICATIONS;
    this.changeView.emit(this.selectedView);
  }

  ngOnInit(): void {
  }
  segmentChanged(event) {
    this.selectedView = event.detail.value;
    this.changeView.emit(this.selectedView);
  }
}
