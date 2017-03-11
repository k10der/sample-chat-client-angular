import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { BackendConnectionService } from '../core/backend-connection.service';
import { Message } from './_models/message.model';
import * as messagesActions from './_actions/messages.actions';
import { Room } from './_models/room.model';

@Injectable()
export class MessagesService {
  constructor(private backendConnection: BackendConnectionService, private store: Store<any>) {
    // Subscribing to room messages
    this.backendConnection
      .listenTo('room_message')
      .subscribe(res => {
        let {room, messageTuple}:{room: Room, messageTuple: any[]} = res.data;

        let message: Message = <Message>{};

        try {
          // Adding new message
          message = this.createMessageFromTuple(messageTuple);
        } catch (e) {
        }

        this.store.dispatch(new messagesActions.AddMessageAction({room, message}));
      });
  }

  createMessage(messageText: string): Message {
    let verificationToken = Math.random().toString(32).substring(2, 12);

    return {
      id: verificationToken,
      user: 'TODO-user',
      text: messageText,
      createdAt: new Date(),
      isPending: true,
      verificationToken,
    };
  }

  /**
   * Load messages from a room
   *
   * @param {string} roomId - Required room id
   * @param {number?} limit - Number of messages, that should be returned
   * @param {boolean?} after - Should messages be loaded before or after a ts
   * @param {string?} timestamp - Timestamp (nanoseconds), that is the origin of getting messages
   */
  getMessages(roomId: string, limit: number = 20, after: boolean = false, timestamp?: number): Observable<any> {
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

        let messages = [];

        // Iterating through the messages tuple
        while (messageTupleArray.length) {
          // Creating a message tuple
          let messageTuple = [messageTupleArray.shift(), messageTupleArray.shift()];

          try {
            // Adding new message
            messages.unshift(this.createMessageFromTuple(messageTuple));
          } catch (e) {
          }
        }

        return {
          room,
          messages,
        };
      });
  }

  /**
   * Send message to a particular room
   *
   * @param {string} roomId - Id of a room to be sent to
   * @param {Message} message - Message object
   * @return {Observable<any>}
   */
  sendMessage(roomId: string, message: Message): Observable<any> {
    return this.backendConnection
      .withAck
      .emit('send_room_message', {
        room: {
          id: roomId,
        },
        message,
        verificationToken: message.id,
      })
      .map(res => {
        let newMessage: Message;
        let verificationToken = res.data.verificationToken;

        // TODO handle error?
        if (verificationToken) {
          if (verificationToken !== message.id) {
            // TODO show an alert with an error
            console.log('not validated');
            throw new Error('Not verified');
          } else {
            // TODO set message id
            try {
              newMessage = this.createMessageFromTuple(res.data.messageTuple);
              newMessage.verificationToken = verificationToken;
            } catch (e) {
              throw new Error('Some error has occurred verified');
            }
          }
        }

        return {
          roomId,
          message: newMessage,
        };
      });
  }

  /**
   * Process message tuple and return message object
   *
   * @param {Array} messageTuple - Message tuple
   */
  private createMessageFromTuple(messageTuple: Array<any>): Message {
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
        createdAt: new Date(messageTimestamp / 1000),
      };
    } catch (e) {
      // TODO centralized error
      throw new Error('Wrong message tuple data.');
    }
  }
}
