/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClubNewsService } from './club-news.service';

describe('Service: ClubNews', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClubNewsService]
    });
  });

  it('should ...', inject([ClubNewsService], (service: ClubNewsService) => {
    expect(service).toBeTruthy();
  }));
});
