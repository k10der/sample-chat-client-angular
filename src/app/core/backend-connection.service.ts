import { Injectable, OpaqueToken, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinctUntilChanged';
import Socket = SocketIOClient.Socket;

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export const socketIOLibrary = new OpaqueToken('socketIO.library');

@Injectable()
export class BackendConnectionService {
  // Setting backend URL
  private backendUrl = environment.backendUrl;
  // Socket instance
  private socket: Socket;

  // Flag for `emit` event
  private withAckFlag: boolean;

  constructor(@Inject(socketIOLibrary) private socketIO: any,
              private authService: AuthService) {
    this.authService.isLoggedIn$
      .distinctUntilChanged()
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          // If the main socket doesn't exist
          if (!this.socket) {
            // Connecting
            this.connect();
          }
        } else {
          // If the main socket exists
          if (this.socket) {
            // Disconnecting
            this.disconnect();
          }
        }
      });
  }

  /**
   * Connect to the backend and initialize the main socket instance
   */
  connect() {
    this.socket = this.socketIO(this.backendUrl, {
      path: '/chats',
      query: `token=${this.authService.getToken()}`,
    });
  }

  /**
   * Disconnect and destroy the main socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = null;
  }

  /**
   * Method to emit new event on the server-side
   *
   * @param {string} eventName
   * @param {*?} message
   * @return {Observable<any>}
   */
  emit(eventName: string, message?: any): Observable<any> {
    // If acknowledgement is required
    if (this.withAckFlag) {
      // Clearing `withAckFlag`
      this.withAckFlag = false;
      // Returning new observable
      return Observable.create(subscribe => {
        // Emitting an event
        this.socket.emit(eventName, message, res => {
          // Emitting response value
          subscribe.next(res);
          // Completing the observable
          subscribe.complete();
        });
      });
    }

    // Emitting an event
    this.socket.emit(eventName, message);
    // Returning a completed observable immediately
    return Observable.of(true);
  }

  listenTo(eventName: string): Observable<any> {
    return new Observable(observer => {
      // Defining a listener function
      const listener = res => {
        observer.next(res);
      };
      this.socket.on(eventName, listener);

      return () => {
        this.socket.off(eventName, listener);
      };
    });
  }

  /**
   * Trick to dynamically set ack flag to the `emit` function
   *
   * @return {BackendConnectionService}
   */
  get withAck() {
    // Setting internal flag
    this.withAckFlag = true;
    // Returning current instance for calls to be chained
    return this;
  }
}
