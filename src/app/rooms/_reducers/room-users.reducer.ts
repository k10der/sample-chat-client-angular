import { createSelector } from 'reselect';

import * as roomUsersActions from '../_actions/room-users.actions';
import { Room } from '../_models/room.model';
import { User } from '../../core/_models/user.model';

export interface State {
  byRoomId: {
    [roomId: string]: {
      joined: string[],
      flags: {
        isLoading: boolean,
      },
    },
  },
  usersById: {
    [userId: string]: User,
  },
}

export const initialState: State = {
  byRoomId: {},
  usersById: {},
};

export function reducer(state = initialState, action: roomUsersActions.Actions): State {
  switch (action.type) {

    case roomUsersActions.ActionTypes.GET_ROOM_USERS: {
      // TODO
      let {roomId} = action.payload;
      if (!roomId) return state;

      // Getting state or creating a new one
      let joinedState = state.byRoomId[roomId] || {joined: [], flags: {isLoading: true}};

      return {
        ...state,
        byRoomId:{
          ...state.byRoomId,
          [roomId]: joinedState,
        },
      }
    }

    case roomUsersActions.ActionTypes.GET_ROOM_USERS_SUCCESS: {
      const {room, users}: {room: Room, users: User[]} = action.payload;
      if (!room || !room.id) return state;

      let joined: string[] = [];

      let usersById = {...state.usersById};
      users.forEach((user: User) => {
        if (!usersById[user.id]) {
          usersById[user.id] = user;
        }
        joined.push(user.id);
      });


      return {
        byRoomId: {
          ...state.byRoomId,
          [room.id]: {
            joined,
            flags: {
              isLoading: false,
            }
          }
        },
        usersById,
      }
    }

    case roomUsersActions.ActionTypes.ROOM_USER_JOINED: {
      const {room, user}: {room: Room, user: User} = action.payload;
      if (!room || !room.id || !state.byRoomId[room.id]) return state;

      const joined = [...state.byRoomId[room.id].joined, user.id];
      // TODO protect from non existent room
      return {
        byRoomId: {
          ...state.byRoomId,
          [room.id]: {
            ...state.byRoomId[room.id],
            joined,
          },
        },
        usersById: {
          ...state.usersById,
          [user.id]: user,
        },
      }
    }

    case roomUsersActions.ActionTypes.ROOM_USER_LEFT: {
      const {room, user}: {room: Room, user: User} = action.payload;
      if (!room || !room.id || !state.byRoomId[room.id]) return state;
      // TODO protect from non existent room

      const joined = state.byRoomId[room.id].joined.filter(userId => userId !== user.id);
      return {
        ...state,
        byRoomId: {
          ...state.byRoomId,
          [room.id]: {
            ...state.byRoomId[room.id],
            joined,
          },
        },
      }
    }

    default: {
      return state;
    }
  }
}

// Selectors

export const getRoomUsers = (state: any) => state.roomUsers; // TODO

export const getRoomUsersEntries = (roomId: string) => createSelector(getRoomUsers, (state: State) => {
  if (!state.byRoomId[roomId] || !state.byRoomId[roomId].joined) {
    return [];
  }

  return state.byRoomId[roomId].joined.map(userId => {
    return state.usersById[userId] ? state.usersById[userId] : {id: userId, username: 'N/A'};
  })
});
