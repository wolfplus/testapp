import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ClubCourse } from '../../models/club-course';
import { getCurrentClubCourses, getCurrentClubCoursesState } from '../../store';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-my-club-courses',
  templateUrl: './my-club-courses.component.html',
  styleUrls: ['./my-club-courses.component.css']
})
export class MyClubCoursesComponent implements OnInit, OnDestroy {
  // TODO: add translations
  title$: Observable<string> = this.translator.get("courses");
  courses: Array<ClubCourse>;
  coursesSubscription$: Subscription;
  coursesAreLoaded$: Observable<boolean> = of(false);
  
  constructor(
    private clubStore: Store<ClubState>,
    private translator: TranslateService
  ) { }

  ngOnInit() {
    this.coursesSubscription$ = this.clubStore.select(getCurrentClubCourses)
      .subscribe( courses => this.courses = courses);

    this.coursesAreLoaded$ = this.clubStore.pipe(
      // TODO: remove delay after test
      delay(4000),
      select(getCurrentClubCoursesState)
    );
  }

  ngOnDestroy(){
    this.coursesSubscription$.unsubscribe();
  }

}
