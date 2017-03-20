// Actions for system
import { Action } from '@ngrx/store';

import { type } from '../../util';
import { CONNECTION_STATE } from '../_enums/connection-states.enum';

export const ActionTypes = {
  CONNECT: type('[System] Connect'),
  DISCONNECT: type('[System] Disconnect'),
  SET_CONNECTION_STATE: type('[System] Set connection state'),
  SET_ONLINE_STATE: type('[System] Set online state'),
};

export class ConnectAction implements Action {
  type: string = ActionTypes.CONNECT;

  constructor(public payload?: any) {
  }
}

export class DisconnectAction implements Action {
  type: string = ActionTypes.DISCONNECT;

  constructor(public payload: boolean) {
  }
}

export class SetConnectionStateAction implements Action {
  type: string = ActionTypes.SET_CONNECTION_STATE;

  constructor(public payload: CONNECTION_STATE) {
  }
}

export class SetOnlineStateAction implements Action {
  type: string = ActionTypes.SET_ONLINE_STATE;

  constructor(public payload: boolean) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = ConnectAction
  | DisconnectAction
  | SetConnectionStateAction
  | SetOnlineStateAction;
