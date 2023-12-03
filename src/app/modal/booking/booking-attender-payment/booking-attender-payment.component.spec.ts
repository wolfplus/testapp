import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAttenderPaymentComponent } from './booking-attender-payment.component';

describe('BookingAttenderPaymentComponent', () => {
  let component: BookingAttenderPaymentComponent;
  let fixture: ComponentFixture<BookingAttenderPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingAttenderPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAttenderPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
