import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AuthService } from './auth.service';

export function authHttpFactory(http: Http,
                                options: RequestOptions,
                                authService: AuthService,) {
  return new AuthHttp(
    new AuthConfig({
      tokenGetter: authService.getToken.bind(authService),
    }), http, options);
}
