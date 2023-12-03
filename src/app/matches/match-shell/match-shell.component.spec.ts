/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MatchShellComponent } from './match-shell.component';

describe('MatchShellComponent', () => {
  let component: MatchShellComponent;
  let fixture: ComponentFixture<MatchShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
