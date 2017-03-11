// Actions for rooms

import { Action } from '@ngrx/store';

import { type } from '../../util';
import { Room } from '../_models/room.model';

export const ActionTypes = {
  CREATE_ROOM: type('[Rooms] Create'),
  CREATE_ROOM_SUCCESS: type('[Rooms] Create success'),
  CREATE_ROOM_FAILURE: type('[Rooms] Create failure'),
  DELETE_ROOM: type('[Rooms] Delete'),
  DELETE_ROOM_SUCCESS: type('[Rooms] Delete success'),
  DELETE_ROOM_FAILURE: type('[Rooms] Delete failure'),
  GET_ROOMS: type('[Rooms] Get'),
  GET_ROOMS_SUCCESS: type('[Rooms] Get success'),
  GET_ROOMS_FAILURE: type('[Rooms] Get failure'),
  JOIN_ROOM: type('[Rooms] Join'),
  JOIN_ROOM_SUCCESS: type('[Rooms] Join success'),
  JOIN_ROOM_FAILURE: type('[Rooms] Join failure'),
  LEAVE_ROOM: type('[Rooms] Leave'),
  LEAVE_ROOM_SUCCESS: type('[Rooms] Leave success'),
  LEAVE_ROOM_FAILURE: type('[Rooms] Leave failure'),
};

export class CreateRoomAction implements Action {
  type: string = ActionTypes.CREATE_ROOM;

  constructor(public payload: Room) {
  }
}

export class CreateRoomSuccessAction implements Action {
  type: string = ActionTypes.CREATE_ROOM_SUCCESS;

  constructor(public payload: Room) {
  }
}

export class DeleteRoomAction implements Action {
  type: string = ActionTypes.DELETE_ROOM;

  constructor(public payload: Room) {
  }
}

export class DeleteRoomSuccessAction implements Action {
  type: string = ActionTypes.DELETE_ROOM_SUCCESS;

  constructor(public payload: Room) {
  }
}

export class GetRoomsAction implements Action {
  type: string = ActionTypes.GET_ROOMS;
  // TODO add pagination
  constructor(public payload: any) {
  }
}

export class GetRoomsSuccessAction implements Action {
  type: string = ActionTypes.GET_ROOMS_SUCCESS;

  constructor(public payload: Room[]) {
  }
}

export class GetRoomsFailureAction implements Action {
  type: string = ActionTypes.GET_ROOMS_FAILURE;

  constructor(public payload: Room) {
  }
}

export class JoinRoomAction implements Action {
  type: string = ActionTypes.JOIN_ROOM;

  constructor(public payload: string) {
  }
}

export class JoinRoomSuccessAction implements Action {
  type: string = ActionTypes.JOIN_ROOM_SUCCESS;

  constructor(public payload: Room) {
  }
}

export class LeaveRoomAction implements Action {
  type: string = ActionTypes.LEAVE_ROOM;

  constructor(public payload: string) {
  }
}

export class LeaveRoomSuccessAction implements Action {
  type: string = ActionTypes.LEAVE_ROOM_SUCCESS;

  constructor(public payload: Room) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = CreateRoomAction
  | CreateRoomSuccessAction
  | GetRoomsAction
  | GetRoomsSuccessAction
  | GetRoomsFailureAction
  | JoinRoomAction
  | JoinRoomSuccessAction
  | LeaveRoomAction
  | LeaveRoomSuccessAction;
