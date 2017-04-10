import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { CONNECTION_STATE } from './core/_enums/connection-states.enum';
import * as broadcastActions from './core/_actions/_broadcast.actions';
import * as systemActions from './core/_actions/system.actions';
import * as profileActions from './core/_actions/profile.actions';
import * as systemReducer from './core/_reducers/system.reducer';
import * as profileReducer from './core/_reducers/profile.reducer';
import * as roomsReducer from './rooms/_reducers/rooms.reducer';
import { Room } from './rooms/_models/room.model';
import { AuthService } from './core/auth.service';
import { SystemEffectsService } from './core/_effects/system-effects.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ca-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  // Connection state
  connection$: Observable<any>;
  // Array of joined rooms
  joinedRooms$: Observable<Room[]>;
  // User's profile
  profile$: Observable<any>;

  private broadcastLogout$: Subscription;
  private processConnection$: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<any>,
              private systemEffectsService: SystemEffectsService) {
    this.connection$ = this.store.select(systemReducer.getConnectionState);
    this.profile$ = this.store.select(profileReducer.getProfile);
    this.joinedRooms$ = this.store.select(roomsReducer.getJoinedRooms);
  }

  ngOnInit(): void {
    // Initializing connection processing logic
    // to connect if a user is logged in,
    // but is not currently connected
    this.processConnection$ =
      Observable
        .combineLatest([
          this.connection$,
          this.profile$,
        ])
        .distinctUntilChanged()
        .subscribe(data => {
          const [connection, profile] = data;

          // If authenticated and disconnected
          if (profile.isAuthenticated && connection.state === CONNECTION_STATE.Disconnected) {
            // Requesting a connection action
            this.store.dispatch(new systemActions.ConnectAction());
          }
        });

    // Setting handler for logout
    this.broadcastLogout$ = this.systemEffectsService.broadcastLogout$
      .subscribe(() => {
        // Navigating to the root route
        this.router.navigate(['/']);
      });

    // Dispatching initial action to set current authentication state
    this.store.dispatch(new profileActions.SetAuthenticationStateAction({isAuthenticated: this.authService.isAuthenticated()}));
  }

  ngOnDestroy(): void {
    this.broadcastLogout$.unsubscribe();
    this.processConnection$.unsubscribe();
  }

  onLogoutClick(): void {
    // TODO show confirmation
    // Dispatch logout action
    this.store.dispatch(new broadcastActions.BroadcastLogoutActionAction());
  }
}
