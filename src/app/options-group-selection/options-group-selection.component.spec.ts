import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsGroupSelectionComponent } from './options-group-selection.component';

describe('OptionsGroupSelectionComponent', () => {
  let component: OptionsGroupSelectionComponent;
  let fixture: ComponentFixture<OptionsGroupSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionsGroupSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsGroupSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
