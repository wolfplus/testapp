import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopGiftFormComponent } from './shop-gift-form.component';

describe('ShopGiftFormComponent', () => {
  let component: ShopGiftFormComponent;
  let fixture: ComponentFixture<ShopGiftFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopGiftFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopGiftFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
