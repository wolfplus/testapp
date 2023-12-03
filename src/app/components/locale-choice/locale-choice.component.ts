import {Component, Input, OnInit} from '@angular/core';
import {Locale} from '../../shared/models/locale';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-locale-choice',
  templateUrl: './locale-choice.component.html',
  styleUrls: ['./locale-choice.component.scss']
})
export class LocaleChoiceComponent implements OnInit {
  selectedLocale: Locale;
  locales: Array<Locale>;
  showLocalesList: boolean;
  @Input() showLabel: boolean;
  constructor(
      private translate: TranslateService
  ) {
    this.showLocalesList = false;
    this.selectedLocale = {
      code: 'fr',
      name: 'Français',
      img: './assets/icon/flags/fr.svg'
    };

    this.locales = [
      {
        code: 'fr',
        name: 'France',
        img: './assets/icon/flags/fr.svg'
      },
      {
        code: 'en',
        name: 'United Kingdom',
        img: './assets/icon/flags/en.svg'
      },
      {
        code: 'be',
        name: 'Belgique NL',
        img: './assets/icon/flags/be.svg'
      },
      {
        code: 'es',
        name: 'Espana',
        img: './assets/icon/flags/es.svg'
      }
    ];
  }

  ngOnInit(): void {
  }
  changeLocale(locale) {
    this.translate.setDefaultLang(locale.code);
    this.translate.use(locale.code);
    this.selectedLocale = locale;
    this.showLocalesList = false;
  }
  showLocales() {
    this.showLocalesList = !this.showLocalesList;
  }
}
