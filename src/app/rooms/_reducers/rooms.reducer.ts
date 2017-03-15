/**
 * Module for handling rooms state logic
 */
import { createSelector } from 'reselect';

import { Room } from '../_models/room.model';
import * as roomsActions from '../_actions/rooms.actions';

export interface State {
  byId: {[id: string]: Room};
  available: string[];
  joined: string[];
  flags: {
    isCreating: boolean;
    isJoining: boolean;
    isLeaving: boolean;
    isLoading: boolean;
  };
}

export const initialState: State = {
  byId: {},
  available: [],
  joined: [],
  flags: {
    isCreating: false,
    isJoining: false,
    isLeaving: false,
    isLoading: false,
  },
};

export function reducer(state: State = initialState, action: roomsActions.Actions): State {
  switch (action.type) {

    case roomsActions.ActionTypes.CREATE_ROOM: {
      return {
        ...state,
        flags: {
          ...state.flags,
          isCreating: true,
        },
      };
    }

    case roomsActions.ActionTypes.CREATE_ROOM_SUCCESS: {
      const room = <Room>action.payload;

      room.id = room.id.toString();

      return {
        ...state,
        byId: {
          ...state.byId,
          [room.id]: room,
        },
        available: [...state.available, room.id],
        flags: {
          ...state.flags,
          isCreating: false,
        },
      };
    }

    case roomsActions.ActionTypes.DELETE_ROOM: {
      // TODO maybe add some removing flag to a room
      return state;
    }

    case roomsActions.ActionTypes.DELETE_ROOM_SUCCESS: {
      const room = <Room>action.payload;

      room.id = room.id.toString();

      const newById = {...state.byId};
      delete newById[room.id];

      return {
        ...state,
        byId: newById,
        available: state.available.filter(availableRoomId => availableRoomId !== room.id),
        joined: state.joined.filter(joinedRoomId => joinedRoomId !== room.id),
      };
    }

    case roomsActions.ActionTypes.GET_ROOMS: {
      return {
        ...state,
        flags: {
          ...state.flags,
          isLoading: true,
        },
      };
    }

    case roomsActions.ActionTypes.GET_ROOMS_SUCCESS: {
      const rooms: Room[] = action.payload;

      const available = [];
      const byId = {};

      rooms.forEach(room => {
        // If room wasn't already added
        if (state.available.indexOf(room.id.toString()) === -1) {
          // room.createdAt = new Date(room.createdAt * 1e3); TODO inflate `createdAt` field from `createdTs`
          byId[room.id] = room;
          available.push(room.id.toString());
        }
      });

      return {
        ...state,
        byId: {
          ...state.byId,
          ...byId,
        },
        available: [...state.available, ...available],
        flags: {
          ...state.flags,
          isLoading: false,
        },
      };
    }

    case roomsActions.ActionTypes.JOIN_ROOM: {
      return {
        ...state,
        flags: {
          ...state.flags,
          isJoining: true,
        },
      };
    }

    case roomsActions.ActionTypes.JOIN_ROOM_SUCCESS: {
      const room = <Room>action.payload;

      return {
        ...state,
        joined: [...state.joined, room.id],
        flags: {
          ...state.flags,
          isJoining: false,
        },
      };
    }

    case roomsActions.ActionTypes.LEAVE_ROOM_SUCCESS: {
      const room = <Room>action.payload;

      return {
        ...state,
        joined: state.joined.filter(roomId => roomId !== room.id),
      };
    }

    default: {
      return state;
    }
  }
}

// Selectors

export const getRooms = (state: any) => state.rooms || {}; // TODO

export const getAvailableRooms = createSelector(getRooms, (state: State) => {
  return state.available.reduce((rooms, roomId) => {
    if (state.byId[roomId]) {
      rooms.push(state.byId[roomId]);
    }

    return rooms;
  }, []);
});

export const getJoinedRooms = createSelector(getRooms, (state: State) => {
  return (state.joined || []).reduce((rooms, roomId) => {
    if (state.byId[roomId]) {
      rooms.push(state.byId[roomId]);
    }

    return rooms;
  }, []);
});

export const getJoinedRoomsIds = createSelector(getRooms, (state: State) => {
  return state.joined || [];
});

export const getRoomsFlags = createSelector(getRooms, (state: State) => state.flags || {});
