import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsReceiptComponent } from './tabs-account.component';

describe('TabsAccountComponent', () => {
  let component: TabsReceiptComponent;
  let fixture: ComponentFixture<TabsReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
