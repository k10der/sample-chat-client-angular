/* tslint:disable:no-unused-variable */
import {TestBed, async, fakeAsync, tick, discardPeriodicTasks} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';

import {AppComponent} from './app.component';
import {AuthService} from './core/auth.service';

describe('AppComponent', () => {
  class AuthServiceMock {
    isLoggedIn() {
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceMock,
        }
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
