import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { UsersService } from '../../core/users.service';
import * as roomUsersActions from '../_actions/room-users.actions';

@Injectable()
export class RoomUsersEffectsService {
  @Effect()
  getRoomUsers$: Observable<Action> =
    this.actions$.ofType(roomUsersActions.ActionTypes.GET_ROOM_USERS)
      .map(toPayload)
      .switchMap((roomId: string) => {
        return this.usersService.getRoomUsers(roomId)
          .map(payload => new roomUsersActions.GetRoomUsersSuccessAction(payload));
      });

  constructor(private actions$: Actions, private usersService: UsersService) {
  }
}
