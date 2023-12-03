import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardClubComponent } from './card-club.component';

describe('CardClubComponent', () => {
  let component: CardClubComponent;
  let fixture: ComponentFixture<CardClubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardClubComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
