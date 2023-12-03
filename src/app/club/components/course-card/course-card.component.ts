import { Component, Input } from '@angular/core';
import { ClubCourse } from '../../models/club-course';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent {
  @Input() course: ClubCourse;
  levelsColors = [
      {
        text: 'inherit',
        border: '#EAEBEF',
      },
      {
        text: '#7FECDF',
        border: '#7FECDF',
      },
      {
        text: '#F8DC35',
        border: '#F8DC35',
      }
  ];

}
