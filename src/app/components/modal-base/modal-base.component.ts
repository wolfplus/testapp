import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-base',
  templateUrl: './modal-base.component.html',
  styleUrls: ['./modal-base.component.scss']
})
export class ModalBaseComponent implements OnInit {
  @Input() bookingIRI;
  @Input() userId;
  rootParams: any;
  rootPage: any;

  constructor() { }

  ngOnInit() {
    this.rootParams = {
      bookingIRI: this.bookingIRI,
      userId: this.userId
    };
  }

}
