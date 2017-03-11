import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do'

import * as roomsActions from '../_actions/rooms.actions';
import * as roomsReducer from '../_reducers/rooms.reducer';
import { RoomsEffectsService } from '../_effects/rooms-effects.service';
import { Room } from '../_models/room.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: 'room-list.component.html',
  styleUrls: ['room-list.component.scss']
})
export class RoomListComponent implements OnInit, OnDestroy {

  rooms: Observable<any>;
  availableRooms$: Observable<any>;
  roomsFlags$: Observable<any>;
  joinRoomSuccess$: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private roomsEffectsService: RoomsEffectsService,
              private store: Store<any>) {
    this.availableRooms$ = this.store.select(roomsReducer.getAvailableRooms);
    this.roomsFlags$ = this.store.select(roomsReducer.getRoomsFlags);
  }

  ngOnInit() {
    this.store.dispatch(new roomsActions.GetRoomsAction(null));
    this.joinRoomSuccess$ =
      this.roomsEffectsService.joinRoomSuccess$
        .subscribe((room: Room) => {
          this.router.navigate([room.id], {relativeTo: this.route});
        });
  }

  ngOnDestroy(): void {
    this.joinRoomSuccess$.unsubscribe();
  }

  /**
   * Create room with a given title
   *
   * @param {string} title - A title of a new room
   */
  createRoom(title) {
    // TODO
    this.store.dispatch(new roomsActions.CreateRoomAction(
      {
        id: (new Date()).toString(),
        title: title,
        createdAt: new Date(),
        isPrivate: false,
      }
    ));
  }

  /**
   * Join chat room
   *
   * @param {Room} room - Room object
   * @param {MouseEvent} e - Current mouse event
   */
  joinRoom(room: Room, e: MouseEvent): void {
    if (e.altKey) {
      this.store.dispatch(new roomsActions.DeleteRoomAction(room));
    } else {
      this.store.dispatch(new roomsActions.JoinRoomAction(room.id));
    }
  }
}
