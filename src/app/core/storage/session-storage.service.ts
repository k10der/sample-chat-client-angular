import { Injectable } from '@angular/core';

import { AppStorage } from './app-storage';

@Injectable()
export class SessionStorage implements AppStorage {
  private storage;

  constructor() {
    this.storage = sessionStorage;
  }

  getItem(key: string): any {
    return this.storage.getItem(key);
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }
}
