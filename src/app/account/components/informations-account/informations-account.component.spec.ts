import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationsAccountComponent } from './informations-account.component';

describe('InformationsAccountComponent', () => {
  let component: InformationsAccountComponent;
  let fixture: ComponentFixture<InformationsAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationsAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationsAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
