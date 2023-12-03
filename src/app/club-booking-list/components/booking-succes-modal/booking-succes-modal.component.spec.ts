import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSuccesModalComponent } from './booking-succes-modal.component';

describe('BookingSuccesModalComponent', () => {
  let component: BookingSuccesModalComponent;
  let fixture: ComponentFixture<BookingSuccesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingSuccesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingSuccesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
