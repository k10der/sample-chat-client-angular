// Actions for users
import { Action } from '@ngrx/store';

import { type } from '../../util';
import { User } from '../_models/user.model';

export const ActionTypes = {
  GET_USERS: type('[Users] Get'),
  GET_USERS_SUCCESS: type('[Users] Get success'),
  GET_USERS_FAILURE: type('[Users] Get failure'),
};

export class GetUsersAction implements Action {
  type: string = ActionTypes.GET_USERS;
  // TODO add pagination
  constructor(public payload: any) {
  }
}

export class GetUsersSuccessAction implements Action {
  type: string = ActionTypes.GET_USERS_SUCCESS;

  constructor(public payload: {users: User[]}) {
  }
}

export class GetUsersFailureAction implements Action {
  type: string = ActionTypes.GET_USERS_FAILURE;

  constructor(public payload: User) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = GetUsersAction
  | GetUsersSuccessAction
  | GetUsersFailureAction;
