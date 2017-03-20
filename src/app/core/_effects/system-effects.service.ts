import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import * as broadcastActions from '../_actions/_broadcast.actions';
import * as systemActions from '../_actions/system.actions';
import { AuthService } from '../auth.service';
import { BackendConnectionService } from '../backend-connection.service';

@Injectable()
export class SystemEffectsService {
  @Effect({dispatch: false})
  connect$: Observable<Action> =
    this.actions$.ofType(systemActions.ActionTypes.CONNECT)
      .do(() => this.backendConnectionService.connect());

  @Effect({dispatch: false})
  disconnect$: Observable<Action> =
    this.actions$.ofType(systemActions.ActionTypes.DISCONNECT)
      .map(toPayload)
      .do((keepListeners = true) => this.backendConnectionService.disconnect(keepListeners));

  @Effect()
  broadcastLogout$: Observable<Action> =
    this.actions$.ofType(broadcastActions.ActionTypes.BROADCAST_LOGOUT)
      .map(toPayload)
      .do(() => this.authService.logOut())
      .map(() => new systemActions.DisconnectAction(false));

  constructor(private actions$: Actions,
              private authService: AuthService,
              private backendConnectionService: BackendConnectionService) {
  }
}
