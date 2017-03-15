import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as roomsReducer from './rooms/_reducers/rooms.reducer';
import { Room } from './rooms/_models/room.model';

@Component({
  selector: 'ca-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  joinedRooms$: Observable<any>;

  constructor(private router: Router, private store: Store<any>) {
    this.joinedRooms$ = this.store.select(roomsReducer.getJoinedRooms);
  }

  ngOnInit(): void {
  }

  goToRooms() {
    this.router.navigate(['/rooms']);
  }
}
