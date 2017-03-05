import { Injectable } from '@angular/core';

import { AppStorage } from './app-storage';
import { ObjectStorage } from './object-storage.service';

@Injectable()
export class StorageService extends ObjectStorage implements AppStorage {
}
