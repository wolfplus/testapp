/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MatchJoinComponent } from './match-join.component';

describe('MatchJoinComponent', () => {
  let component: MatchJoinComponent;
  let fixture: ComponentFixture<MatchJoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchJoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
