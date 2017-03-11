import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Room } from './_models/room.model';
import * as roomsReducer from './_reducers/rooms.reducer';

@Component({
  templateUrl: 'rooms.component.html',
  styleUrls: ['rooms.component.scss']
})
export class RoomsComponent {
  state$: Observable<any>;
  joinedRooms$: Observable<Room[]>;

  constructor(private store: Store<any>) {
    this.joinedRooms$ = this.store.select(roomsReducer.getJoinedRooms);
    this.state$ = this.store;
  }
}
