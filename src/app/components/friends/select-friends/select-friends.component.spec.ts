import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFriendsComponent } from './select-friends.component';

describe('SelectFriendsComponent', () => {
  let component: SelectFriendsComponent;
  let fixture: ComponentFixture<SelectFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectFriendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
