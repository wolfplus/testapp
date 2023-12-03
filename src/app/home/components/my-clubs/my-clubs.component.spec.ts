import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyClubsComponent } from './my-clubs.component';

describe('MyClubsComponent', () => {
  let component: MyClubsComponent;
  let fixture: ComponentFixture<MyClubsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyClubsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyClubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
