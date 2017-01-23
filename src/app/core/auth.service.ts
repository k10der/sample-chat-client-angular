import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {environment} from '../../environments/environment';

@Injectable()
export class AuthService {
  // Setting backend URL
  private backendUrl = environment.backendUrl;

  constructor(private http: Http) {
  }

  /**
   * @description
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
        localStorage.setItem('user_token', body['token']);

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
   * @description
   * Is current user logged in
   *
   * @return {boolean}
   */
  isLoggedIn(): boolean {
    return tokenNotExpired('user_token');
  }
}
