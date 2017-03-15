import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { Profile } from './_models/profile.model';
import { BackendConnectionService } from './backend-connection.service';

@Injectable()
export class ProfileService {
  // Setting backend URL
  private backendUrl = environment.backendUrl;

  constructor(private http: Http, private backendConnection: BackendConnectionService) {
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

  loadProfileData(): Observable<Profile> {
    return this.backendConnection.withAck.emit('get_profile_data')
      .map((res: {data: {profile: Profile}}) => {
        return res.data.profile;
      });
  }
}
