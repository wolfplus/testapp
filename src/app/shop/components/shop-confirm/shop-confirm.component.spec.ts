import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopConfirmComponent } from './shop-confirm.component';

describe('ShopConfirmComponent', () => {
  let component: ShopConfirmComponent;
  let fixture: ComponentFixture<ShopConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
