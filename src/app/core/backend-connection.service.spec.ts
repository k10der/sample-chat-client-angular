/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';

import { BackendConnectionService, socketIOLibrary } from './backend-connection.service';
import { StorageService } from './storage/storage.service';
import { ObjectStorage } from './storage/object-storage.service';
import createSpy = jasmine.createSpy;
import { environment } from '../../environments/environment';

describe('BackendConnectionService', () => {
  let ackCallbackSpy;
  let ioMock;
  let emitSpy;

  beforeEach(() => {
    emitSpy = createSpy('emit').and.callFake((eventName, message, cb) => {
      ackCallbackSpy = createSpy('ackCallbackSpy').and.callFake(() => cb(true));
      if (cb) {
        ackCallbackSpy();
      }
    });
    ioMock = createSpy('io').and.returnValue({
      emit: emitSpy,
    });

    TestBed.configureTestingModule({
      providers: [
        BackendConnectionService,
        {
          provide: StorageService,
          useClass: ObjectStorage,
        },
        {
          provide: socketIOLibrary,
          useValue: ioMock,
        }
      ]
    });
  });

  it('should connect to the backend on creation', inject(
    [BackendConnectionService, StorageService],
    (service: BackendConnectionService, storage: StorageService) => {
      expect(ioMock).toHaveBeenCalledWith(environment.backendUrl,
        {
          path: '/chats',
          query: `token=${storage.getItem(environment.userTokenName)}`,
        });
    }));

  describe('#emit', () => {
    it('should call backend without ack if ack flag wasn\'t set', inject(
      [BackendConnectionService, StorageService],
      (service: BackendConnectionService) => {
        service.emit('event')
          .subscribe(res => {
            expect(res).toEqual(true);
            expect(emitSpy).toHaveBeenCalledWith('event', undefined);
            expect(ackCallbackSpy).not.toHaveBeenCalled();
          });

        service.emit('event', 'data')
          .subscribe(res => {
            expect(res).toEqual(true);
            expect(emitSpy).toHaveBeenCalledWith('event', 'data');
            expect(ackCallbackSpy).not.toHaveBeenCalled();
          });
      }));

    it('should call backend with ack if ack flag was set', inject(
      [BackendConnectionService, StorageService],
      (service: BackendConnectionService) => {
        service
          .withAck
          .emit('event')
          .subscribe(res => {
            expect(res).toEqual(true);
            expect(emitSpy.calls.mostRecent().args[0]).toEqual('event');
            expect(emitSpy.calls.mostRecent().args[1]).toBeUndefined();
            expect(ackCallbackSpy).toHaveBeenCalled();
          });

        service
          .withAck
          .emit('event', 'data')
          .subscribe(res => {
            expect(res).toEqual(true);
            expect(emitSpy.calls.mostRecent().args[0]).toEqual('event');
            expect(emitSpy.calls.mostRecent().args[1]).toEqual('data');
            expect(ackCallbackSpy).toHaveBeenCalled();
          });
      }));
  });
});
