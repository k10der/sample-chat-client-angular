// Actions for system
import { Action } from '@ngrx/store';

import { type } from '../../util';
import { Profile } from '../_models/profile.model';

export const ActionTypes = {
  LOAD_PROFILE_DATA: type('[Profile] Load data'),
  LOAD_PROFILE_DATA_SUCCESS: type('[Profile] Load data success'),
  LOAD_PROFILE_DATA_FAILURE: type('[Profile] Load data failure'),
  SET_AUTHENTICATION_STATE: type('[Profile] Set authentication state'),
  UPDATE_PROFILE_DATA: type('[Profile] Update data'),
  UPDATE_PROFILE_DATA_SUCCESS: type('[Profile] Update data success'),
  UPDATE_PROFILE_DATA_FAILURE: type('[Profile] Update data failure'),
};

export class LoadProfileDataAction implements Action {
  type: string = ActionTypes.LOAD_PROFILE_DATA;

  constructor(public payload?: any) {
  }
}

export class LoadProfileDataSuccessAction implements Action {
  type: string = ActionTypes.LOAD_PROFILE_DATA_SUCCESS;

  constructor(public payload: any) {
  }
}

export class SetAuthenticationStateAction implements Action {
  type: string = ActionTypes.SET_AUTHENTICATION_STATE;

  constructor(public payload: {isAuthenticated: boolean}) {
  }
}

export class UpdateProfileDataAction implements Action {
  type: string = ActionTypes.UPDATE_PROFILE_DATA;

  constructor(public payload: Profile) {
  }
}

export class UpdateProfileDataSuccessAction implements Action {
  type: string = ActionTypes.UPDATE_PROFILE_DATA_SUCCESS;

  constructor(public payload: Profile) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = LoadProfileDataAction
  | LoadProfileDataSuccessAction
  | SetAuthenticationStateAction
  | UpdateProfileDataAction
  | UpdateProfileDataSuccessAction;
