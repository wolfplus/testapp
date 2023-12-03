import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMethodComponent } from './manage-method.component';

describe('ManageMethodComponent', () => {
  let component: ManageMethodComponent;
  let fixture: ComponentFixture<ManageMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
