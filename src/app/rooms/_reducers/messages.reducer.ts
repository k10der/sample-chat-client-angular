import { createSelector } from 'reselect';

import { Message } from '../_models/message.model';
import * as broadcastActions from '../../core/_actions/_broadcast.actions';
import * as messagesActions from '../_actions/messages.actions';
import { Room } from '../_models/room.model';

export interface State {
  [roomId: string]: {
    firstId: string;
    lastId: string;
    entries: Message[];
    flags: {
      isLoading: boolean;
    };
  };
}

export const initialState: State = {};

export function reducer(state = initialState, action: messagesActions.Actions): State {
  switch (action.type) {

    case messagesActions.ActionTypes.ADD_MESSAGE: {
      const {room, message} = action.payload;

      // Getting state or creating a new one
      const newState = state[room.id] || {firstId: '', lastId: '', entries: [], flags: {isLoading: false}};

      return {
        ...state,
        [room.id]: {
          ...newState,
          firstId: !newState.firstId || message.id,
          lastId: message.id,
          entries: [...newState.entries, message],
        },
      };
    }


    case messagesActions.ActionTypes.DELETE_ROOM_MESSAGES: {
      const room = action.payload;

      // Getting state or creating a new one
      const newState = {...state};
      delete newState[room.id];

      return newState;
    }

    case messagesActions.ActionTypes.GET_MESSAGES: {
      // TODO
      const {roomId} = action.payload;

      // Getting state or creating a new one
      const newState = state[roomId] || {firstId: '', lastId: '', entries: [], flags: {isLoading: true}};

      return {
        ...state,
        [roomId]: {
          ...newState,
          flags: {
            ...newState.flags,
            isLoading: true,
          },
        },
      };
    }

    case messagesActions.ActionTypes.GET_MESSAGES_SUCCESS: {
      // TODO
      const {room, messages}: {room: Room, messages: Message[]} = action.payload;

      // Getting state or creating a new one
      const newState = state[room.id] || {firstId: '', lastId: '', entries: [], flags: {isLoading: false}};

      return {
        ...state,
        [room.id]: {
          ...newState,
          firstId: messages.length ? messages[0].id : null,
          lastId: messages.length ? messages[messages.length - 1].id : null,
          entries: [...messages, ...newState.entries],
          flags: {
            ...newState.flags,
            isLoading: false,
          },
        },
      };
    }

    case messagesActions.ActionTypes.SEND_MESSAGE: {
      // TODO
      const {roomId, message}: {roomId: string, message: Message} = action.payload;

      // Getting state or creating a new one
      const newState = state[roomId] || {firstId: '', lastId: '', entries: [], flags: {isLoading: false}};

      return {
        ...state,
        [roomId]: {
          ...newState,
          firstId: (newState.firstId && newState.firstId) || message.id,
          lastId: message.id,
          entries: [...newState.entries, message],
        }
      };
    }

    case messagesActions.ActionTypes.SEND_MESSAGE_SUCCESS: {
      // TODO
      const {roomId, message}: {roomId: string, message: Message} = action.payload;

      // Getting state or creating a new one
      const newState = state[roomId] || {firstId: '', lastId: '', entries: [], flags: {isLoading: false}};

      return {
        ...state,
        [roomId]: {
          ...newState,
          firstId: message.verificationToken === newState.firstId ? message.id : newState.firstId,
          lastId: message.verificationToken === newState.lastId ? message.id : newState.lastId,
          entries: newState.entries.map(entry => {
            if (entry.verificationToken === message.verificationToken) {
              delete message.verificationToken;
              return message;
            }

            return entry;
          }),
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

export const getMessages = (state: any) => state.messages; // TODO

export const getRoomMessages = (roomId: string) => createSelector(getMessages, (state: State) => {
  return state[roomId] ? state[roomId].entries : [];
});
