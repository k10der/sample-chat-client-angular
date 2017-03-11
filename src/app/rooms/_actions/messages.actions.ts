// Actions for messages
import { Action } from '@ngrx/store';

import { type } from '../../util';
import { Message } from '../_models/message.model';
import { Room } from '../_models/room.model';

export const ActionTypes = {
  ADD_MESSAGE: type('[Messages] Add'),
  DELETE_ROOM_MESSAGES: type('[Messages] Delete room messages'),
  GET_MESSAGES: type('[Messages] Get'),
  GET_MESSAGES_SUCCESS: type('[Messages] Get success'),
  GET_MESSAGES_FAILURE: type('[Messages] Get failure'),
  SEND_MESSAGE: type('[Messages] Send'),
  SEND_MESSAGE_SUCCESS: type('[Messages] Send success'),
  SEND_MESSAGE_FAILURE: type('[Messages] Send failure'),
};

export class AddMessageAction implements Action {
  type: string = ActionTypes.ADD_MESSAGE;

  constructor(public payload: {room: Room, message: Message}) {
  }
}

export class DeleteRoomMessagesAction implements Action {
  type: string = ActionTypes.DELETE_ROOM_MESSAGES;

  constructor(public payload: Room) {
  }
}

export class GetMessagesAction implements Action {
  type: string = ActionTypes.GET_MESSAGES;
  // TODO add pagination
  constructor(public payload: any) {
  }
}

export class GetMessagesSuccessAction implements Action {
  type: string = ActionTypes.GET_MESSAGES_SUCCESS;

  constructor(public payload: {room: Room, messages: Message[]}) {
  }
}

export class GetMessagesFailureAction implements Action {
  type: string = ActionTypes.GET_MESSAGES_FAILURE;

  constructor(public payload: Message) {
  }
}

export class SendMessageAction implements Action {
  type: string = ActionTypes.SEND_MESSAGE;

  constructor(public payload: {roomId: string, message: Message}) {
  }
}

export class SendMessageSuccessAction implements Action {
  type: string = ActionTypes.SEND_MESSAGE_SUCCESS;

  constructor(public payload: {roomId: string, message: Message}) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = AddMessageAction
  | DeleteRoomMessagesAction
  | GetMessagesAction
  | GetMessagesSuccessAction
  | GetMessagesFailureAction
  | SendMessageAction
  | SendMessageSuccessAction;
