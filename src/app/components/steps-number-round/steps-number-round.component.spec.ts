import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StepsNumberRoundComponent } from './steps-number-round.component';

describe('StepsNumberRoundComponent', () => {
  let component: StepsNumberRoundComponent;
  let fixture: ComponentFixture<StepsNumberRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepsNumberRoundComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StepsNumberRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
