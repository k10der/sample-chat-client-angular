/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule, XHRBackend, Http, Response, ResponseOptions, Headers } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import * as jwt from 'angular2-jwt';
import createSpy = jasmine.createSpy;

import { ErrorResponse } from '../../testing/polyfills';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { StorageService } from './storage/storage.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        AuthService,
        {provide: XHRBackend, useClass: MockBackend},
        StorageService,
      ],
    });
  });

  describe('#authenticate', () => {
    it(
      `returns Observable, that emits a token object if valid credentials are provided`,
      inject([AuthService, Http, StorageService, XHRBackend],
        (service: AuthService, http: Http, storage: StorageService, backend: MockBackend) => {
          const username = 'username';
          const password = 'password';
          const expectedToken = 'token value';
          const postSpy = spyOn(http, 'post').and.callThrough();

          const responseOptions = new ResponseOptions({
            status: 200,
            body: JSON.stringify({token: expectedToken}),
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
          });
          backend.connections
            .subscribe((c: MockConnection) => c.mockRespond(new Response(responseOptions)));

          service.authenticate(username, password)
            .subscribe(data => {
              expect(data).toEqual({token: expectedToken});
              expect(storage.getItem(environment.userTokenFieldName)).toEqual(expectedToken);
            });

          expect(postSpy).toHaveBeenCalledWith(
            `${environment.backendUrl}/api/v1/auth/local`,
            {
              username: username,
              password: password
            }
          );
        }));

    it(
      `returns Observable, that throws an error object if invalid credentials are provided`,
      inject([AuthService, Http, XHRBackend], (service: AuthService, http: Http, backend: MockBackend) => {
        const username = 'invalid_username';
        const password = 'invalid_password';
        const postSpy = spyOn(http, 'post').and.callThrough();

        const responseOptions = new ResponseOptions({
          status: 401,
          body: {
            code: 100001,
            message: 'Invalid username or password.',
          },
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        });
        backend.connections
          .subscribe((c: MockConnection) => c.mockError(new ErrorResponse(responseOptions)));

        service.authenticate(username, password)
          .subscribe(
            () => {
            },
            error => {
              expect(error.status).toBeDefined();
              expect(error.code).toBeDefined();
              expect(error.message).toBeDefined();
            });

        expect(postSpy).toHaveBeenCalledWith(
          `${environment.backendUrl}/api/v1/auth/local`,
          {
            username: username,
            password: password
          }
        );
      }));
  });

  describe('#isAuthenticated', () => {
    it(
      `returns true if a valid user token is available`,
      inject([AuthService], (service: AuthService) => {
        const tokenNotExpiredSpy = spyOn(jwt, 'tokenNotExpired').and.returnValue(true);

        expect(service.isAuthenticated()).toBe(true);
        expect(tokenNotExpiredSpy).toHaveBeenCalled();
      }));

    it(
      `returns false if a valid user token isn't available`,
      inject([AuthService], (service: AuthService) => {
        const tokenNotExpiredSpy = spyOn(jwt, 'tokenNotExpired').and.returnValue(false);

        expect(service.isAuthenticated()).toBe(false);
        expect(tokenNotExpiredSpy).toHaveBeenCalled();
      }));
  });
});
