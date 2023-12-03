import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarClubComponent } from './nav-bar-club.component';

describe('NavBarClubComponent', () => {
  let component: NavBarClubComponent;
  let fixture: ComponentFixture<NavBarClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavBarClubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
