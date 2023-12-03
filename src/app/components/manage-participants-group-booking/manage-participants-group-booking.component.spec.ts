import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageParticipantsGroupBookingComponent } from './manage-participants-group-booking.component';

describe('ManageParticipantsGroupBookingComponent', () => {
  let component: ManageParticipantsGroupBookingComponent;
  let fixture: ComponentFixture<ManageParticipantsGroupBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageParticipantsGroupBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageParticipantsGroupBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
