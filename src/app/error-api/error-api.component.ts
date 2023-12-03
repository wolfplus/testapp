import { Component, OnInit } from '@angular/core';
import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-error-api',
  templateUrl: './error-api.component.html',
  styleUrls: ['./error-api.component.scss']
})
export class ErrorApiComponent implements OnInit {
  public isMobile: boolean = false;
  constructor(private platform: Platform) {
    if ((this.platform.is('ios') || this.platform.is('android'))) {
      this.isMobile = true;
    }
  }

  ngOnInit(): void {
  }

}
