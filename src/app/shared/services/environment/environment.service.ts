import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { envPasserelle } from 'src/environments/environment.prod-passerelle';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {

    hostname = window.location.hostname;

    constructor(private platform: Platform) {}

    getEnvFile() {
        if (this.platform.is("desktop") || this.platform.is('mobileweb')) {
            const key = this.hostname.split('.')[0];
            // const key = 'agora';
            return envPasserelle[key] ? envPasserelle[key] : environment;
        } else {
            return environment;
        }
    }

    isThisMB(name) {
        if (this.platform.is("desktop") || this.platform.is('mobileweb')) {
            const key = this.hostname.split('.')[0];
            // const key = "urbanroundnet";
            if (key === name) {
                return true;
            }
        }

        return false;
    }

    isLockedFullParticipant() {
        const lockedClubs = ['tcam'];
        const data = this.getEnvFile();
        return lockedClubs.includes(data.marqueBlanche.pathName);
    }

    overwriteMatchEvent() {
        if (this.platform.is("desktop") || this.platform.is('mobileweb')) {
            const key = this.hostname.split('.')[0];
            if (key === 'sportsmersante') {
                return true;
            }
        }
        return false;
    }

    isPasserelle() {
        // return false;
        return this.platform.is("mobileweb") || this.platform.is("desktop");
    }

    isMobile() {
        return this.platform.is("mobile") || this.platform.is("mobileweb");
    }
}
