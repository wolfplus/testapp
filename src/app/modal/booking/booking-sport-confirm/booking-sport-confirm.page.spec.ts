import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookingSportConfirmPage } from './booking-sport-confirm.page';

describe('AccountPage', () => {
  let component: BookingSportConfirmPage;
  let fixture: ComponentFixture<BookingSportConfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingSportConfirmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingSportConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
