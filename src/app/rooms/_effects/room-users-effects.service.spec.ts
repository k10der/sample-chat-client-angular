import { TestBed, inject } from '@angular/core/testing';

import { RoomUsersEffectsService } from './room-users-effects.service';

describe('RoomUsersEffectsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomUsersEffectsService]
    });
  });

  it('should ...', inject([RoomUsersEffectsService], (service: RoomUsersEffectsService) => {
    expect(service).toBeTruthy();
  }));
});
