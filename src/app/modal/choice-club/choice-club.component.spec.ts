import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceClubComponent } from './choice-club.component';

describe('ChoiceClubComponent', () => {
  let component: ChoiceClubComponent;
  let fixture: ComponentFixture<ChoiceClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoiceClubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoiceClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
