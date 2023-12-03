import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tabs-account',
  templateUrl: './tabs-account.component.html',
  styleUrls: ['./tabs-account.component.scss']
})
export class TabsAccountComponent implements OnInit {
  @Input() selectedView: string;
  @Input() userData: any;
  @Output() changeTab = new EventEmitter();

  tab1 = this.translate.instant('profile');
  tab2 = this.translate.instant('information');

  constructor(private translate: TranslateService) {
    this.selectedView = 'PROFIL';
    this.changeTab.emit(this.selectedView);
  }

  ngOnInit(): void {
  }

  segmentChanged(event) {
    this.selectedView = event.detail.value;
    this.changeTab.emit(this.selectedView);
  }
}
