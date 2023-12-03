import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class UserTokenService {

  key = 'TOKENS_USER';
  constructor() { }

  add(data: any) {
    return Preferences.set({key: this.key, value: JSON.stringify(data)});
  }

  get() {
    return Preferences.get({key: this.key}).then(dataString => {
      return JSON.parse(dataString.value);
    });
  }

  getToken(): Promise<string | undefined> {
    return new Promise((resolve, _reject) => {
      /*const tokensUser = async () => {
        const { value } = await Preferences.get({key: 'TOKENS_USER'});
        alert(`Hello ${value}!`);
      };*/

      try {

        Preferences.get({key: 'TOKENS_USER'}).then(tokens => {
          const tokenArray = JSON.parse(tokens.value);
          if (tokenArray.token) {
            resolve(tokenArray.token);
          } else {
            resolve(undefined);
          }
        }).catch(() => {
          resolve(undefined);
        });

      } catch (e) {
      }

    });


    /*
    return await Preferences.get({key: 'TOKENS_USER'}).then(dataString => {
      alert('getToken 2');
      if (!dataString) {
        alert('getToken 3');
        return null;
      }
      alert('getToken 4');
      const data = JSON.parse(dataString.value);
      alert('getToken 5');
      if (data.token) {
        alert('getToken 6');
        return data.token;
      }
      // return null;
    }).catch(e => {
      alert('error getToken');
      return null;
    });
    */
  }

  getRefreshToken() {
    return Preferences.get({key: this.key}).then(dataString => {
      if (!dataString.value) {
        return null;
      }
      const data = JSON.parse(dataString.value);
      if (data.refresh_token) {
        return data.refresh_token;
      }
      return null;
    });
  }

  delete() {
    Preferences.remove({key: this.key}).then(() => {});
  }
}
