import { createSelector } from 'reselect';

import * as profileActions from '../_actions/profile.actions';
import { Profile } from '../_models/profile.model';

export interface State extends Profile {
}

export const initialState: Profile | {} = {};

export function reducer(state = initialState, action: profileActions.Actions): State | {} {
  switch (action.type) {

    case profileActions.ActionTypes.LOAD_PROFILE_DATA_SUCCESS: {
      const profileData: Profile = <Profile>action.payload;

      return {
        ...state,
        ...profileData,
      }
    }

    default: {
      return state;
    }
  }
}

// Selectors

export const getProfile = (state: any) => state.profile; // TODO
