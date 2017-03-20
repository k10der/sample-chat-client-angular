import { createSelector } from 'reselect';

import * as broadcastActions from '../_actions/_broadcast.actions';
import * as profileActions from '../_actions/profile.actions';
import { Profile } from '../_models/profile.model';

export interface State extends Profile {
  isAuthenticated: boolean;
}

export const initialState: State = {
  id: '',
  username: '',
  createdRooms: [],
  isAuthenticated: false,
};

export function reducer(state = initialState, action: profileActions.Actions): State | {} {
  switch (action.type) {

    case profileActions.ActionTypes.LOAD_PROFILE_DATA_SUCCESS: {
      const profileData: Profile = <Profile>action.payload;

      return {
        ...state,
        ...profileData,
      };
    }

    case profileActions.ActionTypes.SET_AUTHENTICATION_STATE: {
      const {isAuthenticated} = action.payload;

      return {
        ...state,
        isAuthenticated,
      };
    }

    /* System-wide actions handlers */

    case broadcastActions.ActionTypes.BROADCAST_LOGOUT: {
      return {...initialState};
    }

    default: {
      return state;
    }
  }
}

// Selectors

export const getProfile = (state: any) => state.profile; // TODO
