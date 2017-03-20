import { createSelector } from 'reselect';

import * as broadcastActions from '../_actions/_broadcast.actions';
import * as systemActions from '../_actions/system.actions';
import { CONNECTION_STATE } from '../_enums/connection-states.enum';

export interface State {
  connection: {
    state: CONNECTION_STATE;
    online: boolean;
  };
}

export const initialState: State = {
  connection: {
    state: CONNECTION_STATE.Disconnected,
    online: true,
  },
};

export function reducer(state = initialState, action: systemActions.Actions): State {
  switch (action.type) {

    case systemActions.ActionTypes.SET_CONNECTION_STATE: {
      const connectionState: CONNECTION_STATE = <CONNECTION_STATE>action.payload;

      return {
        ...state,
        connection: {
          ...state.connection,
          state: connectionState,
        },
      };
    }

    case systemActions.ActionTypes.SET_ONLINE_STATE: {
      const onlineState: boolean = <boolean>action.payload;

      return {
        ...state,
        connection: {
          ...state.connection,
          online: onlineState,
          state: !onlineState ? CONNECTION_STATE.Disconnected : state.connection.state,
        },
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

export const getSystemState = (state: any) => state.system; // TODO

export const getConnectionState = createSelector(getSystemState, (state: State) => {
  return state.connection;
});
