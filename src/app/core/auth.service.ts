import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { tokenNotExpired } from 'angular2-jwt';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/multicast';

import { environment } from '../../environments/environment';
import { StorageService } from './storage/storage.service';
import { LoadProfileDataAction } from './_actions/profile.actions';

@Injectable()
export class AuthService {
  isLoggedIn$: Observable<boolean>;

  // Setting backend URL
  private backendUrl = environment.backendUrl;
  // Setting token name
  private tokenName = environment.userTokenName;

  constructor(private http: Http,
              private storage: StorageService,
              private store: Store<any>) {
    this.isLoggedIn$ =
      Observable
        .interval(5000)
        .map(() => this.isLoggedIn())
        .multicast(new BehaviorSubject(this.isLoggedIn()))
        .refCount();
  }

  /**
   * Authenticate a user with provided credentials
   *
   * @param username
   * @param password
   * @return {Observable<R>}
   */
  authenticate(username: string, password: string): Observable<any> {
    return this.http
      .post(`${this.backendUrl}/api/v1/auth/local`, {username, password})
      .map((res: Response) => {
        // Getting response's data
        const body = res.json();
        // Setting user's token
        this.storage.setItem(this.tokenName, body['token']);
        // Setting current user's profile data
        this.store.dispatch(new LoadProfileDataAction());

        return body;
      })
      .catch((res: Response) => {
        // Getting response's data
        const body = res.json();
        // Creating a new error
        const error = Object.assign(new Error(body.message), {status: res.status}, body);

        return Observable.throw(error);
      });
  }

  /**
   * Get current user token
   *
   * @return {string|undefined}
   */
  getToken(): string|undefined {
    return this.storage.getItem(this.tokenName);
  }

  /**
   * Is current user logged in
   *
   * @return {boolean}
   */
  isLoggedIn(): boolean {
    return tokenNotExpired(this.tokenName);
  }
}
