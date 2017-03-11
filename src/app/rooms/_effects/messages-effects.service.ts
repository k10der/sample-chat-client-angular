import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';

import * as messagesActions from '../_actions/messages.actions';
import { Message } from '../_models/message.model';
import { MessagesService } from '../messages.service';
import { Room } from '../_models/room.model';

@Injectable()
export class MessagesEffectsService {
  @Effect()
  getMessages$: Observable<Action> =
    this.actions$.ofType(messagesActions.ActionTypes.GET_MESSAGES)
      .map(toPayload)
      .switchMap(({roomId}: {roomId: string}) => this.messagesService.getMessages(roomId))
      .map((payload: {room: Room, messages: Message[]}) => {
        return new messagesActions.GetMessagesSuccessAction(payload);
      });

  @Effect()
  sendMessage$: Observable<Action> =
    this.actions$.ofType(messagesActions.ActionTypes.SEND_MESSAGE)
      .map(toPayload)
      .switchMap(({roomId, message}: {roomId: string, message: Message}) => {
        return this.messagesService.sendMessage(roomId, message);
      })
      .map((payload: {roomId: string, message: Message}) => {
        return new messagesActions.SendMessageSuccessAction(payload);
      });

  constructor(private actions$: Actions,
              private messagesService: MessagesService) {
  }
}
