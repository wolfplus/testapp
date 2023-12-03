import { Injectable, OnDestroy } from '@angular/core';
import { Geolocation as IonicGeolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import * as GeolocationActions from '../../../state/actions/geolocation.actions';
import * as ValidatedSearchActions from '../../../state/actions/validated-search.actions';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { AROUND_ME, Geolocation } from '../../models/geolocation';
import { takeUntil } from 'rxjs/operators';

export enum GEOLOCATION_ERROR {
  PERMISSION_DENIED = 1,
  POSITION_UNAVAILABLE = 2,
  TIMEOUT = 3,
}

export interface GeolocationErrorMessage {
  title: string;
  text: string;
}

@Injectable()
export class GeolocationService implements OnDestroy {
  options: GeolocationOptions;
  currentPos: Geoposition;
  stopPopagation: boolean;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private geolocation: IonicGeolocation,
    private store: Store<AppState>,
    private translateService: TranslateService,
  ) {}

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  destroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getCurrentPosition(_origin?, _stopPropagation = false) {
    return new Promise<Geolocation>((resolve, reject) => {
      this.store.select('geolocation').pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe(data => {
        if (data) {        
          if (data.longitude && data.latitude) {

            this.store.dispatch(new ValidatedSearchActions.AddValidatedSearch(AROUND_ME));
            Preferences.set({
              key: 'GEOLOCATION', value: JSON.stringify({
                longitude: data.longitude,
                latitude: data.latitude
              })
            })
            .then( () => resolve(data as Geolocation));
          } else {
            this.options = {
              maximumAge: 3000,
              enableHighAccuracy: true
            };
            try {

            this.geolocation.getCurrentPosition(this.options)
              .then((pos: Geoposition) => {
                this.currentPos = pos;
                Preferences.set({
                  key: 'GEOLOCATION', value: JSON.stringify({
                    longitude: pos.coords.longitude,
                    latitude: pos.coords.latitude
                  })
                });
                this.store.dispatch(
                    new GeolocationActions.AddGeolocation({
                      longitude: pos.coords.longitude,
                      latitude: pos.coords.latitude
                    })
                );
                this.store.dispatch(new ValidatedSearchActions.AddValidatedSearch(AROUND_ME));
                /* resolve({
                  longitude: pos.coords.longitude,
                  latitude: pos.coords.latitude
                }); */
              })
              .catch(err => {
                Preferences.get({key: 'GEOLOCATION'})
                  .then( geoloc => {
                    if (geoloc.value !== undefined && geoloc.value !== null) {
                      const geolocation = JSON.parse(geoloc.value);
                      this.stopPopagation = true;
                      this.store.dispatch(
                        new GeolocationActions.AddGeolocation({
                          longitude: geolocation.longitude,
                          latitude: geolocation.latitude
                        })
                      );
                    } else {
                      reject(this.composeErrorMessage(err));
                    }
                  });
              });
            } catch (t) {
              console.error('catch error : ', t);
            }
          }
        } else {
          reject(this.composeErrorMessage({code: GEOLOCATION_ERROR.POSITION_UNAVAILABLE}))
        }
      });

    });
  }

  composeErrorMessage(error): GeolocationErrorMessage {
    let message: GeolocationErrorMessage = {
      title: "",
      text: ""
    };

    switch (error.code) {
      case GEOLOCATION_ERROR.PERMISSION_DENIED:
        message = {
          title: this.translateService.instant('geolocation_deactivated_title'),
          text: this.translateService.instant('geolocation_deactivated_text')
        };
        break;
      case GEOLOCATION_ERROR.POSITION_UNAVAILABLE:
        message = {
          title: this.translateService.instant('geolocation_unavailable_title'),
          text: this.translateService.instant('geolocation_unavailable_text')
        };
        break;
      case GEOLOCATION_ERROR.TIMEOUT:
        message = {
          title: this.translateService.instant('geolocation_unavailable_timeout_title'),
          text: this.translateService.instant('geolocation_unavailable_timeout_text')
        };
        break;
      default:
        message = {
          title: this.translateService.instant('geolocation_unknow_error_title'),
          text: this.translateService.instant('geolocation_unknow_error_text')
        };
        break;
    }
    return message;
  }


}
