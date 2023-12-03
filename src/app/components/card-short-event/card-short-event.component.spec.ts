import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardShortEventComponent } from './card-short-event.component';

describe('CardShortEventComponent', () => {
  let component: CardShortEventComponent;
  let fixture: ComponentFixture<CardShortEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardShortEventComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardShortEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
