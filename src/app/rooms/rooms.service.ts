import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { BackendConnectionService } from '../core/backend-connection.service';
import { Room } from './_models/room.model';
import * as roomUsersActions from './_actions/room-users.actions';

@Injectable()
export class RoomsService {
  constructor(private backendConnection: BackendConnectionService, private store: Store<any>) {
    // TODO maybe move?
    this.backendConnection.listenTo('user_joined_room')
      .subscribe(res => {
        this.store.dispatch(new roomUsersActions.RoomUserJoinedAction(res.data));
      });

    this.backendConnection.listenTo('user_left_room')
      .subscribe(res => {
        this.store.dispatch(new roomUsersActions.RoomUserLeftAction(res.data));
      });
  }

  /**
   * Create a new room in the backend
   *
   * @param {string} title - New room's title
   * @return {Observable<Room>}
   */
  createRoom(title: string): Observable<Room> {
    return this.backendConnection
      .withAck
      .emit('create_room', {room: {title}})
      .map(res => {
        // If an error has occurred
        if (res.error) {
          // Throwing an error
          throw res.error;
        }

        return res.data.room;
      });
  }

  /**
   * Delete a room in the backend
   *
   * @param {Room} room - Room object
   * @return {Observable<Room>}
   */
  deleteRoom(room: Room): Observable<Room> {
    return this.backendConnection
      .withAck
      .emit('delete_room', {room})
      .map(res => {
        // If an error has occurred
        if (res.error) {
          // Throwing an error
          throw res.error;
        }

        return res.data.room;
      });
  }

  /**
   * Get all the available rooms
   *
   * @return {Observable<Room[]>}
   */
  getRooms(): Observable<Room[]> {
    return this.backendConnection
      .withAck
      .emit('get_rooms')
      .map(res => {
        // If an error has occurred
        if (res.error) {
          // Throwing an error
          throw res.error;
        }

        return res.data.rooms;
      });
  }

  /**
   * Join to a room with the specified id
   *
   * @param {string} roomId - Id of a room to be joined to
   * @return {Observable<Room>}
   */
  joinRoom(roomId: string): Observable<Room> {
    return this.backendConnection
      .withAck
      .emit('join_room', {room: {id: roomId}})
      .map(res => {
        // If an error has occurred
        if (res.error) {
          // Throwing an error
          throw res.error;
        }

        // Returning room object from the response
        return res.data.room;
      });
  }

  /**
   * Leave a room with the specified id TODO
   *
   * @param {string} roomId - Required room id
   */
  leaveRoom(roomId: string): Observable<any> {
    return this.backendConnection
      .withAck
      .emit('leave_room', {
        room: {
          id: roomId,
        },
      })
      .map(res => {
        // If an error has occurred
        if (res.error) {
          // TODO enable after angular router upgrade to ~4.*
          // Throwing an error
          // throw res.error;
        }

        return {room: res.data.room};
      });
  }
}
