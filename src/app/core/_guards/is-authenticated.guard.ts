import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  RouterStateSnapshot,
  Route,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';

/**
 * Guard for testing whether certain route can be
 * loaded/activated if a user is logged-in
 */
@Injectable()
export class IsAuthenticatedGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private store: Store<any>, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    return this.checkConditions();
  }

  canLoad(route: Route): Observable<boolean>|Promise<boolean>|boolean {
    return this.checkConditions();
  }

  private checkConditions(): boolean {
    // If current user is authenticated
    if (this.authService.isAuthenticated()) {
      // Continue further processing
      return true;
    } else {
      // Redirecting to `login` state
      this.router.navigate(['login']);

      return false;
    }
  }
}
