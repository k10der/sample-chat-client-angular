/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RoomComponent } from './room.component';

describe('RoomComponent', () => {
  let component: RoomComponent;
  let fixture: ComponentFixture<RoomComponent>;

  class ActivatedRouteMock {
    params: Params;

    constructor() {
      this.params = Observable.of({chatId: '1'});
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RoomComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteMock,
        }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
