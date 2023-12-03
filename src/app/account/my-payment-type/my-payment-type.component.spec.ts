import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPaymentTypeComponent } from './my-payment-type.component';

describe('MyPaymentTypeComponent', () => {
  let component: MyPaymentTypeComponent;
  let fixture: ComponentFixture<MyPaymentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPaymentTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPaymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
