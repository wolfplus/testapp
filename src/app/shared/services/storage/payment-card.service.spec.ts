import { TestBed } from '@angular/core/testing';

import { PaymentCardService } from './payment-card.service';

describe('PaymentMethodService', () => {
  let service: PaymentCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
