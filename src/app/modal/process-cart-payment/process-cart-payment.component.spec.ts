import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessCartPaymentComponent } from './process-cart-payment.component';

describe('ProcessCartPaymentComponent', () => {
  let component: ProcessCartPaymentComponent;
  let fixture: ComponentFixture<ProcessCartPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessCartPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCartPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
