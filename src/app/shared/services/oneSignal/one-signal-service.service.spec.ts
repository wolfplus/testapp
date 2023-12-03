import { TestBed } from '@angular/core/testing';

import { OneSignalServiceService } from './one-signal-service.service';

describe('OneSignalServiceService', () => {
  let service: OneSignalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OneSignalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
