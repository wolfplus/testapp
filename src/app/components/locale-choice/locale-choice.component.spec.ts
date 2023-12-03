import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocaleChoiceComponent } from './locale-choice.component';

describe('LocaleChoiceComponent', () => {
  let component: LocaleChoiceComponent;
  let fixture: ComponentFixture<LocaleChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocaleChoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocaleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
