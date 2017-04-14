import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

import * as messagesActions from '../_actions/messages.actions';
import * as messagesReducer from '../_reducers/messages.reducer';
import * as roomUsersReducer from '../_reducers/room-users.reducer';
import * as roomsActions from '../_actions/rooms.actions';
import { Message } from '../_models/message.model';
import { MessagesService } from '../messages.service';
import { Room } from '../_models/room.model';
import { RoomsEffectsService } from '../_effects/rooms-effects.service';
import { User } from '../../core/_models/user.model';

@Component({
  templateUrl: 'room.html',
  styleUrls: ['room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  public roomId: string;
  public messages$: Observable<Message[]>;
  public users$: Observable<User[]>;

  private leaveRoomSuccess$: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messagesService: MessagesService,
              private roomsEffectsService: RoomsEffectsService,
              private router: Router,
              private store: Store<any>) {
  }

  ngOnInit() {
    // TODO to be moved
    this.leaveRoomSuccess$ = this.roomsEffectsService.leaveRoom$
      .map(toPayload)
      .subscribe((room: Room) => {
        if (room.id === this.roomId) {
          this.router.navigate(['../'], {relativeTo: this.activatedRoute});
        }
      });

    this.messages$ =
      this.activatedRoute.params
        .switchMap((params: Params) => {
          this.roomId = params['roomId'];
          return this.store.select(messagesReducer.getRoomMessages(this.roomId));
        });

    this.users$ =
      this.activatedRoute.params
        .switchMap((params: Params) => {
          this.roomId = params['roomId'];
          return this.store.select(roomUsersReducer.getRoomUsersEntries(this.roomId));
        })
        .map((users: User[]) => {
          return users.sort((u1: User, u2: User) => +(u1.username > u2.username));
        });
  }

  ngOnDestroy(): void {
    this.leaveRoomSuccess$.unsubscribe();
  }

  /**
   * Leave the current room
   * @param {string} roomId - Room id
   */
  leaveRoom(roomId: string) {
    this.store.dispatch(new roomsActions.LeaveRoomAction(roomId));
  }

  /**
   * Handle a press of `Enter` key
   *
   * @param {KeyboardEvent} event
   * @param {HTMLFormElement} form
   */
  onEnterKeyPressed(event, form) {
    // If required modifier is pressed TODO add ability to choose modifier key
    if (event.ctrlKey) {
      event.preventDefault();
      event.stopPropagation();

      // Submit the form
      form.onSubmit();
    }
  }

  /**
   * Send a message to the current room
   *
   * @param {HTMLTextAreaElement} messageInput
   */
  onMessageSubmit(messageInput): void {
    // Get trimmed message
    const messageText = messageInput.value.trim();

    // If it's empty, then don't do anything
    if (!messageText.length) {
      return void 0;
    }

    // Clear current message value
    messageInput.value = '';

    this.store.dispatch(new messagesActions.SendMessageAction({
      roomId: this.roomId,
      message: this.messagesService.createMessage(messageText),
    }));
  }
}
