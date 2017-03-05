import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RoomsService } from '../rooms.service';

/**
 * Guard for checking whether a chat room with the specified id
 * can be activated
 */
@Injectable()
export class IsJoinedGuard implements CanActivate {
  constructor(private roomsService: RoomsService, private router: Router) {
    console.log('guard created')
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    return this.checkConditions(route);
  }

  private checkConditions(route: ActivatedRouteSnapshot): boolean {
    // If current user is joined to the require room
    if (this.roomsService.isJoinedToRoom(route.params['roomId'])) {
      // Continue further processing
      return true;
    } else {
      // Redirecting to the upper state
      this.router.navigate(['.']);

      return false;
    }
  }
}
