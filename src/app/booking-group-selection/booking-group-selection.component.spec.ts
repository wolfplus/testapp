import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingGroupSelectionComponent } from './booking-group-selection.component';

describe('BookingGroupSelectionComponent', () => {
  let component: BookingGroupSelectionComponent;
  let fixture: ComponentFixture<BookingGroupSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingGroupSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingGroupSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
