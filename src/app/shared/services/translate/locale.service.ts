import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import * as momentTz from 'moment-timezone';
import {EnvironmentService} from "../environment/environment.service";
import {Preferences} from "@capacitor/preferences";

@Injectable({
    providedIn: 'root',
})
export class LocaleService {

    locale: any = "fr-FR";
    env: any;

    constructor(
        private translateService: TranslateService,
        private environmentService: EnvironmentService
    ) {
        this.env = this.environmentService.getEnvFile();
        this.locale = this.getLocale();
    }

    getLocale() {
        if (this.locale && this.locale instanceof String) {
            if (this.locale.includes('-')) {
                this.locale = this.locale.split('-')[0];
            }
            return this.locale;
        }
        return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
    }

    async setAppLocale() {
        await Preferences.get({key: 'locale'}).then(async data => {
            if (data.value) {
                this.locale = this.switchLanguageTag(data.value);
            } else {
                this.locale = this.switchLanguageTag(await this.getDeviceLocale(true));
            }
        });

        return this.locale;
    }

    switchLanguageTag(code: string) {
        if(!code.includes('-')) {
            switch(code) {
                case 'fr':
                    return 'fr-FR';
                    break;
                case 'en':
                    return 'en-US';
                    break;
                case 'nl':
                    return 'nl-NL';
                    break;
                case 'it':
                    return 'it-IT';
                    break;
                default:
                    return 'en-US';
            }
        } else {
            if(code.includes('fr') || code.includes('en') || code.includes('nl') || code.includes('it')) {
                return code;
            } else {
                return 'en-US';
            }
        }
    }

    async getDeviceLocale(tag = false) {
        const info = tag ? await Device.getLanguageTag() : await Device.getLanguageCode();

        this.locale = (info.value.includes('fr') || info.value.includes('en') || info.value.includes('nl') || info.value.includes('it')) ? info.value : 'en';
        return this.locale;
    }

    setLanguage(lang = 'fr-FR', save = false) {
        if (lang.includes('-')) {
            lang = lang.split('-')[0];
        }
        this.translateService.setDefaultLang(lang);
        this.translateService.use(lang);
        // if (this.env.useMb) {
        //     this.translateService.use(lang + '_' + this.env.marqueBlanche.pathName);
        // }

        momentTz.locale(lang);

        if(save) {
            Preferences.set({key: 'locale', value: lang}).then();
        }
    }

    getCalendarOptions() {
        return  this.locale.includes('fr') ? { weekStart: 1, weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'] } : null;
    }
}
