import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardSlotDurationComponent } from './card-slot-duration.component';

describe('CardSlotDurationComponent', () => {
  let component: CardSlotDurationComponent;
  let fixture: ComponentFixture<CardSlotDurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSlotDurationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardSlotDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
