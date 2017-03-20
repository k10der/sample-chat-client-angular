import { Injectable, OpaqueToken, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/retryWhen';
// import Socket = SocketIOClient.Socket;
type Socket = any;
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { CONNECTION_STATE } from './_enums/connection-states.enum';

export const socketIOLibrary = new OpaqueToken('socketIO.library');

interface SocketEventListener {
  (res: any): void;
  socket?: Socket;
}

@Injectable()
export class BackendConnectionService {
  // Setting backend URL
  private backendUrl = environment.backendUrl;
  // Connection status observable
  private connectionState$: BehaviorSubject<CONNECTION_STATE>;
  // Flag whether listeners should be kept
  private keepListeners = false;
  // Hash to hold listeners on disconnecting
  private savedListeners: {[eventName: string]: SocketEventListener[]} = {};
  // Socket instance
  private socket: Socket;

  // Flag for `emit` event
  private withAckFlag: boolean;

  constructor(private authService: AuthService,
              @Inject(socketIOLibrary) private socketIO: any,
              private store: Store<any>) {
    this.connectionState$ = new BehaviorSubject(CONNECTION_STATE.Disconnected);
  }

  /**
   * Connect to the backend and initialize the main socket instance
   */
  connect(skipSavedListeners = false) {
    if (!this.socket) {
      // Creating a new connection
      this.socket = this.socketIO(this.backendUrl, {
        path: '/chats',
        query: `token=${this.authService.getToken()}`,
      });

      // TODO add listeners to connection events
      this.socket.on('connecting', () => this.connectionState$.next(CONNECTION_STATE.Connecting));
      this.socket.on('connect', () => this.connectionState$.next(CONNECTION_STATE.Connected));

      // If we shouldn't skip attaching previously set listeners
      if (!skipSavedListeners) {
        // If there are saved listeners
        if (Object.keys(this.savedListeners).length > 0) {
          // Iterating through the events
          for (const eventName in this.savedListeners) {
            if (this.savedListeners.hasOwnProperty(eventName)) {
              // Iterating through the listeners
              for (const listener of this.savedListeners[eventName]) {
                // Attaching a new socket object
                listener.socket = this.socket;
                // Setting an event listener
                listener.socket.on(eventName, listener);
              }
            }
          }
        }
      }

      // Clearing previously set listeners
      this.savedListeners = {};
    }
  }

  /**
   * Disconnect and destroy the main socket
   * @param {boolean} keepListeners - Should listeners be saved for further reconnection
   */
  disconnect(keepListeners = false) {
    if (this.socket) {
      // If the keep listeners flag is set
      if (keepListeners) {
        // Setting keep listeners flag
        this.keepListeners = keepListeners;
        // Clearing previously set listeners
        this.savedListeners = {};
      }

      this.socket.disconnect();
    }

    this.socket = null;
    // Clearing the keep listeners flag
    this.keepListeners = false;
  }

  /**
   * Method to emit new event on the server-side
   *
   * @param {string} eventName
   * @param {*?} message
   * @return {Observable<any>}
   */
  emit(eventName: string, message?: any): Observable<any> {
    // Getting current `withAck` flag
    const withAckFlag = this.withAckFlag;
    // Clearing `withAckFlag`
    this.withAckFlag = false;

    // Returning new observable
    return Observable
      .create(subscribe => {
        // If acknowledgement is required
        if (withAckFlag) {
          // Emitting an event
          this.socket.emit(eventName, message, res => {
            // Emitting response value
            subscribe.next(res);
            // Completing the observable
            subscribe.complete();
          });
        } else {
          // Emitting an event
          this.socket.emit(eventName, message);
          // Completing the observable
          subscribe.complete();
        }
      })
      .retryWhen((errors: Observable<any>) => {
        // TODO perform some checking based on error type

        return this.connectionState$
          .filter((state: CONNECTION_STATE) => state === CONNECTION_STATE.Connected);
      });
  }

  listenTo(eventName: string): Observable<any> {
    return Observable
      .create(subscribe => {
        // Creating a listener function object
        const listener: SocketEventListener = res => {
          subscribe.next(res);
        };
        // Setting a socket
        listener.socket = this.socket;

        // Attaching listener to the required event
        listener.socket.on(eventName, listener);
        // Gracefully completing observable
        listener.socket.on('disconnect', () => {
          // If keep listeners flag is set
          if (this.keepListeners) {
            // If event wasn't defined earlier
            if (!this.savedListeners.hasOwnProperty(eventName)) {
              this.savedListeners[eventName] = [];
            }
            // Saving a listener to an array
            this.savedListeners[eventName].push(listener);
          } else {
            // Finishing observable
            subscribe.complete();
          }
        });

        return () => {
          if (listener.socket) {
            listener.socket.off(eventName, listener);
          }
        };
      })
      .retryWhen((errors: Observable<any>) => {
        // TODO perform some checking based on error type

        return this.connectionState$
          .filter((state: CONNECTION_STATE) => state === CONNECTION_STATE.Connected);
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
