import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardShortClubComponent } from './card-short-club.component';

describe('CardShortClubComponent', () => {
  let component: CardShortClubComponent;
  let fixture: ComponentFixture<CardShortClubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardShortClubComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardShortClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
