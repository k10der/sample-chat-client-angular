// System-wide actions
import { Action } from '@ngrx/store';

import { type } from '../../util';
import { Profile } from '../_models/profile.model';

export const ActionTypes = {
  BROADCAST_LOGOUT: type('[Broadcast] Logout'),
};

export class BroadcastLogoutActionAction implements Action {
  type: string = ActionTypes.BROADCAST_LOGOUT;

  constructor(public payload?: any) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = BroadcastLogoutActionAction;
