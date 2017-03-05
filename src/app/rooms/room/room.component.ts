import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

import { RoomsService } from '../rooms.service';

@Component({
  selector: 'ca-chat',
  templateUrl: 'room.html',
  styleUrls: ['room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  public roomId: string;
  public messages: Array<any> = [];
  public messages$: Subscription;
  public params$: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private roomsService: RoomsService,) {
  }

  ngOnInit() {

    this.messages$ = this.activatedRoute
      .params
      .switchMap((params: Params) => {
        this.roomId = params['roomId'];
        return this.roomsService.joinedRooms[0].messages$;
      })
      .subscribe(message => {

        // this.messages.push(message);
      });
    this.params$ = this.activatedRoute
      .params
      .map((params: Params) => {
        this.messages = this.roomsService.joinedRoomsHash[params['roomId']].messages;
      })
      .subscribe();
  }

  ngOnDestroy(): void {
    this.messages$.unsubscribe();
    this.params$.unsubscribe();
  }

  /**
   * Send a message to a current room
   *
   * @param {string} messageText - Message's body
   */
  sendMessage(messageText: string): void {
    this.roomsService
      .sendMessage(this.roomId, messageText)
      .subscribe(() => {
      });
  }
}
