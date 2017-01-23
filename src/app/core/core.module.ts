import {BrowserModule} from '@angular/platform-browser';
import {Http, HttpModule, RequestOptions} from '@angular/http';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthHttp} from 'angular2-jwt';

import {authHttpServiceFactory} from './authHttpService.factory';
import {AuthService} from './auth.service';
import {ProfileService} from './profile.service';

import {TopMenuComponent} from './top-menu/top-menu.component';
import {IsAuthenticatedGuard} from './guards/is-authenticated.guard';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
  ],
  declarations: [
    TopMenuComponent,
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions],
    },
    AuthService,
    ProfileService,
    IsAuthenticatedGuard,
  ],
  exports: [
    BrowserModule,
    HttpModule,

    TopMenuComponent,
  ]
})
export class CoreModule {
}
