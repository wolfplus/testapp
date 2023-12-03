import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-club-review-short',
  templateUrl: './club-review-short.component.html',
  styleUrls: ['./club-review-short.component.scss']
})
export class ClubReviewShortComponent {
  @Input() star: number = 5;
  clubReviewsNumber: number = 20;

  createRange(num: number){
    if (num < 0) {
      num = 0;
    }
    return new Array(num).fill(0);
  }
}
