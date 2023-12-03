/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClubReviewShortComponent } from './club-review-short.component';

describe('ClubReviewShortComponent', () => {
  let component: ClubReviewShortComponent;
  let fixture: ComponentFixture<ClubReviewShortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubReviewShortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubReviewShortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
