import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingGroupPaymentComponent } from './booking-group-payment.component';

describe('BookingGroupPaymentComponent', () => {
  let component: BookingGroupPaymentComponent;
  let fixture: ComponentFixture<BookingGroupPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingGroupPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingGroupPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
