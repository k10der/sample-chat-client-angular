import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RoomsService } from './rooms.service';

@Component({
  selector: 'ca-chats',
  templateUrl: 'rooms.component.html',
  styleUrls: ['rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  rooms: Observable<any>;
  joinedRooms: Array<any>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private roomsService: RoomsService) {
    // Setting a link to joined rooms
    this.joinedRooms = this.roomsService
      .joinedRooms;
  }

  ngOnInit() {
    // Getting all available rooms
    this.rooms = this.roomsService.getRooms();
  }

  /**
   * Create room with a given title
   *
   * @param {string} title - A title of a new room
   */
  createRoom(title) {
    this.roomsService
      .createRoom(title)
      .subscribe(
        () => {
          console.log('created');
        },
        err => {
          console.log(err);
        }
      );
  }

  /**
   * Join chat room
   *
   * @param {string} roomId - Id of room to be joined to
   */
  joinRoom(roomId: string): void {
    this.roomsService
      .joinRoom(roomId)
      .subscribe(
        res => {
          // Navigating to a particular room
          this.router.navigate([res.room.id], {relativeTo: this.route});
          // Load room messages
          this.roomsService.loadRoomMessages(res.room.id, 20, false);
        },
        err => {
          // TODO
          console.log('err', err);
        },
      );
  }
}
