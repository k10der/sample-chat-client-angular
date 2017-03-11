// Actions for roomUsers
import { Action } from '@ngrx/store';

import { type } from '../../util';
import { User } from '../../core/_models/user.model';
import { Room } from '../_models/room.model';

export const ActionTypes = {
  GET_ROOM_USERS: type('[RoomUsers] Get'),
  GET_ROOM_USERS_SUCCESS: type('[RoomUsers] Get success'),
  GET_ROOM_USERS_FAILURE: type('[RoomUsers] Get failure'),
  ROOM_USER_JOINED: type('[RoomUsers] Joined'),
  ROOM_USER_LEFT: type('[RoomUsers] Left'),
};

export class GetRoomUsersAction implements Action {
  type: string = ActionTypes.GET_ROOM_USERS;
  // TODO add pagination
  constructor(public payload: any) {
  }
}

export class GetRoomUsersSuccessAction implements Action {
  type: string = ActionTypes.GET_ROOM_USERS_SUCCESS;

  constructor(public payload: {room: Room, users: User[]}) {
  }
}

export class GetRoomUsersFailureAction implements Action {
  type: string = ActionTypes.GET_ROOM_USERS_FAILURE;

  constructor(public payload: User) {
  }
}

export class RoomUserJoinedAction implements Action {
  type: string = ActionTypes.ROOM_USER_JOINED;

  constructor(public payload: {room: Room, user: User}) {
  }
}

export class RoomUserLeftAction implements Action {
  type: string = ActionTypes.ROOM_USER_LEFT;

  constructor(public payload:  {room: Room, user: User}) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = GetRoomUsersAction
  | GetRoomUsersSuccessAction
  | GetRoomUsersFailureAction
  | RoomUserJoinedAction
  | RoomUserLeftAction;
