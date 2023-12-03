import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoicesActivitiesComponent } from './choices-activities.component';

describe('ChoicesActivitiesComponent', () => {
  let component: ChoicesActivitiesComponent;
  let fixture: ComponentFixture<ChoicesActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoicesActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoicesActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
