/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import {CourseCommentsService} from "./course-comments.service";

describe('Service: CourseComments', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseCommentsService]
    });
  });

  it('should ...', inject([CourseCommentsService], (service: CourseCommentsService) => {
    expect(service).toBeTruthy();
  }));
});
