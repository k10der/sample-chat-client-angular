import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationExtras } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as roomsActions from '../_actions/rooms.actions';
import * as roomsReducer from '../_reducers/rooms.reducer';
import { RoomsEffectsService } from '../_effects/rooms-effects.service';
import { Room } from '../_models/room.model';
import { Subscription } from 'rxjs/Subscription';
import { MdDialog } from '@angular/material';
import { CreateRoomDialogComponent } from '../_dialogs/create-room-dialog/create-room-dialog.component';

@Component({
  templateUrl: 'room-list.component.html',
  styleUrls: ['room-list.component.scss']
})
export class RoomListComponent implements OnInit, OnDestroy {

  rooms: Observable<any>;
  availableRooms$: Observable<any>;
  roomsFlags$: Observable<any>;
  joinRoomSuccess$: Subscription;

  private createRoomModal$: Subscription;
  private currentParams: Params;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private roomsEffectsService: RoomsEffectsService,
              private dialog: MdDialog,
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

    this.createRoomModal$ = this.route.params
      .subscribe((params: Params) => {
        // Saving params
        this.currentParams = {...params};

        // If action is create a room
        if (params['action'] && params['action'] === 'createRoom') {
          this.openCreateRoomDialog();
        }
      });
  }

  ngOnDestroy(): void {
    this.joinRoomSuccess$.unsubscribe();
    this.createRoomModal$.unsubscribe();
  }

  /**
   * Create a new room with fiven parameters
   *
   * @param {Object} room - New room object
   */
  private createRoom(room) {
    // TODO
    this.store.dispatch(new roomsActions.CreateRoomAction(
      {
        ...room,
        id: (new Date()).toString(),
        createdAt: new Date(),
      }
    ));
  }

  /**
   * Open the dialog with the form to create a new room
   */
  private openCreateRoomDialog() {
    this.dialog
      .open(CreateRoomDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.createRoom(result);
        }
        console.log(result);
        // TODO If cancel if success if error
        let newParams = this.currentParams;
        delete newParams.action;
        this.router.navigate(['./'], <NavigationExtras>{replaceUrl: true, params: newParams});
      });
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
