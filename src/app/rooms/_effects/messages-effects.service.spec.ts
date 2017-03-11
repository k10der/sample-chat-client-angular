import { TestBed, inject } from '@angular/core/testing';

import { MessagesEffectsService } from './messages-effects.service';

describe('MessagesEffectsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessagesEffectsService]
    });
  });

  it('should ...', inject([MessagesEffectsService], (service: MessagesEffectsService) => {
    expect(service).toBeTruthy();
  }));
});
