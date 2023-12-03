import { TestBed } from '@angular/core/testing';

import { ManagePaymentService } from './manage-payment.service';

describe('ManagePaymentService', () => {
  let service: ManagePaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagePaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
