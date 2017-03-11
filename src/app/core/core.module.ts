import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';

import { authHttpFactory } from './authHttp.factory';
import { APP_STORAGE_TYPE } from './storage/app-storage';
import { AuthService } from './auth.service';
import { BackendConnectionService, socketIOLibrary } from './backend-connection.service';
import { ProfileService } from './profile.service';
import { storageFactory } from './storage/storage.factory';
import { StorageService } from './storage/storage.service';
import { UsersService } from './users.service';

import { TopMenuComponent } from './top-menu/top-menu.component';
import { IsAuthenticatedGuard } from './_guards/is-authenticated.guard';

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
      provide: APP_STORAGE_TYPE,
      useValue: environment.storageType,
    },
    {
      provide: AuthHttp,
      useFactory: authHttpFactory,
      deps: [Http, RequestOptions, AuthService],
    },
    AuthService,
    BackendConnectionService,
    ProfileService,
    {
      provide: socketIOLibrary,
      useValue: io,
    },
    {
      provide: StorageService,
      useFactory: storageFactory,
      deps: [APP_STORAGE_TYPE],
    },
    IsAuthenticatedGuard,
    UsersService,
  ],
  exports: [
    BrowserModule,
    HttpModule,
    TopMenuComponent,
  ]
})
export class CoreModule {
}
