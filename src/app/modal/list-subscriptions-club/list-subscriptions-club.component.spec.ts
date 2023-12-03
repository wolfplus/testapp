import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubscriptionsClubComponent } from './list-subscriptions-club.component';

describe('ListSubscriptionsClubComponent', () => {
  let component: ListSubscriptionsClubComponent;
  let fixture: ComponentFixture<ListSubscriptionsClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSubscriptionsClubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubscriptionsClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
