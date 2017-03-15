import { createSelector } from 'reselect';

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

    default: {
      return state;
    }
  }
}

// Selectors

export const getMessages = (state: any) => state.messages; // TODO

export const getRoomMessages = (roomId: string) => createSelector(getMessages, (state: State) => {
  return state[roomId] ? state[roomId].entries : [];
});
