import { Component, OnInit } from '@angular/core';
import {LocaleService} from "../../shared/services/translate/locale.service";
import {Preferences} from "@capacitor/preferences";
import {EnvironmentService} from "../../shared/services/environment/environment.service";

@Component({
  selector: 'app-select-locale',
  templateUrl: './select-locale.component.html',
  styleUrls: ['./select-locale.component.css']
})
export class SelectLocaleComponent implements OnInit {

  locale: string = 'fr';
  env: any;

  constructor(
      private localeService: LocaleService,
      private environmentService: EnvironmentService
  ) {

    this.env = this.environmentService.getEnvFile();
    Preferences.get({key: 'locale'}).then(resp => {
      if (resp.value) {
        this.locale = resp.value;
      } else {
        this.locale = this.env.defaultLang;
      }
    });
  }

  ngOnInit(): void {
  }

  changeLocale() {
    this.localeService.setLanguage(this.locale, true);
  }

}
