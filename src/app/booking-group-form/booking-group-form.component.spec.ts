import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingGroupFormComponent } from './booking-goup-form.component';

describe('BookingGoupFormComponent', () => {
  let component: BookingGroupFormComponent;
  let fixture: ComponentFixture<BookingGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingGroupFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
