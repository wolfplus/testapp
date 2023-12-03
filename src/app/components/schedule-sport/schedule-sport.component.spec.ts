import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSportComponent } from './schedule-sport.component';

describe('ScheduleSportComponent', () => {
  let component: ScheduleSportComponent;
  let fixture: ComponentFixture<ScheduleSportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleSportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
