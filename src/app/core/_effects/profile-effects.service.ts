import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';

import * as profileActions from '../_actions/profile.actions';
import * as systemActions from '../_actions/system.actions';
import { ProfileService } from '../profile.service';
import { Profile } from '../_models/profile.model';

@Injectable()
export class ProfileEffectsService {
  @Effect()
  setIsAuthenticatedStatus$: Observable<Action> =
    this.actions$.ofType(profileActions.ActionTypes.SET_AUTHENTICATION_STATE)
      .map(toPayload)
      .map((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          return new profileActions.LoadProfileDataAction();
        }
      });

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
