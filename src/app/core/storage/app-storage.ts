import { OpaqueToken } from '@angular/core';

export const APP_STORAGE_TYPE = new OpaqueToken('app.storage');

export interface AppStorage {
  getItem(key: string): any;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}
