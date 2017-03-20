import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import * as roomsReducer from '../_reducers/rooms.reducer';

/**
 * Guard for checking whether a chat room with the specified id
 * can be activated
 */
@Injectable()
export class IsJoinedGuard implements CanActivate {
  constructor(private store: Store<any>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    return this.store.select(roomsReducer.getJoinedRoomsIds)
      .map((ids: string[]) => ids.indexOf(route.params['roomId']) !== -1)
      .take(1);
  }
}
