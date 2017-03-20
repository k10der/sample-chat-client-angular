import { TestBed, inject } from '@angular/core/testing';

import { SystemEffectsService } from './system-effects.service';

describe('SystemEffectsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemEffectsService]
    });
  });

  it('should ...', inject([SystemEffectsService], (service: SystemEffectsService) => {
    expect(service).toBeTruthy();
  }));
});
