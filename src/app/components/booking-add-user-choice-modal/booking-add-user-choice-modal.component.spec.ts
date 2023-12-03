import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAddUserChoiceModalComponent } from './booking-add-user-choice-modal.component';

describe('BookingAddUserChoiceModalComponent', () => {
  let component: BookingAddUserChoiceModalComponent;
  let fixture: ComponentFixture<BookingAddUserChoiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingAddUserChoiceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAddUserChoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
