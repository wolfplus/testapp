import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { retry, share, tap } from 'rxjs/operators';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class CourseCommentsService {
  courseCommentsSub$ = new BehaviorSubject<any[]>([]);
  courseComments$ = this.courseCommentsSub$.asObservable();
  numberOfCommentsSub$ = new BehaviorSubject<number>(0);
  numberOfComments$ = this.numberOfCommentsSub$.asObservable();

  hasNext = false;
  commentRequestHasError = false;
  nextPage: any;
  // hasNextSub$ = new BehaviorSubject<boolean>(false);
  // hasNext$ = this.hasNextSub$.asObservable();

  constructor(
    private httpService: HttpService
  ) { }

  getCourseComments(matchId): Observable<any[]> {
    /* TODO:  Add comment type */
    return this.httpService.baseHttp<any>('get', `/clubs/bookings/${matchId}/comments?order[createdAt]=DESC&itemsPerPage=10`, {}, true)
      .pipe(
        share(),
        tap( data => {
          if (data !== undefined && data['hydra:view']) {
            if (data['hydra:view']['hydra:next']) {
              this.hasNext = true;
              this.nextPage = data['hydra:view']['hydra:next'];
            } else {
              this.hasNext = false;
            }
          }
          if (data !== undefined && data['hydra:member'] !== this.courseCommentsSub$.getValue()) {
            this.commentRequestHasError = false;
            this.courseCommentsSub$.next(data['hydra:member']);
          } else if (data['hydra:member'] === this.courseCommentsSub$.getValue()) {
            throw 0;
          } else {
            this.commentRequestHasError = true;
            this.courseCommentsSub$.next([]);
            throw 0;
          }
        }),
        retry(2)
      );
  }

  getNextPageComments() {
    return this.httpService.baseHttp('get', this.nextPage, {}, true)
      .pipe(
        tap( data => {
          if (data !== undefined && data['hydra:view']) {
            if (data['hydra:view']['hydra:next']) {
              this.hasNext = true;
              this.nextPage = data['hydra:view']['hydra:next'];
            } else {
              this.hasNext = false;
            }
          }
          if (data !== undefined) {
            this.commentRequestHasError = false;
            this.courseCommentsSub$.next([...this.courseCommentsSub$.getValue(), ...data['hydra:member']]);
          } else {
            this.commentRequestHasError = true;
            throw 0;
          }
        })
      );
  }

  postComment(commentData): Observable<any> {
    /* TODO:  Add comment type */
    return this.httpService.baseHttp('post', `/clubs/bookings/comments`, commentData, true);
  }

  deleteComment(commentId) {
    return this.httpService.baseHttp('delete', `/clubs/bookings/comments/${commentId}`);
  }

}
