import { Injectable } from '@angular/core';

import { AppStorage } from './app-storage';

@Injectable()
export class ObjectStorage implements AppStorage {
  // Data storage
  private data: Object;

  constructor() {
    this.data = {};
  }

  getItem(key: string): any {
    return this.data[key];
  }

  removeItem(key: string): void {
    delete this.data[key];
  }

  setItem(key: string, value: string): void {
    this.data[key] = value;
  }
}
