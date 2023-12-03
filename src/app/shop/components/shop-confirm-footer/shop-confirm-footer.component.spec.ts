import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopConfirmFooterComponent } from './shop-confirm-footer.component';

describe('ShopConfirmFooterComponent', () => {
  let component: ShopConfirmFooterComponent;
  let fixture: ComponentFixture<ShopConfirmFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopConfirmFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopConfirmFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
