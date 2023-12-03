import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
})
export class ReceiptPage implements OnInit {

  refreshSub$ = new BehaviorSubject<boolean>(true);
  refresh$ = this.refreshSub$.asObservable();
  view: string;
  // notifications: Observable<Notification[]>;

  constructor(
  ) {
    this.view = 'NOTIFICATIONS';
  }

  ngOnInit() {
    // this.notifications = this.notifService.getAllNotifications();
  }

  changeView(event) {
    this.view = event;
  }

  refresh(event) {
    this.refreshSub$.next(true);
    setTimeout(() => {
      event.target.complete();
    }, 800);
  }
}
