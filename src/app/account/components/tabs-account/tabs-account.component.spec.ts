import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsAccountComponent } from './tabs-account.component';

describe('TabsAccountComponent', () => {
  let component: TabsAccountComponent;
  let fixture: ComponentFixture<TabsAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
