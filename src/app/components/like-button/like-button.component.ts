import { AfterViewInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ClubState } from 'src/app/club/store/club.reducers';
import {getCurrentMe} from "../../account/store";

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.scss']
})
export class LikeButtonComponent implements AfterViewInit {
  isApreferredClub = false;

  constructor(
    private clubStore: Store<ClubState>,
    private accountStore: Store<any>,
  ) { }

  ngAfterViewInit() {
      this.accountStore.select(getCurrentMe)
        .pipe(
          switchMap( (_resp: boolean) => {
            return forkJoin([
                this.clubStore.select('clubIsLoading')
            ]);
          }),
          map(res => res),
        )
        .subscribe( () => {});
  }

  likeItOrNot() {
    this.isApreferredClub = !this.isApreferredClub;
  }


}
