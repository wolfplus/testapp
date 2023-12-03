import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingJoinComponent } from './booking-join.component';

describe('BookingJoinComponent', () => {
  let component: BookingJoinComponent;
  let fixture: ComponentFixture<BookingJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingJoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
