import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyClubsComponent } from './my-clubs.component';

describe('MyClubsComponent', () => {
  let component: MyClubsComponent;
  let fixture: ComponentFixture<MyClubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyClubsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyClubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
