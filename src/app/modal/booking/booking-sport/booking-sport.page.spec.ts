import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookingSportPage } from './booking-sport.page';

describe('BookingSportPage', () => {
  let component: BookingSportPage;
  let fixture: ComponentFixture<BookingSportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingSportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingSportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
