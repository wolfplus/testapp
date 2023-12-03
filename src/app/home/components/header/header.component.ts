import { Component, Input } from '@angular/core';
import { SearchType } from 'src/app/shared/enums/search-type';
import {UserTokenService} from '../../../shared/services/storage/user-token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // The appSection is of type SearchType( HOME, CLUB, MATCH) to update text and parameter for the search button
  @Input() appSection: SearchType;
  showUserAction: boolean;
  SearchType = SearchType;
  constructor(
      private userToken: UserTokenService
  ) {
    this.showUserAction = false;
    this.userToken.getToken().then(token => {
      if (token) {
        this.showUserAction = true;
      }
    });
  }
}
