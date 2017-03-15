import { TestBed, inject } from '@angular/core/testing';

import { ProfileEffectsService } from './profile-effects.service';

describe('ProfileEffectsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileEffectsService]
    });
  });

  it('should ...', inject([ProfileEffectsService], (service: ProfileEffectsService) => {
    expect(service).toBeTruthy();
  }));
});
