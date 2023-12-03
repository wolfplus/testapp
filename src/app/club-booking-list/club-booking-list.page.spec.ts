import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClubBookingListPage } from './club-booking-list.page';

describe('ClubBookingListPage', () => {
  let component: ClubBookingListPage;
  let fixture: ComponentFixture<ClubBookingListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubBookingListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClubBookingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
