import { LocalStorage } from './local-storage.service';
import { SessionStorage } from './session-storage.service';
import { ObjectStorage } from './object-storage.service';
import { AppStorage } from './app-storage';

export function storageFactory(storageType: string): AppStorage {
  switch (storageType) {
    case 'localStorage':
      return new LocalStorage();
    case 'sessionStorage':
      return new SessionStorage();
    case 'objectStorage':
    default:
      return new ObjectStorage();
  }
}
