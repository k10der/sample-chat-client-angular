/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router } from '@angular/router';

import { RoomsService } from '../rooms.service';
import { IsAuthenticatedGuard } from './is-joined.guard';
import createSpy = jasmine.createSpy;

describe('IsAuthenticatedGuard', () => {
  class RoomsServiceMock {
    isLoggedIn() {
    }
  }

  class RouterMock {
    navigate() {
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: RoomsService,
          useClass: RoomsServiceMock,
        },

        IsAuthenticatedGuard,
      ],
    });
  });

  describe('#canActivate', () => {
    it(
      `returns true if there is a user is logged-in`,
      inject([Router, RoomsService, IsAuthenticatedGuard],
        (r: Router, as: RoomsService, guard: IsAuthenticatedGuard) => {
          const isLoggedInSpy = spyOn(as, 'isLoggedIn').and.returnValue(true);
          const navigateSpy = spyOn(r, 'navigate').and.stub();

          expect(guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)).toBe(true);
          expect(isLoggedInSpy).toHaveBeenCalled();
          expect(navigateSpy).not.toHaveBeenCalled();
        }));
    it(
      `returns false if there isn't a logged-in user`,
      inject([Router, RoomsService, IsAuthenticatedGuard],
        (r: Router, as: RoomsService, guard: IsAuthenticatedGuard) => {
          const isLoggedInSpy = spyOn(as, 'isLoggedIn').and.returnValue(false);
          const navigateSpy = spyOn(r, 'navigate').and.stub();

          expect(guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)).toBe(false);
          expect(isLoggedInSpy).toHaveBeenCalled();
          expect(navigateSpy).toHaveBeenCalledWith(['login']);
        }));
  });

  describe('#canLoad', () => {
    it(
      `returns true if there is a user is logged-in`,
      inject([Router, RoomsService, IsAuthenticatedGuard],
        (r: Router, as: RoomsService, guard: IsAuthenticatedGuard) => {
          const isLoggedInSpy = spyOn(as, 'isLoggedIn').and.returnValue(true);
          const navigateSpy = spyOn(r, 'navigate').and.stub();

          expect(guard.canLoad({} as Route)).toBe(true);
          expect(isLoggedInSpy).toHaveBeenCalled();
          expect(navigateSpy).not.toHaveBeenCalled();
        }));
    it(
      `returns false if there isn't a logged-in user`,
      inject([Router, RoomsService, IsAuthenticatedGuard],
        (r: Router, as: RoomsService, guard: IsAuthenticatedGuard) => {
          const isLoggedInSpy = spyOn(as, 'isLoggedIn').and.returnValue(false);
          const navigateSpy = spyOn(r, 'navigate').and.stub();

          expect(guard.canLoad({} as Route)).toBe(false);
          expect(isLoggedInSpy).toHaveBeenCalled();
          expect(navigateSpy).toHaveBeenCalledWith(['login']);
        }));
  });
});
