import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-nav-bar-club',
  templateUrl: './nav-bar-club.component.html',
  styleUrls: ['./nav-bar-club.component.scss']
})
export class NavBarClubComponent {
  @Input() selectedView: string;
  @Output() changeView = new EventEmitter();

  segmentChanged(event) {
    this.selectedView = event.detail.value;
    this.changeView.emit(this.selectedView);
  }

}
