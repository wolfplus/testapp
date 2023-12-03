import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AppState } from '../../../state/app.state';
import * as UserActions from '../../../state/actions/user.actions';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  key = 'USER_INFO';
  keyClient = 'USER_CLIENTS';

  constructor(
      private store: Store<AppState>
  ) { }

  add(data: any) {
    return this.store.dispatch(new UserActions.AddUser(data));
  }

  get() {
    return this.store.pipe(select('user'));
  }

  delete() {
    return this.store.dispatch(new UserActions.RemoveUser());
  }

  getStoredClients() {
    return Preferences.get({key: this.keyClient}).then(dataString => {
      return JSON.parse(dataString.value);
    });
  }

  addClients(data: any) {
    Preferences.set({ key: this.keyClient, value: JSON.stringify(data) }).then(() => true);
  }

  deleteClients() {
    return Preferences.remove({key: this.keyClient}).then(() => {});
  }

  isPrefered(iri) {
    let preferred = false;
    this.store.select('user')
      .subscribe(user => {
        if (user && user.preferredClubs.length > 0 && user.preferredClubs.includes(iri)) {
          preferred = true;
        }
      });
    return of(preferred);
  }

}
