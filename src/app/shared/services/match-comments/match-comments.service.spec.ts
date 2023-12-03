/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MatchCommentsService } from './match-comments.service';

describe('Service: MatchComments', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchCommentsService]
    });
  });

  it('should ...', inject([MatchCommentsService], (service: MatchCommentsService) => {
    expect(service).toBeTruthy();
  }));
});
