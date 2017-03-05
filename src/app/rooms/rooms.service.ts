import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';
import { BackendConnectionService } from '../core/backend-connection.service';

@Injectable()
export class RoomsService {
  // Array of currently joined rooms
  joinedRooms = [];
  // Setting backend URL
  private backendUrl = environment.backendUrl;
  // Hash of currently joined rooms
  joinedRoomsHash: any = {};
  // Subject of incoming room messages
  private roomMessages$: Subject<any>;

  constructor(private authHttp: AuthHttp,
              private backendConnection: BackendConnectionService) {
    // Creating a new subject
    this.roomMessages$ = new Subject();
    // Subscribing to room messages
    this.backendConnection
      .listenTo('room_message')
      .subscribe(this.roomMessages$);
  }

  /**
   * Create a new room in the backend
   *
   * @param {string} title - New room's title
   * @return {Observable<R>}
   */
  createRoom(title: string): Observable<any> {
    return this.backendConnection
      .withAck
      .emit('create_room', {room: {title}})
      .map(res => {
        // If an error has occurred
        if (res.error) {
          // Throwing an error
          throw res.error;
        }

        return res.data.room;
      });
  }

  /**
   * Get all the available rooms
   *
   * @return {Observable<R>}
   */
  getRooms(): Observable<any> {
    return this.backendConnection
      .withAck
      .emit('get_rooms')
      .map(res => {
        // If an error has occurred
        if (res.error) {
          // Throwing an error
          throw res.error;
        }

        return res.data.rooms;
      });
    // return this.authHttp
    //   .get(`${this.backendUrl}/api/v1/rooms`)
    //   .map((res: Response) => {
    //     // Getting response's data
    //     return res.json();
    //   });
  }

  /**
   * Is current user joined to a room
   *
   * @param {string} roomId - Id of a room to be checked
   */
  isJoinedToRoom(roomId: string): boolean {
    return this.joinedRoomsHash.hasOwnProperty(roomId);
  }

  /**
   * Join to a room with the specified id
   *
   * @param {string} roomId - Id of a room to be joined to
   * @return {Observable<R>}
   */
  joinRoom(roomId: string): Observable<any> {
    return this.backendConnection
      .withAck
      .emit('join_room', {room: {id: roomId}})
      .map(res => {
        // If an error has occurred
        if (res.error) {
          // Throwing an error
          throw res.error;
        }

        // Getting room object from the response
        let room = res.data.room;

        // Creating new subject
        let messages$ = new BehaviorSubject({});
        // Subscribe to messages
        this.roomMessages$
          .filter(response => {
            // Filtering data for a current room
            return response.data.room.id === room.id;
          })
          .map(res => {
            // Getting a message tuple from the response
            let messageTuple = res.data.messageTuple;

            try {
              // Adding new message
              this.joinedRoomsHash[room.id]
                .messages
                .push(this.createMessageFromTuple(messageTuple));
            } catch (e) {
            }

            return messageTuple;
          })
          .subscribe(messages$);

        // Creating new room object
        let joinedRoom = {
          id: room.id,
          title: room.title,
          messages: [],
          messages$: messages$,
        };

        // Adding room to joined rooms
        this.joinedRooms.push(joinedRoom);
        // Adding room to joined rooms hash
        this.joinedRoomsHash[room.id] = joinedRoom;

        // Returning data
        return res.data;
      });
  }

  /**
   * Load messages from a room
   *
   * @param {string} roomId - Required room id
   * @param {number?} limit - Number of messages, that should be returned
   * @param {boolean?} after - Should messages be loaded before or after a ts
   * @param {string?} timestamp - Timestamp (nanoseconds), that is the origin of getting messages
   */
  loadRoomMessages(roomId: string, limit: number = 20, after: boolean = false, timestamp?: number): Observable<any> {
    return this.backendConnection
      .withAck
      .emit('get_room_messages', {
        room: {
          id: roomId,
        },
        messages: {
          $query: {
            after: after,
            timestamp: timestamp,
            limit: limit,
          },
        },
      })
      .map(res => {
        // If an error has occurred
        if (res.error) {
          // Throwing an error
          throw res.error;
        }

        // Getting room object
        let room = res.data.room;
        // Getting messages array
        let messageTupleArray = res.data.messageTupleArray;

        // If a user is joined to the required room
        if (this.isJoinedToRoom(room.id)) {
          // Iterating through the messages tuple
          while (messageTupleArray.length) {
            // Creating a message tuple
            let messageTuple = [messageTupleArray.shift(), messageTupleArray.shift()];

            try {
              // Adding new message
              this.joinedRoomsHash[room.id]
                .messages
                .unshift(this.createMessageFromTuple(messageTuple));
            } catch (e) {
            }
          }
        }

        return res.data;
      });
  }

  /**
   * Leave a room with the specified id
   *
   * @param {string} roomId - Required room id
   */
  leaveRoom(roomId: string): Observable<any> {
    return this.backendConnection
      .withAck
      .emit('leave_room', {
        room: {
          id: roomId,
        },
      })
      .map(res => {
        // If an error has occurred
        if (res.error) {
          // Throwing an error
          throw res.error;
        }

        // Getting room object
        let room = res.data.room;

        // If a user is joined to the required room
        if (this.isJoinedToRoom(room.id)) {
          // Unsubscribing from messages
          this.joinedRoomsHash[room.id].messages$.unsubscribe();
          // Unsubscribing from users TODO
          // this.joinedRoomsHash[room.id].users$.unsubscribe();
        }

        return res.data;
      });
  }

  /**
   * Send message to a particular room
   *
   * @param {string} roomId - Id of a room to be sent to
   * @param {string} messageText - Message's body
   * @return {Observable<any>}
   */
  sendMessage(roomId: string, messageText: string): Observable<any> {
    // Creating a new message
    let newMessage = {
      id: -1,
      user: 'TODO-user',
      text: messageText,
      createdAt: new Date(),
      error: null,
    };

    let verificationToken = Math.random().toString(32).substring(2, 12);

    // Adding new message to messages array
    this.joinedRoomsHash[roomId].messages.push(newMessage);

    return this.backendConnection
      .withAck
      .emit('send_room_message', {
        room: {
          id: roomId,
        },
        message: {
          text: messageText
        },
        verificationToken
      })
      .map(res => {
        // TODO handle error?
        if (res.data.verificationToken) {
          if (res.data.verificationToken !== verificationToken) {
            // TODO show an alert with an error
            console.log('not validated');
          } else {
            // TODO set message id
            try {
              Object.assign(newMessage, this.createMessageFromTuple(res.data.messageTuple));
            } catch (e) {
              newMessage.error = 'Some error has occurred';
            }
          }
        }

        return res;
      });
  }

  /**
   * Process message tuple and return message object
   *
   * @param {Array} messageTuple - Message tuple
   */
  private createMessageFromTuple(messageTuple: Array<any>): any {
    // If tuple doesn't contain exactly 2 elements
    if (messageTuple.length !== 2) {
      // TODO centralized error
      throw new Error('Wrong message tuple data.');
    }
    // Getting message's timestamp and data
    const [messageData, messageTimestamp] = messageTuple;

    try {
      return {
        id: messageData.substring(0, 36),
        user: messageData.substring(37, messageData.lastIndexOf(':')),
        text: messageData.substr(messageData.lastIndexOf(':') + 1),
        ts: messageTimestamp,
        createdAt: new Date(messageTimestamp / 1000),
      };
    } catch (e) {
      // TODO centralized error
      throw new Error('Wrong message tuple data.');
    }
  }
}
