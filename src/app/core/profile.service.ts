import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Injectable()
export class ProfileService {
  // Setting backend URL
  private backendUrl = environment.backendUrl;

  constructor(private http: Http) {
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/api/v1/users`, {user: user})
      .catch((err: Response|any) => {
        // TODO
        return <any>Observable.of([1]);
      })
      .map((res: Response) => {
        if (res.constructor === Response) {
          return true;
        }

        return false;
      });
  }
}
