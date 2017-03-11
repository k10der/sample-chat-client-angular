import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendConnectionService } from './backend-connection.service';
import { Room } from '../rooms/_models/room.model';
import { User } from './_models/user.model';

@Injectable()
export class UsersService {

  constructor(private backendConnection: BackendConnectionService) {
  }

  /**
   * Get users from the room
   *
   * @param {string} roomId - Required room id
   */
  getRoomUsers(roomId: string): Observable<{room: Room, users: User[]}> {
    return this.backendConnection
      .withAck
      .emit('get_room_users', {
        room: {
          id: roomId,
        },
      })
      .map(res => {
        // If an error has occurred
        if (res.error) {
          // Throwing an error
          throw res.error;
        }

        return res.data;
      });
  }
}
