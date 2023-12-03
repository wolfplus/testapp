import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoicesDurationComponent } from './choices-duration.component';

describe('ChoicesDurationComponent', () => {
  let component: ChoicesDurationComponent;
  let fixture: ComponentFixture<ChoicesDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoicesDurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoicesDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
