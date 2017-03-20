import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { StorageService } from './storage/storage.service';

@Injectable()
export class AuthService {
  // Setting backend URL
  private backendUrl = environment.backendUrl;
  // Setting token name
  private tokenName = environment.userTokenName;

  constructor(private http: Http,
              private storage: StorageService) {
  }

  /**
   * Authenticate a user with provided credentials
   *
   * @param username
   * @param password
   * @return {Observable<any>}
   */
  authenticate(username: string, password: string): Observable<any> {
    return this.http
      .post(`${this.backendUrl}/api/v1/auth/local`, {username, password})
      .map((res: Response) => {
        // Getting response's data
        const body = res.json();
        // Setting user's token
        this.storage.setItem(this.tokenName, body['token']);

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
  isAuthenticated(): boolean {
    return tokenNotExpired(this.tokenName);
  }

  /**
   * Handle log out logic (clear saved token)
   */
  logOut(): void {
    this.storage.removeItem(this.tokenName);
  }
}
