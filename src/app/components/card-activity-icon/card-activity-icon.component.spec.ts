import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardActivityIconComponent } from './card-activity-icon.component';

describe('CardActivityIconComponent', () => {
  let component: CardActivityIconComponent;
  let fixture: ComponentFixture<CardActivityIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardActivityIconComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardActivityIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
