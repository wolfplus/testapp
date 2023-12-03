import {AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalController, IonContent, IonInfiniteScroll} from '@ionic/angular';
import { slideInSlideOut } from 'src/app/animations';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import {switchMap, tap} from "rxjs/operators";
import {Subscription, timer} from "rxjs";
import {getPrimaryColor} from "../../../../utils/get-primary-color";
import {CourseCommentsService} from "../../../shared/services/course-comments/course-comments.service";
import * as moment from 'moment';


@Component({
    selector: 'app-class-comments',
    templateUrl: './class-comments-modal.component.html',
    styleUrls: ['./class-comments-modal.component.scss'],
    animations: [
        slideInSlideOut
    ]
})
export class ClassCommentsModalComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(IonContent, { read: IonContent, static: false }) content: IonContent;
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    @Input() courseId: string;
    @Input() courseName: string;
    @Input() userId: string;
    @Input() club: any;
    @Input() clubLogoUrl: string;

    comments: Array<any>;
    showInfiniteScroll = false;
    comment = "";
    avatarBgColor = 'lightGray';
    requestHasError = false;
    deleteCommentError: boolean;
    baseUrl: string = this.environmentService.getEnvFile().domainAPI;
    isLoadingOlderMessages = false;
    commentsSub$: Subscription;


    constructor(
        private courseCommentsService: CourseCommentsService,
        private loaderService: LoaderService,
        private modalCtrl: ModalController,
        public sanitizer: DomSanitizer,
        private zone: NgZone,
        private ref: ChangeDetectorRef,
        private environmentService: EnvironmentService
    ) {
        this.avatarBgColor = getPrimaryColor();
    }

    ngAfterViewInit(): void {
        this.courseCommentsService.getCourseComments(this.courseId).pipe(
            tap(_ => {
                this.scrollToBottom();
                this.showInfiniteScroll = true;
                this.handleInfiniteComments();
            })
        ).subscribe();
    }

    ngOnInit() {
        this.courseCommentsService.getCourseComments(this.courseId).pipe(
            tap(_ => {
                this.scrollToBottom();
                this.showInfiniteScroll = true;
                this.handleInfiniteComments();
            })
        ).subscribe();
    }

    handleInfiniteComments() {
        this.commentsSub$ = this.courseCommentsService.courseComments$.pipe(
            tap(comments => {
                this.infiniteScroll.complete();
                if (!this.courseCommentsService.hasNext) {
                    this.infiniteScroll.disabled = true;
                } else {
                    this.infiniteScroll.disabled = false;
                }
                this.comments = comments.slice().reverse();
                this.comments.map(com => {
                    com.createdAt = moment(com.createdAt).tz(this.club.timezone);
                });
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
        if (this.courseCommentsService.hasNext) {
            this.isLoadingOlderMessages = true;
            this.courseCommentsService.getNextPageComments().pipe(
                tap(_ => this.isLoadingOlderMessages = false)
            )
                .subscribe();
        }
    }

    postComment() {
        let data;
        if (this.comment.length) {
            data = {
                booking: `/clubs/bookings/${this.courseId}`,
                text: this.comment
            };
            this.loaderService.presentLoading();
            this.courseCommentsService.postComment(data)
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
                                    return this.courseCommentsService.getCourseComments(this.courseId);
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
            this.courseCommentsService.deleteComment(comment.id)
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
    }
}
