import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationClubComponent } from './information-club.component';

describe('InformationClubComponent', () => {
  let component: InformationClubComponent;
  let fixture: ComponentFixture<InformationClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationClubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
