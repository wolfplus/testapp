import { Injectable } from '@angular/core';
import {HttpService} from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(
      private httpService: HttpService
  ) { }

  get(iri) {
    return this.httpService.baseHttp('get', iri);
  }

  getPlayer(id) {
    return this.httpService.baseHttp('get', '/user-clients/' + id);
  }
}
