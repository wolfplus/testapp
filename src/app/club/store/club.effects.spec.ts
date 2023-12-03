import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ClubEffects } from './club.effects';

describe('ClubEffects', () => {
  let actions$: Observable<any>;
  let effects: ClubEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClubEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(ClubEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
