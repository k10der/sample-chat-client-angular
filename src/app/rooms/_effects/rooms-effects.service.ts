import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';

import * as messagesActions from '../_actions/messages.actions';
import * as roomsActions from '../_actions/rooms.actions';
import * as roomsUsersActions from '../_actions/room-users.actions';
import { RoomsService } from '../rooms.service';
import { Room } from '../_models/room.model';

@Injectable()
export class RoomsEffectsService {
  @Effect()
  createRoom$: Observable<Action> =
    this.actions$.ofType(roomsActions.ActionTypes.CREATE_ROOM)
      .map(toPayload)
      .switchMap((room: Room) => this.roomsService.createRoom(room.title))
      .map((room: Room) => new roomsActions.CreateRoomSuccessAction(room));

  @Effect()
  deleteRoom$: Observable<Action> =
    this.actions$.ofType(roomsActions.ActionTypes.DELETE_ROOM)
      .map(toPayload)
      .switchMap((room: Room) => this.roomsService.deleteRoom(room))
      .switchMap((room: Room) => {
        return Observable.from([
          new roomsActions.DeleteRoomSuccessAction(room),
          new messagesActions.DeleteRoomMessagesAction(room),
        ]);
      });

  @Effect()
  createRoomSuccess$: Observable<Action> =
    this.actions$.ofType(roomsActions.ActionTypes.CREATE_ROOM_SUCCESS)
      .map(toPayload)
      .map((room: Room) => new roomsActions.JoinRoomAction(room.id));

  @Effect()
  getRooms$: Observable<Action> =
    this.actions$.ofType(roomsActions.ActionTypes.GET_ROOMS)
      .map(toPayload)
      .switchMap(() => this.roomsService.getRooms())
      .map((rooms: Room[]) => new roomsActions.GetRoomsSuccessAction(rooms));

  @Effect()
  joinRoom$: Observable<Action> =
    this.actions$.ofType(roomsActions.ActionTypes.JOIN_ROOM)
      .map(toPayload)
      .switchMap((roomId: string) => {
        return this.roomsService.joinRoom(roomId)
          .switchMap((room: Room) => {
            return Observable.from([
              new roomsActions.JoinRoomSuccessAction(room),
              new messagesActions.GetMessagesAction({roomId: room.id}),
              new roomsUsersActions.GetRoomUsersAction(room.id),
            ]);
          });
      });

  @Effect({dispatch: false})
  joinRoomSuccess$: Observable<Room> =
    this.actions$.ofType(roomsActions.ActionTypes.JOIN_ROOM_SUCCESS)
      .map(toPayload);

  @Effect()
  leaveRoom$: Observable<Action> =
    this.actions$.ofType(roomsActions.ActionTypes.LEAVE_ROOM)
      .map(toPayload)
      .switchMap((roomId: string) => {
        return this.roomsService.leaveRoom(roomId)
          .switchMap(({room}:{room: Room}) => {
            return Observable.from([
              new messagesActions.DeleteRoomMessagesAction(room),
              new roomsActions.LeaveRoomSuccessAction(room),
            ]);
          });
      });

  constructor(private actions$: Actions,
              private roomsService: RoomsService) {
  }
}
