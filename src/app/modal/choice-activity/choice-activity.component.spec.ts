import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceActivityComponent } from './choice-activity.component';

describe('ChoiceActivityComponent', () => {
  let component: ChoiceActivityComponent;
  let fixture: ComponentFixture<ChoiceActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoiceActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoiceActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
