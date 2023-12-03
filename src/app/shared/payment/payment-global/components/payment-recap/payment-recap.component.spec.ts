import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRecapComponent } from './payment-recap.component';

describe('PaymentRecapComponent', () => {
  let component: PaymentRecapComponent;
  let fixture: ComponentFixture<PaymentRecapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentRecapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
