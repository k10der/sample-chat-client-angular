import { TestBed, inject } from '@angular/core/testing';

import { RoomsEffectsService } from './rooms-effects.service';

describe('RoomsEffectsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomsEffectsService]
    });
  });

  it('should ...', inject([RoomsEffectsService], (service: RoomsEffectsService) => {
    expect(service).toBeTruthy();
  }));
});
