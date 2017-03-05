import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RoomsService } from '../rooms.service';

@Component({
  selector: 'ca-chats',
  templateUrl: 'room-list.component.html',
  styleUrls: ['room-list.component.scss']
})
export class RoomListComponent implements OnInit {
  rooms: Observable<any>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private roomsService: RoomsService) {
  }

  ngOnInit() {
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
    // Function to navigate to a room
    const navigateToRoom = roomId => {
      // Navigating to a particular room
      this.router.navigate([roomId], {relativeTo: this.route});
    };

    if (this.roomsService.isJoinedToRoom(roomId)) {
      return navigateToRoom(roomId);
    }

    this.roomsService
      .joinRoom(roomId)
      .subscribe(
        res => {
          // Navigating to a particular room
          navigateToRoom(res.room.id);
          // Load room messages
          this.roomsService.loadRoomMessages(res.room.id)
            .toPromise();
        },
        err => {
          // TODO
          console.log('err', err);
        },
      );
  }
}
