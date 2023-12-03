import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonContent, IonInfiniteScroll } from '@ionic/angular';
import {  Subscription, timer } from 'rxjs';
import {  switchMap, tap } from 'rxjs/operators';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { MatchCommentsService } from 'src/app/shared/services/match-comments/match-comments.service';

import { getPrimaryColor } from 'src/utils/get-primary-color';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-match-comments',
  templateUrl: './match-comments.component.html',
  styleUrls: ['./match-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchCommentsComponent implements OnInit{
  @ViewChild(IonContent, { read: IonContent, static: false }) content: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @Input() matchId: string;
  @Input() matchName: string;
  @Input() userId: string;
  @Input() clubName: string;
  @Input() clubLogoUrl: string;


  comments: Array<any>;
  comment = "";
  avatarBgColor = 'lightGray';
  requestHasError = false;
  deleteCommentError: boolean;
  baseUrl: string = this.environmentService.getEnvFile().domainAPI;
  isLoadingOlderMessages = false;
  commentsSub$: Subscription;


  constructor(
    private matchCommentsService: MatchCommentsService,
    private loaderService: LoaderService,
    private modalCtrl: ModalController,
    public sanitizer: DomSanitizer,
    private zone: NgZone,
    private ref: ChangeDetectorRef,
    private environmentService: EnvironmentService
  ) {
    this.avatarBgColor = getPrimaryColor();
  }



  ngOnInit() {
    this.matchCommentsService.getMatchComments(this.matchId).pipe(
      tap(_ => this.handleInfiniteComments())
    ).subscribe();
  }

  handleInfiniteComments() {
    this.commentsSub$ = this.matchCommentsService.matchComments$.pipe(
      tap(comments => {
        this.infiniteScroll.complete();
        if (!this.matchCommentsService.hasNext) {
          this.infiniteScroll.disabled = true;
        } else {
          this.infiniteScroll.disabled = false;
        }
        this.comments = comments.slice().reverse();
        this.ref.markForCheck();
        if (!this.isLoadingOlderMessages) {
          this.scrollToBottom();
        }
      })
    )
      .subscribe();
  }



  scrollToBottom() {
    this.zone.run(() => {
      setTimeout(() => {
        this.content.scrollToBottom(400);
      }, 500);
    });

  }


  loadOlderMessages() {
    if (this.matchCommentsService.hasNext) {
      this.isLoadingOlderMessages = true;
      this.matchCommentsService.getNextPageComments().pipe(
        tap(_ => this.isLoadingOlderMessages = false)
      )
        .subscribe();
    }
  }

  postComment() {
    let data;
    if (this.comment.length) {
      data = {
        match: `/clubs/matches/${this.matchId}`,
        text: this.comment
      };
      this.loaderService.presentLoading();
      this.matchCommentsService.postComment(data)
        .pipe(
          tap( resp => {
            if (resp !== undefined) {
              this.requestHasError = false;
            } else {
              this.requestHasError = true;
            }
            this.comment = "";
          }),
          switchMap( () => {
            return timer(1000)
              .pipe(
                switchMap( _ => {
                  return this.matchCommentsService.getMatchComments(this.matchId);
                })
              );
          })
        )
        .subscribe( _ => {
          this.loaderService.dismiss();
        });
    } else {
      return;
    }
  }

  deleteComment(comment, index) {
    if (comment.user.id === this.userId) {
      this.loaderService.presentLoading();
      this.matchCommentsService.deleteComment(comment.id)
        .pipe(
          tap( resp => {
            if (resp !== undefined) {
              this.deleteCommentError = false;
              this.comments.splice(index, 1);
            } else {
              this.deleteCommentError = true;
            }
            this.ref.markForCheck();
          })
        )
        .subscribe( _ => {
          this.loaderService.dismiss();
        });
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
  ngOnDestroy() {
    if (this.commentsSub$) {

      this.commentsSub$.unsubscribe();
    }
  }}
