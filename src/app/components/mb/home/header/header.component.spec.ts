import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMbComponent } from './header-mb.component';

describe('HeaderComponent', () => {
  let component: HeaderMbComponent;
  let fixture: ComponentFixture<HeaderMbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderMbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
