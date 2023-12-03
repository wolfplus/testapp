import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-club-reviews',
  templateUrl: './club-reviews.component.html',
  styleUrls: ['./club-reviews.component.scss']
})
export class ClubReviewsComponent implements OnInit {
  title = "Avis";
  reviews: Array<any>;
  averageRating: number;

  constructor() { }

  ngOnInit() {
    this.reviews = [
      {
        id: "vvfffearoiklk",
        author: "Nicolas C.",
        date: "27/02/20",
        rating: 4,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum odit suscipit ut nobis commodi illo eos corporis incidunt asperiores sed vero vel cumque earum, necessitatibus debitis minima fuga. Nostrum, pariatur?"
      },
      {
        id: "vvfffearoiklk",
        author: "Nicolas C.",
        date: "27/02/20",
        rating: 3,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum odit suscipit ut nobis commodi illo eos corporis incidunt asperiores sed vero vel cumque earum, necessitatibus debitis minima fuga. Nostrum, pariatur?"
      },
      {
        id: "vvfffearoiklk",
        author: "Nicolas C.",
        date: "27/02/20",
        rating: 5,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum odit suscipit ut nobis commodi illo eos corporis incidunt asperiores sed vero vel cumque earum, necessitatibus debitis minima fuga. Nostrum, pariatur?"
      }
    ];

    const totalOfRatings = this.reviews.reduce( (acc, curr) => {
      return acc + curr.rating ;
    }, 0);

    this.averageRating = totalOfRatings / this.reviews.length;
  }

}
