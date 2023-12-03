import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitsComponent } from './invits.component';

describe('InvitsComponent', () => {
  let component: InvitsComponent;
  let fixture: ComponentFixture<InvitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
