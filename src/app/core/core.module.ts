import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MdButtonModule, MdIconModule, MdListModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
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

import { reducer as profileReducer } from './_reducers/profile.reducer';
import { reducer as systemReducer } from './_reducers/system.reducer';

import { MainSideNavComponent } from './main-side-nav/main-side-nav.component';
import { PageContainerComponent } from './page-container/page-container.component';
import { IsAuthenticatedGuard } from './_guards/is-authenticated.guard';
import { SystemEffectsService } from './_effects/system-effects.service';

export function socketIOFactory() {
  return io;
}

@NgModule({
  imports: [
    BrowserModule,
    EffectsModule.run(ProfileEffectsService),
    EffectsModule.run(SystemEffectsService),
    HttpModule,
    RouterModule,
    MdButtonModule,
    MdIconModule,
    MdListModule,
    StoreModule.provideStore({}),
    !environment.production ? StoreDevtoolsModule.instrumentOnlyWithExtension() : [],
    SharedModule,
  ],
  declarations: [
    MainSideNavComponent,
    PageContainerComponent,
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
    {
      provide: socketIOLibrary,
      useFactory: socketIOFactory,
    },
    {
      provide: StorageService,
      useFactory: storageFactory,
      deps: [APP_STORAGE_TYPE],
    },
    AuthService,
    ProfileEffectsService,
    ProfileService,
    BackendConnectionService,
    IsAuthenticatedGuard,
    ReducersService,
    SystemEffectsService,
    UsersService,
  ],
  exports: [
    BrowserModule,
    HttpModule,
    MainSideNavComponent,
    PageContainerComponent,
  ]
})
export class CoreModule {
  constructor(private reducersService: ReducersService) {
    // Adding reducers
    this.reducersService.addReducer({
      profile: profileReducer,
      system: systemReducer,
    });
  }
}
