import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs';

import * as profileActions from '../_actions/profile.actions'
import { ProfileService } from '../profile.service';
import { Profile } from '../_models/profile.model';

@Injectable()
export class ProfileEffectsService {
  @Effect()
  loadProfileData$: Observable<Action> =
    this.actions$.ofType(profileActions.ActionTypes.LOAD_PROFILE_DATA)
      .switchMap(() => this.profileService.loadProfileData())
      .map((payload: Profile) => {
        return new profileActions.LoadProfileDataSuccessAction(payload);
      });

  constructor(private actions$: Actions, private profileService: ProfileService) {
  }
}
