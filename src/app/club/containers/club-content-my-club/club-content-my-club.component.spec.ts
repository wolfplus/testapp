/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClubContentMyClubComponent } from './club-content-my-club.component';

describe('ClubContentMyClubComponent', () => {
  let component: ClubContentMyClubComponent;
  let fixture: ComponentFixture<ClubContentMyClubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubContentMyClubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubContentMyClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
