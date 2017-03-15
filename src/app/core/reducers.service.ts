import { Injectable } from '@angular/core';
import { ActionReducer, Store, combineReducers } from '@ngrx/store';

@Injectable()
export class ReducersService {
  private currentReducers: {[reducerKey: string]: ActionReducer<any>} = {};

  constructor(private store: Store<any>) {
  }

  addReducer(reducerObject: {[reducerKey: string]: ActionReducer<any>}) {
    let iterations = 0;
    /* tslint:disable-next-line:forin */
    for (const reducerKey in reducerObject) {
      if (this.currentReducers[reducerKey]) {
        throw new Error(`${reducerKey} already exists in a store`);
      }

      this.currentReducers[reducerKey] = reducerObject[reducerKey];
      iterations++;
    }

    if (iterations) {
      this.store.replaceReducer(combineReducers(this.currentReducers));
    }
  }
}
