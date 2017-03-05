import { Injectable } from '@angular/core';

import { AppStorage } from './app-storage';

@Injectable()
export class LocalStorage implements AppStorage {
  private storage;

  constructor() {
    this.storage = localStorage;
  }

  getItem(key: string): any {
    return this.storage.getItem(key);
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }
}
