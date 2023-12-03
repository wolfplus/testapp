import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoicesPrestationsComponent } from './choices-prestations.component';

describe('ChoicesPrestationsComponent', () => {
  let component: ChoicesPrestationsComponent;
  let fixture: ComponentFixture<ChoicesPrestationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoicesPrestationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoicesPrestationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
