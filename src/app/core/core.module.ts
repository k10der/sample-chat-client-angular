import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { AuthHttp } from 'angular2-jwt';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';

import { authHttpFactory } from './authHttp.factory';
import { APP_STORAGE_TYPE } from './storage/app-storage';
import { AuthService } from './auth.service';
import { BackendConnectionService, socketIOLibrary } from './backend-connection.service';
import { ProfileEffectsService } from './_effects/profile-effects.service';
import { ProfileService } from './profile.service';
import { storageFactory } from './storage/storage.factory';
import { ReducersService } from './reducers.service';
import { SharedModule } from '../shared/shared.module';
import { StorageService } from './storage/storage.service';
import { UsersService } from './users.service';
import * as profileActions from './_actions/profile.actions';

import { reducer as profileReducer }  from './_reducers/profile.reducer';
import { reducer as systemReducer } from './_reducers/system.reducer';

import { TopMenuComponent } from './top-menu/top-menu.component';
import { IsAuthenticatedGuard } from './_guards/is-authenticated.guard';
import { StoreModule, Store } from '@ngrx/store';


@NgModule({
  imports: [
    BrowserModule,
    EffectsModule.run(ProfileEffectsService),
    HttpModule,
    RouterModule,
    SharedModule,
    StoreModule.provideStore({}),
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
    ProfileEffectsService,
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
    ReducersService,
    UsersService,
  ],
  exports: [
    BrowserModule,
    HttpModule,
    TopMenuComponent,
  ]
})
export class CoreModule {
  constructor(private authService: AuthService,
              private profileEffectsService: ProfileEffectsService,
              private reducersService: ReducersService,
              private store: Store<any>) {
    // Adding reducers
    this.reducersService.addReducer({
      profile: profileReducer,
      system: systemReducer,
    });

    // If the user is logged in
    if (this.authService.isLoggedIn()) {
      // Requesting profile data
      this.store.dispatch(new profileActions.LoadProfileDataAction());
    }
  }
}
