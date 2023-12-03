import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomModalComponent } from './bottom-modal.component';

describe('BottomModalComponent', () => {
  let component: BottomModalComponent;
  let fixture: ComponentFixture<BottomModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
